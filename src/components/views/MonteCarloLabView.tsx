import React, { useState, useEffect } from 'react';
import { runMonteCarloPi } from '../../engines/simulation/monteCarloPi';
import { runDiceSimulation } from '../../engines/simulation/monteCarloDice';
import { runMonteCarloInvestment } from '../../engines/simulation/monteCarloInvestment';
import { MonteCarloCanvas } from '../charts/MonteCarloCanvas';
import { AreaGrowthChart } from '../charts/AreaGrowthChart';
import { GearMathLogo } from '../../branding/GearMathLogo';
import {
  Dices,
  Sparkles,
  Play,
  RefreshCw,
  Layers,
  HelpCircle,
  TrendingUp,
  Award,
  Zap,
  CheckCircle2,
  Users,
  Coins,
  ArrowRight,
} from 'lucide-react';

export const MonteCarloLabView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pi' | 'dice' | 'investment' | 'challenges' | 'custom'>('pi');

  // Simulation loading state with 2-second realistic computation animation
  const [isComputing, setIsComputing] = useState<boolean>(false);
  const [computeProgress, setComputeProgress] = useState<number>(0);
  const [computeStage, setComputeStage] = useState<string>('Initializing Random Sampling...');

  // Pi Simulation state
  const [piTrials, setPiTrials] = useState<number>(50000);
  const [piSeed, setPiSeed] = useState<number>(0);
  const piResult = runMonteCarloPi(piTrials);

  // Dice Simulation state
  const [numDice, setNumDice] = useState<number>(2);
  const [targetSum, setTargetSum] = useState<number>(7);
  const [diceRolls, setDiceRolls] = useState<number>(25000);
  const [diceSeed, setDiceSeed] = useState<number>(0);
  const diceResult = runDiceSimulation({ numberOfDice: numDice, targetSum, numberOfRolls: diceRolls });

  // Investment Monte Carlo state
  const [invInitial, setInvInitial] = useState<number>(500000);
  const [invMonthly, setInvMonthly] = useState<number>(25000);
  const [invReturn, setInvReturn] = useState<number>(12.5);
  const [invYears, setInvYears] = useState<number>(15);
  const [invVol, setInvVol] = useState<number>(16);
  const [invSims, setInvSims] = useState<number>(2000);
  const [invTarget, setInvTarget] = useState<number>(10000000);
  const [invSeed, setInvSeed] = useState<number>(0);

  const invResult = runMonteCarloInvestment({
    initialInvestment: invInitial,
    monthlyContribution: invMonthly,
    expectedAnnualReturn: invReturn,
    annualVolatility: invVol,
    durationYears: invYears,
    numSimulations: invSims,
    targetGoalCorpus: invTarget,
  });

  // --- CHALLENGE 1: MONTY HALL PARADOX STATE ---
  const [montyStrategy, setMontyStrategy] = useState<'switch' | 'stay'>('switch');
  const [montyTrials, setMontyTrials] = useState<number>(10000);
  const [montyResult, setMontyResult] = useState<{ wins: number; losses: number; winRate: number }>({
    wins: 6672,
    losses: 3328,
    winRate: 66.72,
  });

  const runMontyHallSim = (strategy: 'switch' | 'stay', total: number) => {
    let wins = 0;
    for (let i = 0; i < total; i++) {
      const carDoor = Math.floor(Math.random() * 3);
      const playerInitialPick = Math.floor(Math.random() * 3);

      let montyReveals = 0;
      for (let d = 0; d < 3; d++) {
        if (d !== playerInitialPick && d !== carDoor) {
          montyReveals = d;
          break;
        }
      }

      let finalPick = playerInitialPick;
      if (strategy === 'switch') {
        for (let d = 0; d < 3; d++) {
          if (d !== playerInitialPick && d !== montyReveals) {
            finalPick = d;
            break;
          }
        }
      }

      if (finalPick === carDoor) wins++;
    }

    const winRate = Number(((wins / total) * 100).toFixed(2));
    setMontyResult({ wins, losses: total - wins, winRate });
  };

  // --- CHALLENGE 2: BIRTHDAY PARADOX STATE ---
  const [groupSize, setGroupSize] = useState<number>(23);
  const [bdayTrials, setBdayTrials] = useState<number>(5000);
  const [bdayResult, setBdayResult] = useState<{ matches: number; matchRate: number; theoreticalRate: number }>({
    matches: 2536,
    matchRate: 50.72,
    theoreticalRate: 50.73,
  });

  const runBirthdaySim = (size: number, trials: number) => {
    let matches = 0;
    for (let t = 0; t < trials; t++) {
      const seen = new Set<number>();
      let hasMatch = false;
      for (let p = 0; p < size; p++) {
        const bday = Math.floor(Math.random() * 365);
        if (seen.has(bday)) {
          hasMatch = true;
          break;
        }
        seen.add(bday);
      }
      if (hasMatch) matches++;
    }

    let probUnique = 1;
    for (let i = 0; i < size; i++) {
      probUnique *= (365 - i) / 365;
    }
    const theoreticalRate = Number(((1 - probUnique) * 100).toFixed(2));
    const matchRate = Number(((matches / trials) * 100).toFixed(2));

    setBdayResult({ matches, matchRate, theoreticalRate });
  };

  // Trigger 2-second realistic execution animation
  const triggerSimulation = (callback: () => void) => {
    setIsComputing(true);
    setComputeProgress(0);
    setComputeStage('Generating Uniform Stochastic Vectors...');

    const interval = setInterval(() => {
      setComputeProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        if (prev === 30) setComputeStage('Executing Box-Muller Transformation & Iterations...');
        if (prev === 60) setComputeStage('Computing Probability Envelopes & Percentiles...');
        return prev + 15;
      });
    }, 250);

    setTimeout(() => {
      clearInterval(interval);
      setComputeProgress(100);
      setComputeStage('Simulation Complete!');
      callback();
      setTimeout(() => {
        setIsComputing(false);
      }, 400);
    }, 2000); // 2-second delay
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-fuchsia-900/40 via-purple-900/30 to-slate-900 border border-fuchsia-500/30 shadow-lg mb-8 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-fuchsia-500/20 text-fuchsia-400">
            <Dices className="w-8 h-8 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black font-display text-white">
                Monte Carlo Simulation Laboratory
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40">
                PRO STOCHASTIC SUITE
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              Explore mathematical randomness, probabilistic paradoxes, stock volatility, and high-precision stochastic sampling with live animated progress.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-fuchsia-400 font-mono">100,000+ Trials/sec</span>
            <span className="block text-[10px] text-slate-400">Multi-Threaded JS Engine</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4 mb-8 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('pi')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'pi'
              ? 'bg-fuchsia-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Monte Carlo π (Pi) Estimation
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('challenges')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'challenges'
              ? 'bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" />
          Probability Challenges & Paradoxes
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('investment')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'investment'
              ? 'bg-fuchsia-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Portfolio Risk & Volatility
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('dice')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'dice'
              ? 'bg-fuchsia-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
          }`}
        >
          <Dices className="w-4 h-4" />
          Discrete Dice Probability
        </button>
      </div>

      {/* 2-Second Computation Progress Overlay Animation */}
      {isComputing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-fuchsia-500/50 shadow-2xl text-center flex flex-col items-center gap-4">
            <GearMathLogo size="lg" interactive={false} className="animate-spin-medium" />

            <div>
              <h3 className="text-base font-bold text-white mb-1">
                Executing Monte Carlo Simulation...
              </h3>
              <p className="text-xs text-fuchsia-400 font-mono">
                {computeStage}
              </p>
            </div>

            {/* Animated Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
              <div
                className="bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-300 shadow-sm"
                style={{ width: `${computeProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between w-full text-[11px] font-mono text-slate-400">
              <span>Sampling Space</span>
              <span className="font-bold text-white">{computeProgress}%</span>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 1: MONTE CARLO PI --- */}
      {activeTab === 'pi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 flex flex-col gap-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Simulation Parameters
            </h3>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Number of Random Sample Coordinates (N)
              </label>
              <select
                value={piTrials}
                onChange={(e) => setPiTrials(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white"
              >
                <option value={5000}>5,000 Points (Fast)</option>
                <option value={25000}>25,000 Points (Standard)</option>
                <option value={50000}>50,000 Points (High Precision)</option>
                <option value={100000}>100,000 Points (Ultra Precision)</option>
              </select>
            </div>

            <button
              type="button"
              disabled={isComputing}
              onClick={() => triggerSimulation(() => setPiSeed((s) => s + 1))}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs bg-fuchsia-600 hover:bg-fuchsia-700 text-white shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Re-run Random Simulation (2s Analysis)
            </button>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              <strong>Mathematical Formulation:</strong> Darts randomly thrown at a 2&times;2 bounding square with an inscribed unit circle land inside with probability P = &pi; / 4. Thus &pi; &asymp; 4 &times; (Inside Points / Total Points).
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6">
            <MonteCarloCanvas
              samplePoints={piResult.samplePoints}
              estimatedPi={piResult.estimatedPi}
              totalPoints={piResult.totalPoints}
            />

            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">Estimated π</span>
                <span className="text-xl font-bold font-mono text-fuchsia-600 dark:text-fuchsia-400">
                  {piResult.estimatedPi}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">True π Value</span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                  3.141593
                </span>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">Accuracy / Error</span>
                <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {piResult.errorPercentage}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: PROBABILITY CHALLENGES & PARADOXES --- */}
      {activeTab === 'challenges' && (
        <div className="flex flex-col gap-8">
          {/* Challenge 1: Monty Hall */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 font-bold text-xs">
                PARADOX #1
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                The Monty Hall 3-Door Paradox Challenge
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              You choose Door 1. Host Monty opens Door 3 revealing a goat. Should you switch to Door 2 or stay with Door 1? Run 10,000 live game show simulations to test the truth!
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Contestant Strategy
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setMontyStrategy('switch')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                        montyStrategy === 'switch'
                          ? 'bg-fuchsia-600 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Always Switch Doors
                    </button>
                    <button
                      type="button"
                      onClick={() => setMontyStrategy('stay')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                        montyStrategy === 'stay'
                          ? 'bg-fuchsia-600 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Always Stay (Keep Pick)
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => triggerSimulation(() => runMontyHallSim(montyStrategy, montyTrials))}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs bg-brand-600 hover:bg-brand-700 text-white shadow-md transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4" />
                  Simulate 10,000 Game Shows
                </button>
              </div>

              <div className="lg:col-span-7 grid grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 block mb-1">Empirical Win Rate</span>
                  <span className={`text-2xl font-black font-mono ${montyStrategy === 'switch' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {montyResult.winRate}%
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    {montyStrategy === 'switch' ? '(~66.7% Expected)' : '(~33.3% Expected)'}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 block mb-1">Cars Won</span>
                  <span className="text-2xl font-black font-mono text-emerald-500">
                    {montyResult.wins.toLocaleString()}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 block mb-1">Goats (Losses)</span>
                  <span className="text-2xl font-black font-mono text-rose-500">
                    {montyResult.losses.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Challenge 2: Birthday Paradox */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-500 font-bold text-xs">
                PARADOX #2
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                The Birthday Collision Paradox Challenge
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              How many random people in a room are needed before there is a 50% probability that at least two people share the exact same birthday?
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Room Group Size: <strong className="text-brand-600 dark:text-brand-400">{groupSize} people</strong>
                  </label>
                  <input
                    type="range"
                    min={5}
                    max={75}
                    value={groupSize}
                    onChange={(e) => setGroupSize(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                    <span>5 people</span>
                    <span>23 (Threshold)</span>
                    <span>75 people</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => triggerSimulation(() => runBirthdaySim(groupSize, bdayTrials))}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-all cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  Simulate 5,000 Rooms
                </button>
              </div>

              <div className="lg:col-span-7 grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 block mb-1">Simulated Collision Rate</span>
                  <span className="text-3xl font-black font-mono text-purple-600 dark:text-purple-400">
                    {bdayResult.matchRate}%
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    {bdayResult.matches.toLocaleString()} matched rooms
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 block mb-1">Exact Theoretical Math</span>
                  <span className="text-3xl font-black font-mono text-slate-900 dark:text-white">
                    {bdayResult.theoreticalRate}%
                  </span>
                  <span className="text-[10px] text-emerald-500 font-semibold block mt-1">
                    1 - &prod;((365-i)/365)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: PORTFOLIO RISK & VOLATILITY --- */}
      {activeTab === 'investment' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 flex flex-col gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Custom Stochastic Parameters
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Initial Investment (₹)
              </label>
              <input
                type="number"
                value={invInitial}
                step={50000}
                onChange={(e) => setInvInitial(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono font-bold"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Monthly Contribution (₹)
              </label>
              <input
                type="number"
                value={invMonthly}
                step={2500}
                onChange={(e) => setInvMonthly(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono font-bold"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Annual Market Volatility (&sigma;): {invVol}%
              </label>
              <input
                type="range"
                min={8}
                max={35}
                value={invVol}
                onChange={(e) => setInvVol(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Time Horizon: {invYears} Years
              </label>
              <input
                type="range"
                min={5}
                max={30}
                value={invYears}
                onChange={(e) => setInvYears(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <button
              type="button"
              disabled={isComputing}
              onClick={() => triggerSimulation(() => setInvSeed((s) => s + 1))}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs bg-fuchsia-600 hover:bg-fuchsia-700 text-white shadow-md transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Re-simulate 2,000 Market Paths
            </button>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-[11px] text-slate-400 block mb-1">Worst 10% (Bear)</span>
                <span className="text-base font-bold font-mono text-rose-600 dark:text-rose-400">
                  ₹{(invResult.p10Final / 100000).toFixed(1)} Lakhs
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-[11px] text-slate-400 block mb-1">Median (50th %ile)</span>
                <span className="text-base font-bold font-mono text-fuchsia-600 dark:text-fuchsia-400">
                  ₹{(invResult.p50Final / 100000).toFixed(1)} Lakhs
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-[11px] text-slate-400 block mb-1">Best 10% (Bull)</span>
                <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  ₹{(invResult.p90Final / 100000).toFixed(1)} Lakhs
                </span>
              </div>
            </div>

            <AreaGrowthChart
              data={invResult.yearlyBands}
              xAxisKey="year"
              title="Stochastic Market Volatility Percentile Bands"
              series={[
                { key: 'p90', name: 'Optimistic (90th %ile)', color: '#10b981' },
                { key: 'p50', name: 'Median Expected', color: '#6366f1' },
                { key: 'p10', name: 'Conservative (10th %ile)', color: '#f43f5e' },
              ]}
            />
          </div>
        </div>
      )}

      {/* --- TAB 4: DISCRETE DICE --- */}
      {activeTab === 'dice' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 flex flex-col gap-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Dice Experiment Parameters
            </h3>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Number of 6-Sided Dice: {numDice}
              </label>
              <input
                type="range"
                min={1}
                max={4}
                value={numDice}
                onChange={(e) => setNumDice(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Target Sum of Faces: {targetSum}
              </label>
              <input
                type="range"
                min={numDice}
                max={numDice * 6}
                value={targetSum}
                onChange={(e) => setTargetSum(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <button
              type="button"
              disabled={isComputing}
              onClick={() => triggerSimulation(() => setDiceSeed((s) => s + 1))}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs bg-fuchsia-600 hover:bg-fuchsia-700 text-white shadow-md transition-all cursor-pointer"
            >
              <Play className="w-4 h-4" />
              Simulate 25,000 Rolls
            </button>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">Simulated Probability</span>
                <span className="text-2xl font-bold font-mono text-fuchsia-600 dark:text-fuchsia-400">
                  {diceResult.simulatedProbability}%
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">Exact Theoretical Probability</span>
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                  {diceResult.theoreticalProbability}%
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                Empirical Frequency Distribution
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {diceResult.sumFrequencies.map((f) => (
                  <div
                    key={f.sum}
                    className={`p-2.5 rounded-xl border text-center ${
                      f.sum === targetSum
                        ? 'bg-fuchsia-50 dark:bg-fuchsia-950/60 border-fuchsia-400 text-fuchsia-600 dark:text-fuchsia-300 font-bold'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-[10px] text-slate-400 block">Sum = {f.sum}</span>
                    <span className="text-xs font-mono font-bold">{f.probability}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

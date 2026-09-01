import React, { useState, useMemo } from 'react';
import { CalculatorMetadata } from '../../types';
import { FormulaBox } from '../common/FormulaBox';
import { FaqAccordion } from '../common/FaqAccordion';
import { NumberInput } from '../common/NumberInput';
import { CurrencyInput } from '../common/CurrencyInput';
import { SliderField } from '../common/SliderField';
import { CategoryBadge } from '../common/CategoryBadge';
import { ShareModal } from '../common/ShareModal';
import { DonutChart } from '../charts/DonutChart';
import { AreaGrowthChart } from '../charts/AreaGrowthChart';
import { AmortizationTable } from '../charts/AmortizationTable';
import { DistributionChart } from '../charts/DistributionChart';
import { ScatterRegressionChart } from '../charts/ScatterRegressionChart';
import { MonteCarloCanvas } from '../charts/MonteCarloCanvas';
import { AffiliateBanner } from '../common/AffiliateBanner';

// Engines
import { calculateEmi } from '../../engines/finance/emi';
import { calculateSip } from '../../engines/finance/sip';
import { calculateCagr } from '../../engines/finance/cagr';
import { calculateCompoundInterest } from '../../engines/finance/compoundInterest';
import { calculateRetirement } from '../../engines/finance/retirement';
import { calculateSalary } from '../../engines/tax/salary';
import { calculateGst } from '../../engines/tax/gst';
import { calculateDescriptiveStats } from '../../engines/statistics/descriptive';
import { calculateBinomial } from '../../engines/statistics/distributions';
import { calculateLinearRegression } from '../../engines/statistics/regression';
import { calculateConfidenceInterval } from '../../engines/statistics/hypothesis';
import { runMonteCarloPi } from '../../engines/simulation/monteCarloPi';
import { runMonteCarloInvestment } from '../../engines/simulation/monteCarloInvestment';
import { calculateAttendance } from '../../engines/education/attendance';
import { calculateCgpa } from '../../engines/education/cgpa';
import { calculateAge } from '../../engines/date/age';
import { calculateDateDiff } from '../../engines/date/dateDiff';
import { calcPercentOf, calcWhatPercent, calcPercentChange } from '../../engines/math/percentage';
import { solveQuadratic } from '../../engines/math/quadratic';
import { calculateBreakEven } from '../../engines/business/breakEven';
import { calculateProfitMargin } from '../../engines/business/profitMargin';
import { calculateRentVsBuy } from '../../engines/realEstate/rentVsBuy';
import { calculateFitness } from '../../engines/health/fitness';
import { formatJson, minifyJson, base64Encode, base64Decode, generateUuidV4, hexToRgbHsl } from '../../engines/developer/devTools';
import { convertUnit, UNIT_CATEGORIES, UnitCategory } from '../../engines/conversion/unitConverter';
import { calculateImpulsePurchase, calculateMeetingCost, calculateCoffeeMillionaire, calculateBillionaireTime } from '../../engines/funny/quirkyCalculators';
import { RoastMyCalc } from '../common/RoastMyCalc';

import { ArrowLeft, Share2, Star, Sparkles, AlertCircle } from 'lucide-react';
import * as Icons from 'lucide-react';

interface CalculatorDetailViewProps {
  calculator: CalculatorMetadata;
  initialParams?: Record<string, any>;
  onBack: () => void;
  onSelectRelated: (slug: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (slug: string, e: React.MouseEvent) => void;
}

export const CalculatorDetailView: React.FC<CalculatorDetailViewProps> = ({
  calculator,
  initialParams = {},
  onBack,
  onSelectRelated,
  isFavorite,
  onToggleFavorite,
}) => {
  // Initialize state with default values or URL params
  const [inputs, setInputs] = useState<Record<string, any>>(() => {
    const init: Record<string, any> = {};
    calculator.inputsConfig.forEach((field) => {
      init[field.id] = initialParams[field.id] !== undefined ? initialParams[field.id] : field.defaultValue;
    });
    return init;
  });

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const IconComponent = (Icons as any)[calculator.icon] || Icons.Calculator;

  const updateInput = (key: string, value: any) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  // Generate share URL with current input parameters
  const shareUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set('calc', calculator.slug);
    Object.entries(inputs).forEach(([k, v]) => {
      if (v !== undefined && v !== null) params.set(k, String(v));
    });
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  }, [calculator.slug, inputs]);

  // Compute results dynamically based on calculator id
  const calculationResult = useMemo(() => {
    switch (calculator.id) {
      case 'emi-calculator': {
        const res = calculateEmi({
          loanAmount: inputs.loanAmount,
          annualInterestRate: inputs.annualInterestRate,
          tenureYears: inputs.tenureYears,
          prepaymentMonthly: inputs.prepaymentMonthly,
        });
        const pieData = [
          { name: 'Principal Amount', value: res.principal, color: '#6366f1' },
          { name: 'Total Interest', value: res.totalInterest, color: '#ec4899' },
        ];
        return { type: 'emi', res, pieData };
      }

      case 'sip-calculator': {
        const res = calculateSip({
          monthlyInvestment: inputs.monthlyInvestment,
          expectedAnnualReturn: inputs.expectedAnnualReturn,
          investmentDurationYears: inputs.investmentDurationYears,
          annualStepUpPercent: inputs.annualStepUpPercent,
        });
        const pieData = [
          { name: 'Total Invested', value: res.totalInvested, color: '#6366f1' },
          { name: 'Estimated Returns', value: res.estimatedReturns, color: '#10b981' },
        ];
        return { type: 'sip', res, pieData };
      }

      case 'compound-interest-calculator': {
        const res = calculateCompoundInterest({
          principal: inputs.principal,
          annualRate: inputs.annualRate,
          timeYears: inputs.timeYears,
          frequency: inputs.frequency,
          additionalMonthlyDeposit: inputs.additionalMonthlyDeposit,
        });
        const pieData = [
          { name: 'Total Principal', value: res.totalPrincipal, color: '#6366f1' },
          { name: 'Interest Accrued', value: res.totalInterestEarned, color: '#10b981' },
        ];
        return { type: 'compoundInterest', res, pieData };
      }

      case 'cagr-calculator': {
        const res = calculateCagr({
          initialValue: inputs.initialValue,
          finalValue: inputs.finalValue,
          durationYears: inputs.durationYears,
        });
        return { type: 'cagr', res };
      }

      case 'retirement-calculator': {
        const res = calculateRetirement({
          currentAge: inputs.currentAge,
          retirementAge: inputs.retirementAge,
          lifeExpectancyAge: inputs.lifeExpectancyAge,
          currentMonthlyExpense: inputs.currentMonthlyExpense,
          inflationRate: inputs.inflationRate,
          preRetirementReturnRate: inputs.preRetirementReturnRate,
          postRetirementReturnRate: inputs.postRetirementReturnRate,
          existingSavings: inputs.existingSavings,
        });
        return { type: 'retirement', res };
      }

      case 'salary-calculator': {
        const res = calculateSalary({
          annualCtc: inputs.annualCtc,
          annualBonus: inputs.annualBonus,
          rentPaidMonthly: inputs.rentPaidMonthly,
          section80C: inputs.section80C,
          section80D: inputs.section80D,
          taxRegime: inputs.taxRegime,
        });
        const pieData = [
          { name: 'Monthly Take Home', value: res.monthlyInHand, color: '#10b981' },
          { name: 'Income Tax TDS', value: res.monthlyIncomeTaxTds, color: '#f43f5e' },
          { name: 'EPF Deduction', value: res.monthlyEpfEmployee, color: '#6366f1' },
        ];
        return { type: 'salary', res, pieData };
      }

      case 'gst-calculator': {
        const res = calculateGst({
          amount: inputs.amount,
          gstRate: inputs.gstRate,
          calculationType: inputs.calculationType,
        });
        return { type: 'gst', res };
      }

      case 'descriptive-statistics-calculator': {
        const str = inputs.dataString || '';
        const numbers = str.split(/[\s,]+/).map(Number).filter((n: number) => !isNaN(n));
        const res = calculateDescriptiveStats(numbers);
        return { type: 'stats', res };
      }

      case 'binomial-distribution-calculator': {
        const res = calculateBinomial({
          trials: inputs.trials,
          probability: inputs.probability,
          successes: inputs.successes,
        });
        return { type: 'binomial', res };
      }

      case 'linear-regression-calculator': {
        const xArr = (inputs.xValues || '').split(/[\s,]+/).map(Number).filter((n: number) => !isNaN(n));
        const yArr = (inputs.yValues || '').split(/[\s,]+/).map(Number).filter((n: number) => !isNaN(n));
        const res = calculateLinearRegression(xArr, yArr);
        const predY = res.predictY(Number(inputs.predictX) || 0);
        return { type: 'regression', res, predY };
      }

      case 'confidence-interval-calculator': {
        const res = calculateConfidenceInterval({
          sampleMean: inputs.sampleMean,
          sampleStdDev: inputs.sampleStdDev,
          sampleSize: inputs.sampleSize,
          confidenceLevel: Number(inputs.confidenceLevel) as 90 | 95 | 99,
        });
        return { type: 'confidence', res };
      }

      case 'monte-carlo-pi-simulator': {
        const res = runMonteCarloPi(Number(inputs.totalPoints) || 25000);
        return { type: 'monteCarloPi', res };
      }

      case 'monte-carlo-investment-simulator': {
        const res = runMonteCarloInvestment({
          initialInvestment: inputs.initialInvestment,
          monthlyContribution: inputs.monthlyContribution,
          expectedAnnualReturn: inputs.expectedAnnualReturn,
          annualVolatility: inputs.annualVolatility,
          durationYears: inputs.durationYears,
          targetGoalCorpus: inputs.targetGoalCorpus,
          numSimulations: 1000,
        });
        return { type: 'monteCarloInvestment', res };
      }

      case 'attendance-calculator': {
        const res = calculateAttendance({
          totalClassesHeld: inputs.totalClassesHeld,
          classesAttended: inputs.classesAttended,
          targetPercentage: inputs.targetPercentage,
          upcomingClassesPlanned: inputs.upcomingClassesPlanned,
        });
        return { type: 'attendance', res };
      }

      case 'cgpa-calculator': {
        const res = calculateCgpa({
          cgpa: inputs.cgpa,
          formulaType: inputs.formulaType,
        });
        return { type: 'cgpa', res };
      }

      case 'age-calculator': {
        const res = calculateAge({
          birthDate: inputs.birthDate,
          targetDate: inputs.targetDate,
        });
        return { type: 'age', res };
      }

      case 'date-difference-calculator': {
        const res = calculateDateDiff({
          startDate: inputs.startDate,
          endDate: inputs.endDate,
        });
        return { type: 'dateDiff', res };
      }

      case 'percentage-calculator': {
        const x = Number(inputs.xValue) || 0;
        const y = Number(inputs.yValue) || 0;
        const percentOf = calcPercentOf(x, y);
        const whatPercent = calcWhatPercent(x, y);
        const change = calcPercentChange(x, y);
        return { type: 'percentage', percentOf, whatPercent, change, x, y };
      }

      case 'quadratic-equation-solver': {
        const res = solveQuadratic(inputs.coeffA, inputs.coeffB, inputs.coeffC);
        return { type: 'quadratic', res };
      }

      case 'break-even-calculator': {
        const res = calculateBreakEven({
          fixedCosts: inputs.fixedCosts,
          variableCostPerUnit: inputs.variableCostPerUnit,
          sellingPricePerUnit: inputs.sellingPricePerUnit,
        });
        return { type: 'breakEven', res };
      }

      case 'profit-margin-calculator': {
        const res = calculateProfitMargin(inputs.cost, inputs.revenue);
        return { type: 'profitMargin', res };
      }

      case 'rent-vs-buy-calculator': {
        const res = calculateRentVsBuy({
          propertyPrice: inputs.propertyPrice,
          downPaymentPercent: inputs.downPaymentPercent,
          loanInterestRate: inputs.loanInterestRate,
          loanTenureYears: inputs.loanTenureYears,
          monthlyRent: inputs.monthlyRent,
          annualRentIncreasePercent: inputs.annualRentIncreasePercent,
          annualPropertyAppreciationPercent: inputs.annualPropertyAppreciationPercent,
          investmentReturnPercent: inputs.investmentReturnPercent,
          holdingYears: inputs.holdingYears,
        });
        return { type: 'rentVsBuy', res };
      }

      case 'bmi-calorie-calculator': {
        const res = calculateFitness({
          unitSystem: inputs.unitSystem,
          age: inputs.age,
          gender: inputs.gender,
          heightCm: inputs.heightCm,
          heightFeet: inputs.heightFeet,
          heightInches: inputs.heightInches,
          weightKg: inputs.weightKg,
          weightLbs: inputs.weightLbs,
          bodyFatPercent: inputs.bodyFatPercent,
          activityLevel: inputs.activityLevel,
          goal: inputs.goal,
          macroPreference: inputs.macroPreference,
        });
        return { type: 'fitness', res };
      }

      case 'developer-tools-suite': {
        const mode = inputs.toolMode || 'json';
        const txt = inputs.inputText || '';
        let devOut = '';
        if (mode === 'json') {
          const f = formatJson(txt);
          devOut = f.success ? f.result : `Error: ${f.error}`;
        } else if (mode === 'base64') {
          devOut = base64Encode(txt);
        } else if (mode === 'uuid') {
          devOut = generateUuidV4();
        } else if (mode === 'color') {
          const c = hexToRgbHsl(txt);
          devOut = c ? JSON.stringify(c, null, 2) : 'Invalid HEX Color Code';
        }
        return { type: 'developer', devOut, mode };
      }

      case 'universal-unit-converter': {
        const cat = (inputs.unitCategory || 'length') as UnitCategory;
        const fromU = inputs.fromUnit || (UNIT_CATEGORIES[cat]?.units[0]?.id ?? 'm');
        const toU = inputs.toUnit || (UNIT_CATEGORIES[cat]?.units[1]?.id ?? 'ft');
        const val = Number(inputs.inputValue) || 0;
        const res = convertUnit(cat, fromU, toU, val);
        return { type: 'unitConverter', res, cat, fromU, toU, val };
      }

      case 'impulse-purchase-calculator': {
        const res = calculateImpulsePurchase({
          itemPrice: inputs.itemPrice,
          monthlySalary: inputs.monthlySalary,
          weeklyHours: inputs.weeklyHours,
        });
        return { type: 'impulse', res };
      }

      case 'meeting-cost-calculator': {
        const res = calculateMeetingCost({
          numAttendees: inputs.numAttendees,
          avgAnnualSalary: inputs.avgAnnualSalary,
          durationMinutes: inputs.durationMinutes,
          engagementPercent: inputs.engagementPercent,
        });
        return { type: 'meeting', res };
      }

      case 'coffee-millionaire-calculator': {
        const res = calculateCoffeeMillionaire({
          dailyCoffeePrice: inputs.dailyCoffeePrice,
          daysPerWeek: inputs.daysPerWeek,
          years: inputs.years,
          investmentReturnRate: inputs.investmentReturnRate,
        });
        return { type: 'coffee', res };
      }

      case 'billionaire-time-calculator': {
        const res = calculateBillionaireTime(inputs.annualSalary);
        return { type: 'billionaire', res };
      }

      default:
        return { type: 'generic' };
    }
  }, [calculator.id, inputs]);

  // Render input controls
  const renderInputs = () => {
    return (
      <div className="flex flex-col gap-4 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">
          Adjust Parameters
        </h3>

        {calculator.inputsConfig
          .filter((field) => {
            if (calculator.id === 'bmi-calorie-calculator') {
              const isImperial = inputs.unitSystem === 'imperial';
              if (isImperial && (field.id === 'heightCm' || field.id === 'weightKg')) {
                return false;
              }
              if (!isImperial && (field.id === 'heightFeet' || field.id === 'heightInches' || field.id === 'weightLbs')) {
                return false;
              }
            }
            return true;
          })
          .map((field) => {
          if (field.type === 'currency') {
            return (
              <CurrencyInput
                key={field.id}
                id={field.id}
                label={field.label}
                value={inputs[field.id]}
                onChange={(val) => updateInput(field.id, val)}
                min={field.min}
                max={field.max}
                step={field.step}
              />
            );
          }

          if (field.type === 'slider') {
            return (
              <SliderField
                key={field.id}
                id={field.id}
                label={field.label}
                value={inputs[field.id]}
                onChange={(val) => updateInput(field.id, val)}
                min={field.min ?? 0}
                max={field.max ?? 100}
                step={field.step}
                suffix={field.suffix}
                prefix={field.prefix}
              />
            );
          }

          if (field.type === 'select') {
            // Dynamic options if unitCategory changed in unit converter
            let options = field.options || [];
            if (calculator.id === 'universal-unit-converter') {
              const currentCat = (inputs.unitCategory || 'length') as UnitCategory;
              if (field.id === 'fromUnit' || field.id === 'toUnit') {
                options = (UNIT_CATEGORIES[currentCat]?.units || []).map((u) => ({
                  label: `${u.name} (${u.symbol})`,
                  value: u.id,
                }));
              }
            }

            return (
              <div key={field.id} className="flex flex-col gap-1.5">
                <label htmlFor={field.id} className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {field.label}
                </label>
                <select
                  id={field.id}
                  value={inputs[field.id]}
                  onChange={(e) => updateInput(field.id, e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-sm"
                >
                  {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          if (field.type === 'textarea') {
            return (
              <div key={field.id} className="flex flex-col gap-1.5">
                <label htmlFor={field.id} className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {field.label}
                </label>
                <textarea
                  id={field.id}
                  rows={4}
                  value={inputs[field.id] || ''}
                  placeholder={field.placeholder}
                  onChange={(e) => updateInput(field.id, e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-sm"
                />
              </div>
            );
          }

          if (field.type === 'date') {
            return (
              <div key={field.id} className="flex flex-col gap-1.5">
                <label htmlFor={field.id} className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {field.label}
                </label>
                <input
                  type="date"
                  id={field.id}
                  value={inputs[field.id] || ''}
                  onChange={(e) => updateInput(field.id, e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-sm"
                />
              </div>
            );
          }

          return (
            <NumberInput
              key={field.id}
              id={field.id}
              label={field.label}
              value={inputs[field.id]}
              onChange={(val) => updateInput(field.id, val)}
              min={field.min}
              max={field.max}
              step={field.step}
              prefix={field.prefix}
              suffix={field.suffix}
            />
          );
        })}
      </div>
    );
  };

  // Render output cards based on active calculation
  const renderResults = () => {
    const res: any = calculationResult;

    if (res.type === 'emi') {
      const emiRes = res.res;
      return (
        <div className="flex flex-col gap-5">
          {/* Main Hero Result Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-600 via-indigo-600 to-accent-600 text-white shadow-lg relative overflow-hidden">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-200 block mb-1">
              Monthly Repayment (EMI)
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight">
              ₹{emiRes.monthlyEmi.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-brand-100 mt-2">
              For loan principal of ₹{emiRes.principal.toLocaleString('en-IN')} at {inputs.annualInterestRate}% for {inputs.tenureYears} years
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Total Interest</span>
              <span className="text-base font-bold font-mono text-rose-600 dark:text-rose-400">
                ₹{emiRes.totalInterest.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Total Payment</span>
              <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                ₹{emiRes.totalPayment.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Interest to Loan Ratio</span>
              <span className="text-base font-bold font-mono text-amber-600 dark:text-amber-400">
                {emiRes.interestRatioPercent}%
              </span>
            </div>
          </div>

          {/* Donut Chart */}
          <DonutChart
            data={res.pieData}
            title="Loan Breakdown (Principal vs Total Interest)"
            centerText={{ primary: `₹${(emiRes.totalPayment / 100000).toFixed(1)}L`, secondary: 'Total' }}
          />

          {/* Full Amortization Schedule */}
          <AmortizationTable yearlyData={emiRes.yearlyBreakdown} loanAmount={emiRes.principal} />
        </div>
      );
    }

    if (res.type === 'sip') {
      const sipRes = res.res;
      return (
        <div className="flex flex-col gap-5">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-indigo-600 text-white shadow-lg">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200 block mb-1">
              Expected Future Wealth Corpus
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight">
              ₹{sipRes.futureValue.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-emerald-100 mt-2">
              Wealth gain multiplier of <strong className="text-white">{sipRes.wealthGainMultiplier}x</strong> on invested principal
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Total Amount Invested</span>
              <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                ₹{sipRes.totalInvested.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Estimated Wealth Gain</span>
              <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                +₹{sipRes.estimatedReturns.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <AreaGrowthChart
            data={sipRes.yearlyProgression}
            xAxisKey="year"
            title="Corpus Growth Over Time"
            series={[
              { key: 'futureValue', name: 'Total Wealth Corpus', color: '#10b981' },
              { key: 'totalInvested', name: 'Principal Invested', color: '#6366f1' },
            ]}
          />
        </div>
      );
    }

    if (res.type === 'salary') {
      const sal = res.res;
      return (
        <div className="flex flex-col gap-5">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600 via-brand-600 to-purple-600 text-white shadow-lg">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 block mb-1">
              Monthly In-Hand Take Home
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight">
              ₹{sal.monthlyInHand.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/20">
                Regime: {inputs.taxRegime.toUpperCase()}
              </span>
              <span className="text-xs text-indigo-100">
                Annual In-Hand: ₹{sal.annualInHand.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Monthly Gross</span>
              <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                ₹{sal.monthlyGross.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Income Tax TDS/mo</span>
              <span className="text-base font-bold font-mono text-rose-600 dark:text-rose-400">
                ₹{Math.round(sal.monthlyIncomeTaxTds).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">EPF Deduction/mo</span>
              <span className="text-base font-bold font-mono text-brand-600 dark:text-brand-400">
                ₹{Math.round(sal.monthlyEpfEmployee).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Regime Savings Recommendation Alert */}
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900 dark:text-emerald-200">
              <strong>Regime Recommendation:</strong> The <strong>{sal.oldVsNewDifference.recommended.toUpperCase()} Tax Regime</strong> is more optimal for your salary profile, saving you approximately <strong>₹{sal.oldVsNewDifference.savingsAnnual.toLocaleString('en-IN')}</strong> annually in tax liability!
            </div>
          </div>

          <DonutChart data={res.pieData} title="Monthly Gross Salary Breakdown" />
        </div>
      );
    }

    if (res.type === 'attendance') {
      const att = res.res;
      return (
        <div className="flex flex-col gap-5">
          <div className={`p-6 rounded-2xl text-white shadow-lg ${
            att.status === 'safe'
              ? 'bg-gradient-to-br from-emerald-600 to-teal-700'
              : att.status === 'warning'
                ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                : 'bg-gradient-to-br from-rose-600 to-pink-700'
          }`}>
            <span className="text-xs font-bold uppercase tracking-wider text-white/80 block mb-1">
              Current Attendance Rate
            </span>
            <div className="text-4xl font-black font-mono tracking-tight">
              {att.currentPercentage}%
            </div>
            <p className="text-xs text-white/90 mt-2 font-medium">
              {att.scenarioAnalysis}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Bunks Allowed</span>
              <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {att.allowedBunksWhileSafe} Classes
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Consecutive Classes Needed</span>
              <span className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400">
                {att.classesNeededToReachTarget} Classes
              </span>
            </div>
          </div>
        </div>
      );
    }

    if (res.type === 'stats') {
      const st = res.res;
      return (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Mean (Average)</span>
              <span className="text-base font-bold font-mono text-brand-600 dark:text-brand-400">{st.mean}</span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Median (Q2)</span>
              <span className="text-base font-bold font-mono text-slate-900 dark:text-white">{st.median}</span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Std Dev (Sample)</span>
              <span className="text-base font-bold font-mono text-purple-600 dark:text-purple-400">{st.stdDevSample}</span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">IQR (Q3 - Q1)</span>
              <span className="text-base font-bold font-mono text-indigo-600 dark:text-indigo-400">{st.iqr}</span>
            </div>
          </div>

          {st.outliers.length > 0 && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-900 dark:text-rose-200">
                <strong>Tukey Outliers Detected:</strong> [{st.outliers.join(', ')}]. Cleaned mean without outliers is <strong>{st.cleanedMeanWithoutOutliers}</strong>.
              </div>
            </div>
          )}

          <DistributionChart data={st.histogramBins} title="Data Frequency Distribution Histogram" />
        </div>
      );
    }

    if (res.type === 'age') {
      const age = res.res;
      return (
        <div className="flex flex-col gap-5">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-500 via-pink-600 to-indigo-600 text-white shadow-lg">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-100 block mb-1">
              Exact Chronological Age
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight">
              {age.years} yrs, {age.months} mos, {age.days} days
            </div>
            <p className="text-xs text-rose-100 mt-2">
              Born on a {age.dayOfWeekBorn} • Zodiac Constellation: {age.zodiacSign}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Next Birthday In</span>
              <span className="text-base font-bold font-mono text-rose-600 dark:text-rose-400">{age.nextBirthdayCountdownDays} Days</span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Total Days Lived</span>
              <span className="text-base font-bold font-mono text-slate-900 dark:text-white">{age.totalDays.toLocaleString()}</span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Total Weeks</span>
              <span className="text-base font-bold font-mono text-brand-600 dark:text-brand-400">{age.totalWeeks.toLocaleString()}</span>
            </div>
          </div>
        </div>
      );
    }

    if (res.type === 'monteCarloPi') {
      const piRes = res.res;
      return (
        <div className="flex flex-col gap-5">
          <MonteCarloCanvas
            samplePoints={piRes.samplePoints}
            estimatedPi={piRes.estimatedPi}
            totalPoints={piRes.totalPoints}
          />
        </div>
      );
    }

    if (res.type === 'monteCarloInvestment') {
      const invRes = res.res;
      return (
        <div className="flex flex-col gap-5">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-fuchsia-600 via-purple-600 to-indigo-600 text-white shadow-lg">
            <span className="text-xs font-bold uppercase tracking-wider text-fuchsia-200 block mb-1">
              Median Simulated Outcome (50th Percentile)
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight">
              ₹{invRes.p50Final.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-fuchsia-100 mt-2">
              Probability of achieving target goal: <strong className="text-white">{invRes.probabilityOfReachingTarget}%</strong>
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Worst Case (10th %ile)</span>
              <span className="text-base font-bold font-mono text-rose-600 dark:text-rose-400">
                ₹{invRes.p10Final.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Best Case (90th %ile)</span>
              <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                ₹{invRes.p90Final.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Simulations Sampled</span>
              <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                {invRes.simulationsRun.toLocaleString()} paths
              </span>
            </div>
          </div>

          <AreaGrowthChart
            data={invRes.yearlyBands}
            xAxisKey="year"
            title="Monte Carlo Volatility Bands (10th, 50th, 90th Percentiles)"
            series={[
              { key: 'p90', name: 'Optimistic (90th %ile)', color: '#10b981' },
              { key: 'p50', name: 'Median (50th %ile)', color: '#6366f1' },
              { key: 'p10', name: 'Conservative (10th %ile)', color: '#f43f5e' },
            ]}
          />
        </div>
      );
    }

    if (res.type === 'unitConverter') {
      const uRes = res.res;
      return (
        <div className="flex flex-col gap-5">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-600 via-emerald-600 to-indigo-600 text-white shadow-lg">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-200 block mb-1">
              Converted Result
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight">
              {uRes.result}
            </div>
            <p className="text-xs text-teal-100 mt-2 font-mono">
              {uRes.formula}
            </p>
          </div>
        </div>
      );
    }

    if (res.type === 'fitness') {
      const fit = res.res;
      return (
        <div className="flex flex-col gap-5">
          {/* Main Hero Result Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-500 via-pink-600 to-purple-600 text-white shadow-lg relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-100">
                Body Mass Index (BMI) & Caloric Target
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-white/20 text-white backdrop-blur-xs">
                {fit.bmiCategory}
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight">
                {fit.bmi} <span className="text-sm font-normal text-rose-100">kg/m²</span>
              </div>
              <span className="text-xs text-rose-200 font-mono">
                (BMI Prime: {fit.bmiPrime})
              </span>
            </div>
            <p className="text-xs text-rose-100 mt-2 flex flex-wrap items-center gap-2">
              <span>Target Calories: <strong className="text-white font-mono">{fit.targetDailyCalories.toLocaleString()} kcal/day</strong></span>
              <span>•</span>
              <span className="bg-rose-950/60 px-2 py-0.5 rounded-md text-[11px] font-semibold">{fit.goalLabel}</span>
            </p>
          </div>

          {/* User Parameters Summary Pill */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span>Height: <strong className="text-slate-900 dark:text-white font-mono">{fit.heightFormatted}</strong></span>
            <span>Weight: <strong className="text-slate-900 dark:text-white font-mono">{fit.weightFormatted}</strong></span>
            <span>Age: <strong className="text-slate-900 dark:text-white font-mono">{inputs.age} yrs</strong></span>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">BMR (Mifflin-St Jeor)</span>
              <span className="text-base font-bold font-mono text-rose-600 dark:text-rose-400">
                {fit.bmrCalories.toLocaleString()} kcal
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">TDEE (Maintenance)</span>
              <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                {fit.tdeeCalories.toLocaleString()} kcal
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Daily Hydration Target</span>
              <span className="text-base font-bold font-mono text-cyan-600 dark:text-cyan-400">
                {fit.waterIntakeLiters} L ({fit.waterIntakeOz} oz) 💧
              </span>
            </div>
          </div>

          {/* Optional Body Composition (Katch-McArdle & LBM) */}
          {fit.leanMassKg && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">Lean Body Mass</span>
                <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {fit.leanMassKg} kg ({fit.leanMassLbs} lbs)
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">Fat Mass</span>
                <span className="text-sm font-bold font-mono text-amber-600 dark:text-amber-400">
                  {fit.fatMassKg} kg ({fit.fatMassLbs} lbs)
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 block mb-0.5">Katch-McArdle BMR</span>
                <span className="text-sm font-bold font-mono text-indigo-600 dark:text-indigo-400">
                  {fit.katchBmrCalories} kcal
                </span>
              </div>
            </div>
          )}

          {/* Macro Nutrient Split Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Macronutrient Target Split
              </h4>
              <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase">
                {inputs.macroPreference || 'Balanced'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200/60 dark:border-red-900/60">
                <span className="text-[10px] text-red-600 dark:text-red-400 font-bold block mb-1">Protein</span>
                <span className="text-base font-black font-mono text-slate-900 dark:text-white">{fit.proteinGrams}g</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">{fit.proteinPercent}% ({fit.proteinCalories} kcal)</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/60">
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold block mb-1">Carbs</span>
                <span className="text-base font-black font-mono text-slate-900 dark:text-white">{fit.carbsGrams}g</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">{fit.carbsPercent}% ({fit.carbsCalories} kcal)</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/60">
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold block mb-1">Fats</span>
                <span className="text-base font-black font-mono text-slate-900 dark:text-white">{fit.fatGrams}g</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">{fit.fatPercent}% ({fit.fatCalories} kcal)</span>
              </div>
            </div>

            {/* Ideal Healthy Weight Range in both kg and lbs */}
            <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-600 dark:text-slate-400 leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span><strong>Ideal Healthy Weight (BMI 18.5 - 24.9):</strong></span>
              <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {fit.idealWeightRangeKg} • {fit.idealWeightRangeLbs}
              </span>
            </div>
          </div>

          {/* Heart Rate Cardio Training Zones */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
              Cardio Heart Rate Training Zones (Max: {fit.heartRateZones.maxHeartRate} BPM)
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">Fat Burn (60-70%)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white mt-0.5 block">{fit.heartRateZones.fatBurnRange}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60">
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block">Aerobic (70-85%)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white mt-0.5 block">{fit.heartRateZones.aerobicRange}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-800/60">
                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 block">Anaerobic Peak</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white mt-0.5 block">{fit.heartRateZones.peakRange}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (res.type === 'cgpa') {
      const cg = res.res;
      return (
        <div className="flex flex-col gap-5">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-lg">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-100 block mb-1">
              Converted Percentage
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono">
              {cg.percentage}%
            </div>
            <p className="text-xs text-cyan-100 mt-2">
              Formula: {cg.formulaUsed}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <span className="text-slate-400 block mb-1">Academic Standing / Division</span>
            <span className="text-base font-bold text-slate-900 dark:text-white">{cg.division}</span>
          </div>
        </div>
      );
    }

    if (res.type === 'dateDiff') {
      const d = res.res;
      return (
        <div className="flex flex-col gap-5">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-500 via-pink-600 to-purple-600 text-white shadow-lg">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-100 block mb-1">
              Total Calendar Difference
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono">
              {d.totalDays} Days
            </div>
            <p className="text-xs text-rose-100 mt-2">
              {d.years} Years, {d.months} Months, {d.days} Days ({d.weeks} Weeks)
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Business / Working Days</span>
              <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">{d.businessDays} Days</span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Weekend Days</span>
              <span className="text-lg font-bold font-mono text-rose-500">{d.weekendDays} Days</span>
            </div>
          </div>
        </div>
      );
    }

    if (res.type === 'percentage') {
      return (
        <div className="flex flex-col gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">{res.x}% of {res.y}</span>
            <span className="text-2xl font-black font-mono text-brand-600 dark:text-brand-400">{res.percentOf}</span>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">{res.x} is what percent of {res.y}?</span>
            <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">{res.whatPercent}%</span>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Percentage Change from {res.x} to {res.y}</span>
            <span className="text-2xl font-black font-mono text-purple-600 dark:text-purple-400">{res.change}%</span>
          </div>
        </div>
      );
    }

    if (res.type === 'quadratic') {
      const q = res.res;
      return (
        <div className="flex flex-col gap-5">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 text-white shadow-lg">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-200 block mb-1">
              Roots of Equation ({q.equation})
            </span>
            <div className="text-2xl sm:text-3xl font-black font-mono">
              x₁ = {q.root1}, x₂ = {q.root2}
            </div>
            <p className="text-xs text-violet-100 mt-2 font-mono">
              Discriminant &Delta; = {q.discriminant} ({q.rootType})
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <span className="font-bold text-slate-900 dark:text-white block mb-2">Step-by-Step Evaluation:</span>
            {q.steps.map((st: string, idx: number) => (
              <p key={idx} className="font-mono text-slate-600 dark:text-slate-400 my-1">{st}</p>
            ))}
          </div>
        </div>
      );
    }

    if (res.type === 'breakEven') {
      const b = res.res;
      return (
        <div className="flex flex-col gap-5">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 text-white shadow-lg">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-100 block mb-1">
              Break-Even Point
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono">
              {b.breakEvenUnits.toLocaleString()} Units
            </div>
            <p className="text-xs text-sky-100 mt-2">
              Break-Even Revenue: <strong className="text-white">₹{b.breakEvenRevenue.toLocaleString('en-IN')}</strong>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Contribution Margin</span>
              <span className="text-lg font-bold font-mono text-emerald-600">₹{b.contributionMarginPerUnit} / unit</span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Contribution Ratio</span>
              <span className="text-lg font-bold font-mono text-sky-600">{b.contributionMarginRatio}%</span>
            </div>
          </div>
        </div>
      );
    }

    if (res.type === 'profitMargin') {
      const p = res.res;
      return (
        <div className="flex flex-col gap-5">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-blue-600 text-white shadow-lg">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100 block mb-1">
              Profit Margin
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono">
              {p.profitMarginPercent}%
            </div>
            <p className="text-xs text-emerald-100 mt-2">
              Gross Profit: <strong className="text-white">₹{p.grossProfit.toLocaleString('en-IN')}</strong> (Markup: {p.markupPercent}%)
            </p>
          </div>
        </div>
      );
    }

    if (res.type === 'rentVsBuy') {
      const rvb = res.res;
      return (
        <div className="flex flex-col gap-5">
          <div className={`p-6 rounded-2xl text-white shadow-lg ${rvb.recommendation === 'Buy' ? 'bg-gradient-to-br from-emerald-600 to-teal-600' : 'bg-gradient-to-br from-indigo-600 to-purple-600'}`}>
            <span className="text-xs font-bold uppercase tracking-wider opacity-80 block mb-1">
              Lifetime Financial Winner
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono">
              {rvb.recommendation}ing Wins by ₹{(rvb.netDifference / 100000).toFixed(1)} Lakhs
            </div>
            <p className="text-xs mt-2 opacity-90">
              Over a {inputs.holdingYears}-year horizon with {inputs.loanInterestRate}% mortgage vs renting
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Total Cost of Buying</span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">₹{(rvb.totalBuyCost / 100000).toFixed(1)} Lakhs</span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Total Cost of Renting</span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">₹{(rvb.totalRentCost / 100000).toFixed(1)} Lakhs</span>
            </div>
          </div>
        </div>
      );
    }

    if (res.type === 'impulse') {
      const imp = res.res;
      return (
        <div className="flex flex-col gap-5">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600 text-white shadow-lg">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100 block mb-1">
              Labor Hours Required
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono">
              {imp.workHoursRequired} Work Hours ({imp.workDaysRequired} Days)
            </div>
            <p className="text-xs text-amber-100 mt-2">
              Consumes {imp.percentageOfMonthlySalary}% of your monthly in-hand paycheck
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Impulse Regret Risk Meter
              </span>
              <span className="text-xs font-mono font-bold text-rose-500">{imp.regretRiskScore}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden mb-4">
              <div
                className={`h-full rounded-full transition-all ${
                  imp.regretRiskScore > 70 ? 'bg-rose-500' : imp.regretRiskScore > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${imp.regretRiskScore}%` }}
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-black text-slate-900 dark:text-white mb-1">{imp.verdictTitle}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{imp.verdictMessage}</p>
              <p className="text-[11px] text-brand-600 dark:text-brand-400 font-bold mt-2">💡 Alternative: {imp.funnyAlternative}</p>
            </div>
          </div>
        </div>
      );
    }

    if (res.type === 'meeting') {
      const meet = res.res;
      return (
        <div className="flex flex-col gap-5">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-600 via-pink-600 to-purple-600 text-white shadow-lg">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-100 block mb-1">
              Total Meeting Money Burned
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono">
              ₹{meet.totalCost.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-rose-100 mt-2">
              Burning ₹{meet.costPerMinute}/minute (₹{meet.costPerSecond}/second)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Unproductive Wasted Burn</span>
              <span className="text-lg font-bold font-mono text-rose-500">
                ₹{meet.wastedCost.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Wordle / Scrolling Cost</span>
              <span className="text-lg font-bold font-mono text-amber-500">
                ₹{meet.wordleScrollCost.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-black text-slate-900 dark:text-white mb-1">{meet.verdictTitle}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{meet.verdictMessage}</p>
          </div>
        </div>
      );
    }

    if (res.type === 'coffee') {
      const cof = res.res;
      return (
        <div className="flex flex-col gap-5">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-600 via-yellow-600 to-emerald-600 text-white shadow-lg">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100 block mb-1">
              Future Compounded Wealth if Invested
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono">
              ₹{(cof.investedFutureCorpus / 100000).toFixed(2)} Lakhs
            </div>
            <p className="text-xs text-amber-100 mt-2">
              Total coffee spent over {inputs.years} years: ₹{cof.spentOverHorizon.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-black text-slate-900 dark:text-white mb-1">{cof.verdictTitle}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{cof.verdictMessage}</p>
          </div>
        </div>
      );
    }

    if (res.type === 'billionaire') {
      const bil = res.res;
      return (
        <div className="flex flex-col gap-5">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 text-white shadow-lg">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-100 block mb-1">
              Elon Musk Velocity
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono">
              {bil.muskTimeSeconds} Seconds
            </div>
            <p className="text-xs text-indigo-100 mt-2">
              Time for Elon to earn your entire ₹{bil.annualSalary.toLocaleString('en-IN')} annual salary
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Mukesh Ambani Clock</span>
              <span className="text-lg font-bold font-mono text-purple-600 dark:text-purple-400">
                {bil.ambaniTimeSeconds} Seconds
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Chai Cups Equivalent</span>
              <span className="text-lg font-bold font-mono text-amber-500">
                {bil.chaiCupsEquivalent.toLocaleString()} Cups ☕
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs italic text-slate-600 dark:text-slate-400">
            &ldquo;{bil.funnyQuote}&rdquo;
          </div>
        </div>
      );
    }

    // Default Fallback
    return (
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
        Calculation computed successfully. Adjust sliders on the left to see live updates.
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Calculators
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShareModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share Result
          </button>
          <button
            type="button"
            onClick={(e) => onToggleFavorite(calculator.slug, e)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title={isFavorite ? 'Remove Favorite' : 'Save Favorite'}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Calculator Title Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3.5 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 shadow-sm border border-brand-200/50 dark:border-brand-800/50">
          <IconComponent className="w-7 h-7" />
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
              {calculator.name}
            </h1>
            <CategoryBadge category={calculator.category} size="md" />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {calculator.description}
          </p>
        </div>
      </div>

      {/* Dual Column Layout: Left Inputs, Right Outputs & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        <div className="lg:col-span-5 flex flex-col gap-6">
          {renderInputs()}
        </div>

        <div className="lg:col-span-7 flex flex-col gap-6">
          {renderResults()}
          <RoastMyCalc calculatorSlug={calculator.slug} result={calculationResult} />
        </div>
      </div>

      {/* Recommended Amazon Partner Deals Banner */}
      <AffiliateBanner category={calculator.category} variant="banner" className="mb-10" />

      {/* Bottom Technical Section: Formula, Worked Examples, FAQs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-slate-200 dark:border-slate-800/80">
        {calculator.formula && (
          <FormulaBox formula={calculator.formula} workedExample={calculator.workedExample} />
        )}
        {calculator.faqs && calculator.faqs.length > 0 && (
          <FaqAccordion faqs={calculator.faqs} />
        )}
      </div>

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        calculatorName={calculator.name}
        shareUrl={shareUrl}
      />
    </div>
  );
};

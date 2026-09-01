import React, { useState, useEffect, useCallback } from 'react';
import {
  Gamepad2,
  Zap,
  Trophy,
  Flame,
  RotateCcw,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  Play,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight as ArrowRightIcon,
  Crown,
} from 'lucide-react';

type GameMode = 'speedMath' | 'game2048' | 'higherLower' | 'montyVault';

// ==========================================
// GAME 1: SPEED MATH RUSH (60s Timer)
// ==========================================
const SpeedMathGame: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return Number(localStorage.getItem('qm_speedmath_highscore') || '0');
  });

  const [question, setQuestion] = useState<{ text: string; answer: number; options: number[] }>({
    text: '12 × 4',
    answer: 48,
    options: [48, 44, 52, 36],
  });
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const generateQuestion = () => {
    const ops = ['+', '-', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a = 0;
    let b = 0;
    let ans = 0;

    if (op === '+') {
      a = Math.floor(Math.random() * 80) + 10;
      b = Math.floor(Math.random() * 80) + 10;
      ans = a + b;
    } else if (op === '-') {
      a = Math.floor(Math.random() * 80) + 20;
      b = Math.floor(Math.random() * a);
      ans = a - b;
    } else {
      a = Math.floor(Math.random() * 14) + 2;
      b = Math.floor(Math.random() * 14) + 2;
      ans = a * b;
    }

    // Generate 3 unique wrong answers
    const wrongOptions = new Set<number>();
    while (wrongOptions.size < 3) {
      const offset = (Math.floor(Math.random() * 7) + 1) * (Math.random() > 0.5 ? 1 : -1);
      const wrong = ans + offset;
      if (wrong !== ans && wrong >= 0) {
        wrongOptions.add(wrong);
      }
    }

    const allOptions = [ans, ...Array.from(wrongOptions)].sort(() => Math.random() - 0.5);
    setQuestion({ text: `${a} ${op} ${b}`, answer: ans, options: allOptions });
  };

  const startGame = () => {
    setIsPlaying(true);
    setTimeLeft(45);
    setScore(0);
    setStreak(0);
    setFeedback(null);
    generateQuestion();
  };

  useEffect(() => {
    if (!isPlaying) return;
    if (timeLeft <= 0) {
      setIsPlaying(false);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('qm_speedmath_highscore', score.toString());
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, score, highScore]);

  const handleSelectOption = (selected: number) => {
    if (!isPlaying) return;

    if (selected === question.answer) {
      const addedPoints = 10 + streak * 2;
      setScore((s) => s + addedPoints);
      setStreak((st) => st + 1);
      setFeedback('correct');
      setTimeout(() => setFeedback(null), 300);
      generateQuestion();
    } else {
      setStreak(0);
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 400);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Top Header & Stats */}
      <div className="flex items-center justify-between w-full mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Speed Math Rush
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono font-bold">
          <span className="text-slate-400">Best: {highScore}</span>
          <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
            Score: {score}
          </span>
        </div>
      </div>

      {!isPlaying ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black font-display text-slate-900 dark:text-white mb-2">
            60-Second Mental Math Rush
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
            Solve as many rapid arithmetic equations as possible before the clock expires. Build streaks for huge multiplier bonuses!
          </p>
          <button
            type="button"
            onClick={startGame}
            className="inline-flex items-center gap-2 py-3 px-8 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            Start Challenge (45s)
          </button>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center">
          {/* Timer & Streak Bar */}
          <div className="flex items-center justify-between w-full mb-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-500">
              <Flame className="w-4 h-4 fill-rose-500" />
              <span>{streak}x Streak Combo</span>
            </div>
            <span
              className={`text-sm font-black font-mono px-3 py-0.5 rounded-full ${
                timeLeft <= 10
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              ⏱️ {timeLeft}s
            </span>
          </div>

          {/* Question Display */}
          <div
            className={`w-full py-8 my-3 rounded-2xl text-center border transition-all ${
              feedback === 'correct'
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500'
                : feedback === 'wrong'
                ? 'bg-rose-500/20 border-rose-500 text-rose-500 animate-shake'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
            }`}
          >
            <span className="text-4xl sm:text-5xl font-black font-mono tracking-wider">
              {question.text} = ?
            </span>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-2 gap-3 w-full mt-4">
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(opt)}
                className="py-4 rounded-xl text-xl font-bold font-mono bg-slate-100 hover:bg-amber-500 dark:bg-slate-800 dark:hover:bg-amber-500 hover:text-white text-slate-800 dark:text-slate-200 transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// GAME 2: 2048 EXPONENTIAL TILE PUZZLE
// ==========================================
const Game2048: React.FC = () => {
  const [grid, setGrid] = useState<number[][]>(() => [
    [0, 0, 0, 0],
    [0, 2, 0, 0],
    [0, 0, 4, 0],
    [0, 0, 0, 0],
  ]);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return Number(localStorage.getItem('qm_2048_highscore') || '0');
  });

  const addRandomTile = (currentGrid: number[][]) => {
    const emptyCells: { r: number; c: number }[] = [];
    currentGrid.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell === 0) emptyCells.push({ r, c });
      });
    });
    if (emptyCells.length === 0) return currentGrid;
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newGrid = currentGrid.map((row) => [...row]);
    newGrid[randomCell.r][randomCell.c] = Math.random() > 0.8 ? 4 : 2;
    return newGrid;
  };

  const resetGame = () => {
    let newGrid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    newGrid = addRandomTile(addRandomTile(newGrid));
    setGrid(newGrid);
    setScore(0);
  };

  const slide = (row: number[]): { newRow: number[]; gained: number } => {
    let arr = row.filter((val) => val !== 0);
    let gained = 0;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        gained += arr[i];
        arr[i + 1] = 0;
      }
    }
    arr = arr.filter((val) => val !== 0);
    while (arr.length < 4) {
      arr.push(0);
    }
    return { newRow: arr, gained };
  };

  const moveLeft = useCallback(() => {
    let changed = false;
    let gainedScore = 0;
    const newGrid = grid.map((row) => {
      const { newRow, gained } = slide(row);
      gainedScore += gained;
      if (JSON.stringify(newRow) !== JSON.stringify(row)) changed = true;
      return newRow;
    });
    if (changed) {
      const finalGrid = addRandomTile(newGrid);
      setGrid(finalGrid);
      setScore((s) => {
        const next = s + gainedScore;
        if (next > highScore) {
          setHighScore(next);
          localStorage.setItem('qm_2048_highscore', next.toString());
        }
        return next;
      });
    }
  }, [grid, highScore]);

  const moveRight = useCallback(() => {
    let changed = false;
    let gainedScore = 0;
    const newGrid = grid.map((row) => {
      const reversed = [...row].reverse();
      const { newRow, gained } = slide(reversed);
      gainedScore += gained;
      const finalRow = newRow.reverse();
      if (JSON.stringify(finalRow) !== JSON.stringify(row)) changed = true;
      return finalRow;
    });
    if (changed) {
      const finalGrid = addRandomTile(newGrid);
      setGrid(finalGrid);
      setScore((s) => {
        const next = s + gainedScore;
        if (next > highScore) {
          setHighScore(next);
          localStorage.setItem('qm_2048_highscore', next.toString());
        }
        return next;
      });
    }
  }, [grid, highScore]);

  const moveUp = useCallback(() => {
    let changed = false;
    let gainedScore = 0;
    const cols = [0, 1, 2, 3].map((c) => [grid[0][c], grid[1][c], grid[2][c], grid[3][c]]);
    const newCols = cols.map((col) => {
      const { newRow, gained } = slide(col);
      gainedScore += gained;
      if (JSON.stringify(newRow) !== JSON.stringify(col)) changed = true;
      return newRow;
    });
    if (changed) {
      const finalGrid = [0, 1, 2, 3].map((r) => [newCols[0][r], newCols[1][r], newCols[2][r], newCols[3][r]]);
      const withTile = addRandomTile(finalGrid);
      setGrid(withTile);
      setScore((s) => {
        const next = s + gainedScore;
        if (next > highScore) {
          setHighScore(next);
          localStorage.setItem('qm_2048_highscore', next.toString());
        }
        return next;
      });
    }
  }, [grid, highScore]);

  const moveDown = useCallback(() => {
    let changed = false;
    let gainedScore = 0;
    const cols = [0, 1, 2, 3].map((c) => [grid[0][c], grid[1][c], grid[2][c], grid[3][c]]);
    const newCols = cols.map((col) => {
      const reversed = [...col].reverse();
      const { newRow, gained } = slide(reversed);
      gainedScore += gained;
      const finalCol = newRow.reverse();
      if (JSON.stringify(finalCol) !== JSON.stringify(col)) changed = true;
      return finalCol;
    });
    if (changed) {
      const finalGrid = [0, 1, 2, 3].map((r) => [newCols[0][r], newCols[1][r], newCols[2][r], newCols[3][r]]);
      const withTile = addRandomTile(finalGrid);
      setGrid(withTile);
      setScore((s) => {
        const next = s + gainedScore;
        if (next > highScore) {
          setHighScore(next);
          localStorage.setItem('qm_2048_highscore', next.toString());
        }
        return next;
      });
    }
  }, [grid, highScore]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        if (e.key === 'ArrowUp') moveUp();
        if (e.key === 'ArrowDown') moveDown();
        if (e.key === 'ArrowLeft') moveLeft();
        if (e.key === 'ArrowRight') moveRight();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveUp, moveDown, moveLeft, moveRight]);

  const getTileColor = (val: number) => {
    switch (val) {
      case 2: return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200';
      case 4: return 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300';
      case 8: return 'bg-orange-500 text-white font-black';
      case 16: return 'bg-orange-600 text-white font-black shadow-sm';
      case 32: return 'bg-rose-500 text-white font-black shadow-sm';
      case 64: return 'bg-rose-600 text-white font-black shadow-sm';
      case 128: return 'bg-yellow-500 text-white font-black shadow-md';
      case 256: return 'bg-yellow-600 text-white font-black shadow-md';
      case 512: return 'bg-emerald-500 text-white font-black shadow-lg';
      case 1024: return 'bg-indigo-600 text-white font-black shadow-lg';
      case 2048: return 'bg-gradient-to-tr from-amber-400 to-rose-600 text-white font-black shadow-xl animate-pulse';
      default: return 'bg-slate-200/50 dark:bg-slate-950/50 text-transparent';
    }
  };

  return (
    <div className="flex flex-col items-center max-w-md mx-auto p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between w-full mb-4">
        <div>
          <h3 className="text-xl font-black font-display text-slate-900 dark:text-white">
            2048 Compounding
          </h3>
          <span className="text-[11px] text-slate-400">Join powers of 2 to reach 2048!</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-center">
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Score</span>
            <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">{score}</span>
          </div>
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-center border border-amber-300 dark:border-amber-800">
            <span className="text-[9px] uppercase font-bold text-amber-500 block">Best</span>
            <span className="text-xs font-bold font-mono text-amber-600 dark:text-amber-400">{highScore}</span>
          </div>
        </div>
      </div>

      {/* 4x4 Grid */}
      <div className="w-full aspect-square bg-slate-300 dark:bg-slate-950 p-2.5 rounded-2xl grid grid-cols-4 gap-2 mb-4">
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className={`rounded-xl flex items-center justify-center text-lg sm:text-xl font-bold font-mono transition-all duration-150 select-none ${getTileColor(
                cell
              )}`}
            >
              {cell > 0 ? cell : ''}
            </div>
          ))
        )}
      </div>

      {/* Touch / Click Controls for Mobile */}
      <div className="grid grid-cols-3 gap-2 w-48 mb-3">
        <div />
        <button
          type="button"
          onClick={moveUp}
          className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white flex items-center justify-center transition-all"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        <div />
        <button
          type="button"
          onClick={moveLeft}
          className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white flex items-center justify-center transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={moveDown}
          className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white flex items-center justify-center transition-all"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={moveRight}
          className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white flex items-center justify-center transition-all"
        >
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>

      <button
        type="button"
        onClick={resetGame}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Restart Game
      </button>
    </div>
  );
};

// ==========================================
// GAME 3: HIGHER OR LOWER PROBABILITY
// ==========================================
const HigherLowerGame: React.FC = () => {
  const [currentNum, setCurrentNum] = useState<number>(50);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [verdict, setVerdict] = useState<'win' | 'lose' | null>(null);

  const probHigher = Number(((100 - currentNum) / 99 * 100).toFixed(0));
  const probLower = Number(((currentNum - 1) / 99 * 100).toFixed(0));

  const handleGuess = (guess: 'higher' | 'lower') => {
    let nextNum = Math.floor(Math.random() * 100) + 1;
    while (nextNum === currentNum) {
      nextNum = Math.floor(Math.random() * 100) + 1;
    }

    const won = (guess === 'higher' && nextNum > currentNum) || (guess === 'lower' && nextNum < currentNum);

    if (won) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      setVerdict('win');
    } else {
      setStreak(0);
      setVerdict('lose');
    }

    setCurrentNum(nextNum);
    setTimeout(() => setVerdict(null), 700);
  };

  return (
    <div className="flex flex-col items-center max-w-md mx-auto p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
      <div className="flex items-center justify-between w-full mb-4 pb-3 border-b border-slate-200 dark:border-slate-800 text-xs">
        <span className="font-bold text-slate-500 uppercase">Higher / Lower Odds</span>
        <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
          🔥 Streak: {streak} (Best: {bestStreak})
        </span>
      </div>

      <div className="my-6">
        <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">Current Number</span>
        <div
          className={`text-6xl sm:text-7xl font-black font-mono transition-all ${
            verdict === 'win' ? 'text-emerald-500 scale-110' : verdict === 'lose' ? 'text-rose-500 scale-90' : 'text-slate-900 dark:text-white'
          }`}
        >
          {currentNum}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 text-xs font-mono mb-6 text-slate-500">
        <span className="text-emerald-600 dark:text-emerald-400 font-bold">P(Higher) = {probHigher}%</span>
        <span>•</span>
        <span className="text-purple-600 dark:text-purple-400 font-bold">P(Lower) = {probLower}%</span>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full">
        <button
          type="button"
          onClick={() => handleGuess('higher')}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <ArrowUp className="w-4 h-4" />
          Higher ({probHigher}%)
        </button>
        <button
          type="button"
          onClick={() => handleGuess('lower')}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <ArrowDown className="w-4 h-4" />
          Lower ({probLower}%)
        </button>
      </div>
    </div>
  );
};

// ==========================================
// GAME 4: THE MONTY HALL MYSTERY VAULT
// ==========================================
const MontyVaultGame: React.FC = () => {
  const [stage, setStage] = useState<'pick' | 'reveal' | 'result'>('pick');
  const [carDoor, setCarDoor] = useState<number>(0);
  const [selectedDoor, setSelectedDoor] = useState<number | null>(null);
  const [openedDoor, setOpenedDoor] = useState<number | null>(null);
  const [finalDoor, setFinalDoor] = useState<number | null>(null);

  const [stats, setStats] = useState<{ switchWins: number; switchGames: number; stayWins: number; stayGames: number }>({
    switchWins: 0,
    switchGames: 0,
    stayWins: 0,
    stayGames: 0,
  });

  const initGame = () => {
    setCarDoor(Math.floor(Math.random() * 3));
    setSelectedDoor(null);
    setOpenedDoor(null);
    setFinalDoor(null);
    setStage('pick');
  };

  useEffect(() => {
    initGame();
  }, []);

  const handlePickDoor = (doorIdx: number) => {
    if (stage !== 'pick') return;
    setSelectedDoor(doorIdx);

    // Host opens a goat door
    const available = [0, 1, 2].filter((d) => d !== doorIdx && d !== carDoor);
    const hostOpens = available[Math.floor(Math.random() * available.length)];
    setOpenedDoor(hostOpens);
    setStage('reveal');
  };

  const handleFinalChoice = (choice: 'stay' | 'switch') => {
    if (stage !== 'reveal' || selectedDoor === null || openedDoor === null) return;

    let finalPick = selectedDoor;
    if (choice === 'switch') {
      finalPick = [0, 1, 2].find((d) => d !== selectedDoor && d !== openedDoor)!;
    }

    setFinalDoor(finalPick);
    const isWin = finalPick === carDoor;

    setStats((prev) => {
      if (choice === 'switch') {
        return { ...prev, switchGames: prev.switchGames + 1, switchWins: isWin ? prev.switchWins + 1 : prev.switchWins };
      }
      return { ...prev, stayGames: prev.stayGames + 1, stayWins: isWin ? prev.stayWins + 1 : prev.stayWins };
    });

    setStage('result');
  };

  const switchWinRate = stats.switchGames > 0 ? Number(((stats.switchWins / stats.switchGames) * 100).toFixed(0)) : 0;
  const stayWinRate = stats.stayGames > 0 ? Number(((stats.stayWins / stats.stayGames) * 100).toFixed(0)) : 0;

  return (
    <div className="flex flex-col items-center max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
      <div className="flex items-center gap-2 mb-2">
        <Trophy className="w-5 h-5 text-amber-500" />
        <h3 className="text-lg font-black font-display text-slate-900 dark:text-white">
          The 3-Door Diamond Vault Heist
        </h3>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
        {stage === 'pick' && 'Select one of the three doors below. Behind one is the 💎 $10,000 Diamond Vault!'}
        {stage === 'reveal' && `Host opened Door ${openedDoor! + 1} with a 🐐 Goat! Do you want to Switch or Stay?`}
        {stage === 'result' && (finalDoor === carDoor ? '🎉 JACKPOT! You won the Diamond Vault!' : '🐐 BUST! You got the goat.')}
      </p>

      {/* 3 Doors Grid */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full mb-6">
        {[0, 1, 2].map((idx) => {
          const isSelected = selectedDoor === idx;
          const isOpened = openedDoor === idx;
          const isFinal = finalDoor === idx;
          const isWinner = carDoor === idx;

          let doorContent = `DOOR ${idx + 1}`;
          let doorBg = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';

          if (stage === 'result') {
            if (isWinner) {
              doorContent = '💎 VAULT!';
              doorBg = 'bg-emerald-500 text-white font-black shadow-lg animate-bounce';
            } else {
              doorContent = '🐐 GOAT';
              doorBg = 'bg-rose-500/20 border border-rose-500 text-rose-500';
            }
          } else if (isOpened) {
            doorContent = '🐐 GOAT';
            doorBg = 'bg-slate-200 dark:bg-slate-950 text-slate-400 border border-dashed';
          } else if (isSelected) {
            doorBg = 'bg-amber-500 text-white font-bold shadow-md';
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={stage !== 'pick' || isOpened}
              onClick={() => handlePickDoor(idx)}
              className={`h-36 sm:h-44 rounded-2xl flex flex-col items-center justify-center p-3 text-sm sm:text-base font-bold transition-all ${doorBg} ${
                stage === 'pick' ? 'hover:scale-105 cursor-pointer' : ''
              }`}
            >
              <span className="text-2xl sm:text-3xl mb-1">
                {isOpened ? '🐐' : stage === 'result' && isWinner ? '💎' : '🚪'}
              </span>
              <span>{doorContent}</span>
            </button>
          );
        })}
      </div>

      {/* Decision Buttons for Reveal Stage */}
      {stage === 'reveal' && (
        <div className="grid grid-cols-2 gap-3 w-full mb-4 animate-fade-in">
          <button
            type="button"
            onClick={() => handleFinalChoice('switch')}
            className="py-3 px-4 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-md transition-all cursor-pointer"
          >
            ⚡ Switch Door (66.7% Math Odds)
          </button>
          <button
            type="button"
            onClick={() => handleFinalChoice('stay')}
            className="py-3 px-4 rounded-xl text-xs font-bold bg-slate-700 hover:bg-slate-800 text-white shadow-md transition-all cursor-pointer"
          >
            Keep Original Pick (33.3% Odds)
          </button>
        </div>
      )}

      {stage === 'result' && (
        <button
          type="button"
          onClick={initGame}
          className="py-3 px-8 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md transition-all active:scale-95 cursor-pointer mb-6"
        >
          Play Next Round →
        </button>
      )}

      {/* Live Track Record */}
      <div className="grid grid-cols-2 gap-3 w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <span className="text-slate-400 block mb-0.5">Switch Strategy Win Rate</span>
          <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400 text-sm">
            {switchWinRate}% ({stats.switchWins}/{stats.switchGames} wins)
          </span>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Stay Strategy Win Rate</span>
          <span className="font-bold font-mono text-slate-700 dark:text-slate-300 text-sm">
            {stayWinRate}% ({stats.stayWins}/{stats.stayGames} wins)
          </span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// MAIN ARCADE VIEW
// ==========================================
export const GamesArcadeView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeGame, setActiveGame] = useState<GameMode>('speedMath');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-600/20 border border-amber-400/40 dark:border-amber-700/40 shadow-lg mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-500 text-white shadow-md">
            <Gamepad2 className="w-8 h-8 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white">
                Math Arcade & Time Pass Lounge
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-400">
                CASUAL & ADDICTIVE
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
              Sharpen your reflexes with rapid-fire mental math, exponential 2048 tile puzzles, high-odds guessing, and probability vaults.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4 mb-8 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveGame('speedMath')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeGame === 'speedMath'
              ? 'bg-amber-500 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
          }`}
        >
          <Zap className="w-4 h-4" />
          ⚡ Speed Math Rush (60s)
        </button>
        <button
          type="button"
          onClick={() => setActiveGame('game2048')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeGame === 'game2048'
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
          }`}
        >
          <Flame className="w-4 h-4" />
          🔢 2048 Compounding
        </button>
        <button
          type="button"
          onClick={() => setActiveGame('higherLower')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeGame === 'higherLower'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
          }`}
        >
          <Trophy className="w-4 h-4" />
          🎯 Higher / Lower Odds
        </button>
        <button
          type="button"
          onClick={() => setActiveGame('montyVault')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeGame === 'montyVault'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
          }`}
        >
          <Crown className="w-4 h-4" />
          💎 3-Door Diamond Vault
        </button>
      </div>

      {/* Active Game Render */}
      <div className="py-4">
        {activeGame === 'speedMath' && <SpeedMathGame />}
        {activeGame === 'game2048' && <Game2048 />}
        {activeGame === 'higherLower' && <HigherLowerGame />}
        {activeGame === 'montyVault' && <MontyVaultGame />}
      </div>
    </div>
  );
};

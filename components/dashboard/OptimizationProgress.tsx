'use client';

import { Trophy, CheckCircle2, Clock, Sparkles, Target, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface OptimizationProgressProps {
  points?: number;
  maxPoints?: number;
  level?: string;
  nextLevel?: string;
  totalXP?: number;
  tasks?: Array<{
    id: number;
    title: string;
    completed: boolean;
    current?: number;
    total?: number;
    xp: number;
  }>;
}

export function OptimizationProgress({
  points = 3,
  maxPoints = 5,
  level = 'Bronze',
  nextLevel = 'Silber',
  totalXP = 3,
  tasks = [
    { id: 1, title: 'Produkte synchronisiert', completed: true, xp: 0 },
    { id: 2, title: 'Empfehlungen umgesetzt', completed: false, current: 2, total: 10, xp: 10 },
    { id: 3, title: 'Monitoring aktiv', completed: true, xp: 5 },
  ],
}: OptimizationProgressProps) {
  const xpForNextLevel = maxPoints;
  const currentXP = points;
  const xpProgress = (currentXP / xpForNextLevel) * 100;
  
  return (
    <div className="h-full rounded-xl bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          {/* Trophy Icon - Elegant */}
          <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-slate-400" strokeWidth={1.5} />
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">
              Optimierungs-Fortschritt
            </h3>
            <div className="flex items-center gap-2">
              {/* Level Badge - Elegant */}
              <div className="px-2 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <span className="text-xs font-semibold text-slate-400">
                  {level}
                </span>
              </div>
              <div className="text-xs text-slate-600">
                {currentXP}/{xpForNextLevel} XP
              </div>
            </div>
          </div>
        </div>
        
        {/* Total XP - Elegant */}
        <div className="px-3 py-2 rounded-xl bg-slate-800/50">
          <div className="text-xs text-slate-600 mb-0.5 uppercase tracking-wider">
            Gesamt
          </div>
          <div className="text-xl font-bold text-slate-300 tracking-tight">
            {totalXP} XP
          </div>
        </div>
      </div>
      
      {/* Progress Bar - Elegant */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-500">
            Fortschritt zu {nextLevel}
          </span>
          <span className="text-sm font-semibold text-slate-400">
            {xpProgress.toFixed(0)}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-slate-800/50 border border-slate-800/50 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-slate-600 to-slate-500 rounded-full transition-all duration-500"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
      </div>
      
      {/* Achievements - Elegant */}
      <div className="space-y-3 flex-1 mb-6">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`p-3 rounded-xl border transition-all ${
              task.completed
                ? 'bg-slate-800/30 border-slate-700/50'
                : 'bg-slate-800/10 border-slate-800/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Icon - Monochrome */}
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  task.completed
                    ? 'bg-slate-700/50 text-slate-400'
                    : 'bg-slate-800/50 text-slate-600'
                }`}>
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5" strokeWidth={2} />
                  ) : (
                    <Clock className="w-5 h-5" strokeWidth={2} />
                  )}
                </div>
                <div>
                  <div className={`text-sm font-medium ${
                    task.completed ? 'text-slate-300' : 'text-slate-500'
                  }`}>
                    {task.title}
                  </div>
                  {!task.completed && task.xp > 0 && (
                    <div className="text-xs text-slate-600 mt-0.5">
                      +{task.xp} XP bei Abschluss
                    </div>
                  )}
                  {task.current !== undefined && (
                    <div className="text-xs text-slate-600 mt-0.5">
                      {task.current}/{task.total} umgesetzt
                    </div>
                  )}
                </div>
              </div>
              
              {task.completed && task.xp > 0 && (
                <div className="px-2 py-1 rounded-lg bg-slate-700/30 text-xs font-semibold text-slate-500">
                  +{task.xp} XP
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Next Level - Elegant */}
      <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800/50 mb-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1">
              Nächstes Level: {nextLevel}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Noch {xpForNextLevel - currentXP} XP bis zum nächsten Level!
            </p>
          </div>
        </div>
      </div>
      
      {/* CTA Button - Elegant (matching left side) */}
      <Link
        href="/demo/recommendations"
        className="block w-full py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-700 text-slate-300 hover:text-slate-200 font-medium transition-all group"
      >
        <div className="flex items-center justify-center gap-2 text-sm">
          <Target className="w-4 h-4" strokeWidth={2} />
          Empfehlungen ansehen
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
        </div>
      </Link>
    </div>
  );
}

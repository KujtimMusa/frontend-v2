'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock } from 'lucide-react';

interface TrustLadderProps {
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  points: number;
  nextLevelPoints: number;
  completedSteps: string[];
  pendingSteps: Array<{
    text: string;
    points: number;
    action: string;
  }>;
}

export function TrustLadder({
  level,
  points,
  nextLevelPoints,
  completedSteps,
  pendingSteps,
}: TrustLadderProps) {
  const progress = (points / nextLevelPoints) * 100;

  const levelConfig = {
    bronze: { name: '🥉 Bronze', color: 'from-orange-400 to-orange-600' },
    silver: { name: '🥈 Silber', color: 'from-gray-300 to-gray-500' },
    gold: { name: '🥇 Gold', color: 'from-yellow-400 to-yellow-600' },
    platinum: { name: '💎 Platin', color: 'from-purple-400 to-purple-600' },
  };

  const config = levelConfig[level];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Optimierungs-Fortschritt</CardTitle>
        <p className="text-sm text-muted-foreground">{config.name}</p>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>
              {points}/{nextLevelPoints} Punkte
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-2">
          {completedSteps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>{step}</span>
            </div>
          ))}
          {pendingSteps.map((step, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Clock className="w-4 h-4" />
              <span>{step.text}</span>
              <Badge variant="outline" className="ml-auto">
                +{step.points} XP
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

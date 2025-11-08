import { Card, CardContent } from '@/components/ui/card';
import { HealthAnalysis } from '@/utils/healthAnalysis';

interface HealthScoreDisplayProps {
  healthData: HealthAnalysis;
}

export const HealthScoreDisplay = ({ healthData }: HealthScoreDisplayProps) => {
  const getHealthInfo = (health: string) => {
    switch (health) {
      case 'excellent':
        return {
          icon: '💚',
          label: 'Excellent Communication',
          color: 'from-green-400 to-emerald-500',
          textColor: 'text-green-700 dark:text-green-300'
        };
      case 'good':
        return {
          icon: '💙',
          label: 'Healthy Communication',
          color: 'from-blue-400 to-cyan-500',
          textColor: 'text-blue-700 dark:text-blue-300'
        };
      case 'fair':
        return {
          icon: '💛',
          label: 'Room for Improvement',
          color: 'from-yellow-400 to-amber-500',
          textColor: 'text-yellow-700 dark:text-yellow-300'
        };
      case 'poor':
        return {
          icon: '🧡',
          label: 'Several Concerns',
          color: 'from-orange-400 to-orange-500',
          textColor: 'text-orange-700 dark:text-orange-300'
        };
      default:
        return {
          icon: '❤️',
          label: 'Needs Attention',
          color: 'from-rose-400 to-pink-500',
          textColor: 'text-rose-700 dark:text-rose-300'
        };
    }
  };

  const healthInfo = getHealthInfo(healthData.overallHealth);
  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (healthData.healthScore / 100) * circumference;

  return (
    <Card className="glass-effect border-2">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Radial Progress */}
          <div className="relative flex-shrink-0">
            <svg className="w-40 h-40 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              {/* Progress circle */}
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="url(#healthGradient)"
                strokeWidth="12"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" className="text-purple-500" stopColor="currentColor" />
                  <stop offset="50%" className="text-pink-500" stopColor="currentColor" />
                  <stop offset="100%" className="text-rose-500" stopColor="currentColor" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-4xl font-bold prism-text">{healthData.healthScore}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">/ 100</p>
            </div>
          </div>

          {/* Health Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="text-4xl">{healthInfo.icon}</span>
              <h3 className={`text-2xl font-bold ${healthInfo.textColor}`}>
                {healthInfo.label}
              </h3>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {healthData.summary.totalFlags === 0
                ? 'Your communication patterns look great! Keep up the good work.'
                : `${healthData.summary.totalFlags} ${healthData.summary.totalFlags === 1 ? 'insight' : 'insights'} detected${healthData.summary.criticalFlags > 0 ? `, including ${healthData.summary.criticalFlags} that ${healthData.summary.criticalFlags === 1 ? 'needs' : 'need'} attention` : ''}.`}
            </p>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400">Insights</p>
                <p className="text-xl font-bold prism-text">{healthData.summary.totalFlags}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400">Positive</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  {healthData.positivePatterns.length}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400">Priority</p>
                <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                  {healthData.summary.criticalFlags}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

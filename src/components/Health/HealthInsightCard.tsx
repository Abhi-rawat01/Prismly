import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, X, CheckCircle } from 'lucide-react';
import { HealthFlag } from '@/utils/healthAnalysis';
import { TrendMiniChart } from './TrendMiniChart';

interface HealthInsightCardProps {
  flag: HealthFlag;
  participants: string[];
  onDismiss: () => void;
  isDismissed?: boolean;
}

export const HealthInsightCard = ({
  flag,
  participants,
  onDismiss,
  isDismissed = false
}: HealthInsightCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getSeverityInfo = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          icon: '🔴',
          color: 'border-orange-300 dark:border-orange-700 bg-orange-50/50 dark:bg-orange-900/10',
          badgeColor: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
        };
      case 'warning':
        return {
          icon: '🟡',
          color: 'border-yellow-300 dark:border-yellow-700 bg-yellow-50/50 dark:bg-yellow-900/10',
          badgeColor: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
        };
      default:
        return {
          icon: '🟢',
          color: 'border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-900/10',
          badgeColor: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
        };
    }
  };

  const severityInfo = getSeverityInfo(flag.severity);

  return (
    <Card className={`border-2 ${severityInfo.color} ${isDismissed ? 'opacity-60' : ''} transition-all duration-300`}>
      <CardContent className="p-4">
        {/* Collapsed State */}
        <div className="flex items-start justify-between gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 flex items-start gap-3 text-left"
          >
            <span className="text-2xl flex-shrink-0">{flag.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {flag.title}
                </h4>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityInfo.badgeColor}`}>
                  {flag.severity}
                </span>
                {flag.affectedPerson && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    {flag.affectedPerson.split(' ')[0]}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {flag.description}
              </p>
            </div>
          </button>

          <div className="flex items-center gap-2 flex-shrink-0">
            {!isDismissed && (
              <button
                onClick={onDismiss}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                title="Dismiss"
              >
                <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Expanded State */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4 animate-in fade-in duration-300">
            {/* Metrics */}
            {Object.keys(flag.metrics).length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  📊 Metrics
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(flag.metrics).map(([key, value]) => {
                    // Handle nested objects (like person1, person2)
                    if (typeof value === 'object' && value !== null) {
                      return (
                        <div key={key} className="col-span-2">
                          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            {key}:
                          </p>
                          <div className="grid grid-cols-2 gap-2 ml-2">
                            {Object.entries(value).map(([subKey, subValue]) => (
                              <div
                                key={subKey}
                                className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                              >
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {subKey}
                                </p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {String(subValue)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={key}
                        className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {String(value)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Trend Indicator */}
            {flag.trend !== 'stable' && (
              <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  📈 Trend
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {flag.trend === 'improving' && '✅ Improving over time'}
                  {flag.trend === 'worsening' && '⚠️ Declining recently'}
                </p>
              </div>
            )}

            {/* Recommendations */}
            {flag.recommendations.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  💡 Suggestions
                </p>
                <ul className="space-y-2">
                  {flag.recommendations.map((rec, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      <CheckCircle className="h-4 w-4 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {isDismissed && (
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                  This insight has been dismissed
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

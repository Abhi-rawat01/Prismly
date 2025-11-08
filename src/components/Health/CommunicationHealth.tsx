import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Heart, Settings, Info } from 'lucide-react';
import { HealthAnalysis } from '@/utils/healthAnalysis';
import { HealthInsightCard } from './HealthInsightCard';
import { HealthScoreDisplay } from './HealthScoreDisplay';

interface CommunicationHealthProps {
  healthData: HealthAnalysis;
  participants: string[];
}

export const CommunicationHealth = ({ healthData, participants }: CommunicationHealthProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showDismissed, setShowDismissed] = useState(false);
  const [dismissedInsights, setDismissedInsights] = useState<string[]>([]);
  const [showConsent, setShowConsent] = useState(false);

  const STORAGE_KEY = 'prismly_health_expanded';
  const DISMISSED_KEY = 'prismly_health_dismissed';
  const CONSENT_KEY = 'prismly_health_consent';

  // Load preferences
  useEffect(() => {
    const expanded = localStorage.getItem(STORAGE_KEY);
    if (expanded !== null) {
      setIsExpanded(expanded === 'true');
    }

    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (dismissed) {
      setDismissedInsights(JSON.parse(dismissed));
    }

    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const toggleExpanded = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    localStorage.setItem(STORAGE_KEY, String(newState));
  };

  const handleDismiss = (flagType: string) => {
    const updated = [...dismissedInsights, flagType];
    setDismissedInsights(updated);
    localStorage.setItem(DISMISSED_KEY, JSON.stringify(updated));
  };

  const handleShowDismissed = () => {
    setShowDismissed(!showDismissed);
  };

  const handleClearDismissed = () => {
    setDismissedInsights([]);
    localStorage.removeItem(DISMISSED_KEY);
  };

  const handleConsent = () => {
    localStorage.setItem(CONSENT_KEY, 'true');
    setShowConsent(false);
  };

  const activeFlags = healthData.flags.filter(
    f => f.detected && !dismissedInsights.includes(f.type)
  );
  const dismissedFlags = healthData.flags.filter(
    f => f.detected && dismissedInsights.includes(f.type)
  );

  // Consent Modal
  if (showConsent) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-2xl w-full glass-effect border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Heart className="h-6 w-6 text-pink-500" />
              Communication Health Check
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <p>
                This feature analyzes patterns in your conversation data to provide insights about communication habits.
              </p>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="font-semibold mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Important to Know:
                </p>
                <ul className="space-y-1 text-xs list-disc list-inside">
                  <li>All analysis happens in your browser - data stays private</li>
                  <li>These are data patterns, not relationship advice</li>
                  <li>Context matters beyond what data can show</li>
                  <li>You can disable this feature anytime</li>
                  <li>Trust your own judgment about your relationships</li>
                </ul>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                For serious relationship concerns, please seek professional guidance from a qualified therapist or counselor.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleConsent}
                className="flex-1 p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                I Understand
              </button>
              <button
                onClick={() => {
                  localStorage.setItem(CONSENT_KEY, 'declined');
                  setShowConsent(false);
                  setIsExpanded(false);
                }}
                className="px-6 p-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Skip
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="glass-effect border-2 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-4">
          <button
            onClick={toggleExpanded}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  💬 Communication Health Check
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {activeFlags.length} {activeFlags.length === 1 ? 'insight' : 'insights'} detected
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              )}
            </div>
          </button>

          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                These are data patterns based on messaging habits, not relationship advice. Every relationship communicates differently.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Health Score */}
          <HealthScoreDisplay healthData={healthData} />

          {/* Positive Patterns */}
          {healthData.positivePatterns.length > 0 && (
            <Card className="glass-effect border-2 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-2xl">✨</span>
                  What's Going Well
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {healthData.positivePatterns.map((pattern, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{pattern.icon}</span>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">
                            {pattern.title}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {pattern.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Insights */}
          {activeFlags.length > 0 && (
            <Card className="glass-effect border-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-2xl">💡</span>
                  Insights & Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Critical flags first */}
                {activeFlags
                  .filter(f => f.severity === 'critical')
                  .map(flag => (
                    <HealthInsightCard
                      key={flag.type}
                      flag={flag}
                      participants={participants}
                      onDismiss={() => handleDismiss(flag.type)}
                    />
                  ))}

                {/* Warning flags */}
                {activeFlags
                  .filter(f => f.severity === 'warning')
                  .map(flag => (
                    <HealthInsightCard
                      key={flag.type}
                      flag={flag}
                      participants={participants}
                      onDismiss={() => handleDismiss(flag.type)}
                    />
                  ))}

                {/* Healthy metrics with insights */}
                {activeFlags
                  .filter(f => f.severity === 'healthy')
                  .map(flag => (
                    <HealthInsightCard
                      key={flag.type}
                      flag={flag}
                      participants={participants}
                      onDismiss={() => handleDismiss(flag.type)}
                    />
                  ))}
              </CardContent>
            </Card>
          )}

          {/* Dismissed Insights */}
          {dismissedFlags.length > 0 && (
            <div className="text-center">
              <button
                onClick={handleShowDismissed}
                className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
              >
                {showDismissed ? 'Hide' : 'Show'} {dismissedFlags.length} dismissed insight
                {dismissedFlags.length !== 1 ? 's' : ''}
              </button>

              {showDismissed && (
                <div className="mt-4 space-y-3">
                  {dismissedFlags.map(flag => (
                    <HealthInsightCard
                      key={flag.type}
                      flag={flag}
                      participants={participants}
                      onDismiss={() => {}}
                      isDismissed
                    />
                  ))}
                  <button
                    onClick={handleClearDismissed}
                    className="text-sm text-red-600 dark:text-red-400 hover:underline"
                  >
                    Clear all dismissed insights
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

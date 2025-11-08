import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar, X, Edit2 } from 'lucide-react';
import { RelationshipType } from '@/components/RelationshipTypeSelector';

interface AnniversaryCardProps {
  firstMessageDate: Date;
  totalMessages: number;
  relationshipType: RelationshipType;
  chatHash?: string;
}

interface Milestone {
  days: number;
  label: string;
  emoji: string;
  achieved: boolean;
}

export const AnniversaryCard = ({ 
  firstMessageDate, 
  totalMessages, 
  relationshipType,
  chatHash = 'default'
}: AnniversaryCardProps) => {
  const [anniversaryDate, setAnniversaryDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [inputDate, setInputDate] = useState('');

  const storageKey = `prismly_anniversary_${chatHash}`;

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setAnniversaryDate(new Date(saved));
    }
  }, [storageKey]);

  const getContextLabels = (type: RelationshipType) => {
    switch (type) {
      case 'romantic':
        return { title: 'Days Together', subtitle: 'Anniversary' };
      case 'friend':
        return { title: 'Days of Friendship', subtitle: 'Friendship Started' };
      case 'family':
        return { title: 'Days Staying Connected', subtitle: 'Started Chatting' };
      case 'professional':
        return { title: 'Days of Collaboration', subtitle: 'Started Working' };
      default:
        return { title: 'Days Chatting', subtitle: 'Started Chatting' };
    }
  };

  const labels = getContextLabels(relationshipType);

  const calculateDays = (startDate: Date) => {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getMilestones = (days: number, messages: number): Milestone[] => {
    return [
      { days: 30, label: '30 Days', emoji: '🎊', achieved: days >= 30 },
      { days: 100, label: '100 Days', emoji: '🎉', achieved: days >= 100 },
      { days: 365, label: '1 Year', emoji: '🎂', achieved: days >= 365 },
      { days: 730, label: '2 Years', emoji: '⭐', achieved: days >= 730 },
      { days: 1825, label: '5 Years', emoji: '💎', achieved: days >= 1825 },
    ].concat([
      { days: 0, label: '1,000 Messages', emoji: '💝', achieved: messages >= 1000 },
      { days: 0, label: '10,000 Messages', emoji: '🏆', achieved: messages >= 10000 },
    ]);
  };

  const getNextMilestone = (days: number, messages: number) => {
    const dayMilestones = [30, 100, 365, 730, 1825];
    const nextDay = dayMilestones.find(m => m > days);
    
    const messageMilestones = [1000, 10000];
    const nextMessage = messageMilestones.find(m => m > messages);

    if (nextDay && nextMessage) {
      const daysUntil = nextDay - days;
      const messagesUntil = nextMessage - messages;
      return { type: 'both', daysUntil, messagesUntil, nextDay, nextMessage };
    } else if (nextDay) {
      return { type: 'days', daysUntil: nextDay - days, nextDay };
    } else if (nextMessage) {
      return { type: 'messages', messagesUntil: nextMessage - messages, nextMessage };
    }
    return null;
  };

  const handleSetDate = () => {
    if (inputDate) {
      const date = new Date(inputDate);
      setAnniversaryDate(date);
      localStorage.setItem(storageKey, date.toISOString());
      setShowDatePicker(false);
      setInputDate('');
    }
  };

  const handleClearDate = () => {
    setAnniversaryDate(null);
    localStorage.removeItem(storageKey);
    setShowDatePicker(false);
  };

  const activeDate = anniversaryDate || firstMessageDate;
  const daysTogether = calculateDays(activeDate);
  const milestones = getMilestones(daysTogether, totalMessages);
  const nextMilestone = getNextMilestone(daysTogether, totalMessages);
  const activeDays = milestones.filter(m => m.days > 0).length;
  const achievedMilestones = milestones.filter(m => m.achieved);

  // Minimized state when no anniversary set
  if (!anniversaryDate && !showDatePicker) {
    return (
      <Card className="glass-effect border-2 hover:shadow-xl transition-all duration-300">
        <CardContent className="p-4">
          <button
            onClick={() => setShowDatePicker(true)}
            className="w-full flex items-center justify-between p-3 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  📅 Set Start Date
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Add context to your analysis
                </p>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect border-2 hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <Calendar className="h-5 w-5 mr-2 text-purple-600" />
            📅 Timeline
          </CardTitle>
          {anniversaryDate && (
            <button
              onClick={() => setShowDatePicker(true)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <Edit2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {showDatePicker ? (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {labels.subtitle}
              </label>
              <input
                type="date"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full p-2 border-2 border-purple-200 dark:border-purple-800 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-purple-400 dark:focus:border-purple-600 focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSetDate}
                disabled={!inputDate}
                className="flex-1 p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Date
              </button>
              <button
                onClick={() => setShowDatePicker(false)}
                className="px-4 p-2 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
            {anniversaryDate && (
              <button
                onClick={handleClearDate}
                className="w-full p-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                Clear Date
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Main Stats */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 text-white">
              <p className="text-sm opacity-90 mb-1">{labels.title}</p>
              <p className="text-4xl font-bold mb-2">{daysTogether}</p>
              <p className="text-xs opacity-75">
                Since {activeDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            {/* Additional Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 glass-effect rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Messages/Day</p>
                <p className="text-xl font-bold prism-text">
                  {(totalMessages / daysTogether).toFixed(1)}
                </p>
              </div>
              <div className="p-3 glass-effect rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Messages</p>
                <p className="text-xl font-bold prism-text">
                  {totalMessages.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Milestone Badges */}
            {achievedMilestones.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  🏆 Milestones Achieved
                </p>
                <div className="flex flex-wrap gap-2">
                  {achievedMilestones.map((milestone, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full text-xs font-medium shadow-lg"
                    >
                      {milestone.emoji} {milestone.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Milestone */}
            {nextMilestone && (
              <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Next Milestone
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {nextMilestone.type === 'days' && `${nextMilestone.daysUntil} days until ${nextMilestone.nextDay} days`}
                  {nextMilestone.type === 'messages' && `${nextMilestone.messagesUntil} messages until ${nextMilestone.nextMessage?.toLocaleString()}`}
                  {nextMilestone.type === 'both' && `${nextMilestone.daysUntil} days or ${nextMilestone.messagesUntil} messages`}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

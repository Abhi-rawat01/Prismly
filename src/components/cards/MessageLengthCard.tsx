import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText, TrendingUp, X } from 'lucide-react';
import { MessageLengthStats } from '@/utils/advancedAnalytics';

interface MessageLengthCardProps {
  data: MessageLengthStats;
  participants: string[];
}

export const MessageLengthCard = ({ data, participants }: MessageLengthCardProps) => {
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  
  const person1Data = data[participants[0]];
  const person2Data = data[participants[1]];
  
  const moreInvested = person1Data.avgChars > person2Data.avgChars ? participants[0] : participants[1];
  const investmentDiff = Math.abs(person1Data.avgChars - person2Data.avgChars);
  const investmentPercentage = Math.min(person1Data.avgChars, person2Data.avgChars) > 0 
    ? (investmentDiff / Math.min(person1Data.avgChars, person2Data.avgChars)) * 100 
    : 0;

  // Determine if investment is equal (0-5%)
  const isEqual = investmentPercentage <= 5;

  return (
    <Card className="glass-effect border-2">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-purple-600" />
          Message Length Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Comparison Grid */}
          <div className="grid grid-cols-2 gap-4">
            {participants.map((person, idx) => {
              const personData = data[person];
              const colors = ['from-red-500 to-pink-500', 'from-blue-500 to-cyan-500'];
              
              return (
                <div key={person} className={`p-4 rounded-xl bg-gradient-to-br ${colors[idx]} text-white`}>
                  <p className="text-sm font-semibold mb-3">{person.split(' ')[0]}</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs opacity-90">Avg Characters</p>
                      <p className="text-2xl font-bold">{personData.avgChars}</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-90">Avg Words</p>
                      <p className="text-xl font-bold">{personData.avgWords}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Investment Indicator */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Investment Level
              </p>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {isEqual ? (
                <>
                  <span className="font-bold prism-text">Both write equally long messages</span>
                  <span className="text-gray-500 dark:text-gray-400"> (within {investmentPercentage.toFixed(0)}%)</span>
                </>
              ) : (
                <>
                  <span className="font-bold prism-text">{moreInvested.split(' ')[0]}</span> writes 
                  <span className="font-bold text-purple-600 dark:text-purple-400"> {investmentPercentage.toFixed(0)}% longer</span> messages on average
                </>
              )}
            </p>
          </div>

          {/* Longest Messages - Clickable */}
          <div className="grid grid-cols-2 gap-4">
            {participants.map((person, idx) => {
              const personData = data[person];
              
              return (
                <div 
                  key={person} 
                  onClick={() => setSelectedPerson(selectedPerson === person ? null : person)}
                  className={`p-3 glass-effect rounded-lg border cursor-pointer transition-all duration-300 hover:scale-105 text-center ${
                    selectedPerson === person 
                      ? 'border-purple-400 dark:border-purple-600 shadow-lg' 
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    {person.split(' ')[0]}'s Longest
                  </p>
                  <p className="text-xl font-bold prism-text">
                    {personData.longest} chars
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Click for details</p>
                </div>
              );
            })}
          </div>

          {/* Message Details Panel */}
          {selectedPerson && data[selectedPerson]?.longestMessage && (
            <div className="mt-4 p-6 glass-effect rounded-xl border-2 border-purple-300 dark:border-purple-700 animate-in fade-in duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold prism-text">
                  {selectedPerson.split(' ')[0]}'s Longest Message
                </h3>
                <button 
                  onClick={() => setSelectedPerson(null)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-3">
                {/* Message Content */}
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                      {selectedPerson}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {data[selectedPerson].longestMessage?.timestamp.toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap break-words">
                    "{data[selectedPerson].longestMessage?.message}"
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Characters</p>
                    <p className="text-lg font-bold prism-text">{data[selectedPerson].longest}</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Words</p>
                    <p className="text-lg font-bold prism-text">
                      {data[selectedPerson].longestMessage?.message.trim().split(/\s+/).filter(w => w.length > 0).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

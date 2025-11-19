import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, TrendingUp, MessageSquare, Clock, Target, Camera, Activity, BarChart3, Heart } from 'lucide-react';
import { ChatData } from '@/types/chat';
import { RelationshipType } from '@/components/RelationshipTypeSelector';
import { calculateConnectionScore } from '@/utils/connectionScore';
import ReplyTimeChart from '@/components/charts/ReplyTimeChart';
import EmojiChart from '@/components/charts/EmojiChart';
import WordChart from '@/components/charts/WordChart';
import ActivityHeatmap from '@/components/charts/ActivityHeatmap';
import FinalVerdict from '@/components/FinalVerdict';
import MessageDistributionChart from './charts/MessageDistributionChart';
import { MobileMenu } from '@/components/MobileMenu';
import { ConversationStarterCard } from '@/components/cards/ConversationStarterCard';
import { EmojiCompatibilityCard } from '@/components/cards/EmojiCompatibilityCard';
import { MessageLengthCard } from '@/components/cards/MessageLengthCard';
import { PeakActivityCard } from '@/components/cards/PeakActivityCard';
import { TopWordsCard } from '@/components/cards/TopWordsCard';
import {
  ConversationStarterBadge,
  NightOwlCard,
  LongestStreakCard
} from '@/components/QuickWins';
import {
  getConversationStarters,
  calculateEmojiCompatibility,
  analyzeMessageLength,
  detectPeakActivity,
  calculateStreaks
} from '@/utils/advancedAnalytics';
import { RelationshipTypeSwitcher } from '@/components/RelationshipTypeSwitcher';
import { ConversationMathematics } from '@/components/ConversationMathematics';
import { calculateConversationMath } from '@/utils/conversationMath';
import { ConversationGalaxy } from '@/components/ConversationGalaxy';
import { analyzeConversationGalaxy } from '@/utils/spaceAnalytics';
import { useState, useMemo } from 'react';

interface DashboardProps {
  chatData: ChatData;
  relationshipType: string;
  onReset: () => void;
}

const StatCard = ({ title, value, icon: Icon, color, gradient }: { title: string, value: string | number, icon: React.ElementType, color: string, gradient: string }) => (
  <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 overflow-hidden group">
    <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className={`p-2 rounded-lg ${gradient}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold prism-text">{value}</div>
    </CardContent>
  </Card>
);

const getRelationshipBadge = (type: string) => {
  const badges = {
    romantic: { emoji: '💕', label: 'Romantic', color: 'from-pink-500 to-rose-500' },
    friend: { emoji: '👥', label: 'Friend', color: 'from-blue-500 to-cyan-500' },
    family: { emoji: '👨‍👩‍👧', label: 'Family', color: 'from-teal-500 to-green-500' },
    professional: { emoji: '💼', label: 'Professional', color: 'from-violet-500 to-purple-500' },
    other: { emoji: '💬', label: 'Other', color: 'from-pink-500 via-purple-500 to-yellow-500' }
  };

  return badges[type as keyof typeof badges] || badges.other;
};

const Dashboard = ({ chatData, relationshipType: initialRelationshipType, onReset }: DashboardProps) => {
  // Allow users to switch relationship type
  const [relationshipType, setRelationshipType] = useState<RelationshipType>(initialRelationshipType as RelationshipType);
  const [currentTab, setCurrentTab] = useState('overview');

  const badge = getRelationshipBadge(relationshipType);

  // Recalculate when relationship type changes
  const connectionScore = useMemo(() => calculateConnectionScore({
    avgReplyTime: chatData.avgReplyTime,
    totalEmojis: chatData.totalEmojis,
    totalMessages: chatData.totalMessages,
    messageRatio: chatData.messageRatio,
    consistencyRatio: chatData.consistencyRatio,
    relationshipType: relationshipType,
    participants: chatData.participants
  }), [chatData, relationshipType]);

  // Calculate advanced analytics (memoized for performance)
  const conversationStarters = useMemo(() =>
    getConversationStarters(chatData.messages, chatData.participants),
    [chatData.messages, chatData.participants]
  );

  const emojiCompatibility = useMemo(() =>
    calculateEmojiCompatibility(chatData.messages, chatData.participants[0], chatData.participants[1]),
    [chatData.messages, chatData.participants]
  );

  const messageLengthStats = useMemo(() =>
    analyzeMessageLength(chatData.messages, chatData.participants),
    [chatData.messages, chatData.participants]
  );

  const peakActivity = useMemo(() =>
    detectPeakActivity(chatData.messages, chatData.participants),
    [chatData.messages, chatData.participants]
  );

  const streakData = useMemo(() =>
    calculateStreaks(chatData.messages),
    [chatData.messages]
  );

  const conversationMath = useMemo(() =>
    calculateConversationMath(chatData.messages),
    [chatData.messages]
  );

  const galaxyData = useMemo(() =>
    analyzeConversationGalaxy(chatData.messages),
    [chatData.messages]
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      <header className="glass-effect border-b-2 border-purple-200/50 dark:border-purple-800/50 sticky top-0 z-30 shadow-lg">
        <div className="container mx-auto px-3 py-2 md:px-4 md:py-4">
          {/* Main header row */}
          <div className="flex items-center justify-between">
            {/* Logo and Name - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg prism-gradient">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight prism-text">
                  Prismly
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-full glass-effect border border-purple-200 dark:border-purple-800">
                  <MessageSquare className="h-4 w-4 inline mr-1 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {chatData.participants[0]} {badge.emoji} {chatData.participants[1]}
                  </span>
                </div>
              </div>
            </div>

            {/* Empty div on mobile to maintain layout */}
            <div className="md:hidden"></div>

            <div className="flex items-center gap-2">
              {/* Relationship Switcher - visible on all screen sizes */}
              <RelationshipTypeSwitcher
                currentType={relationshipType}
                onTypeChange={setRelationshipType}
              />
              {/* Hide New Analysis button on mobile - it's in the menu */}
              <Button
                variant="outline"
                onClick={onReset}
                className="hidden md:flex border-2 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                New Analysis
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-2 md:p-8 relative z-10">
        {/* Centered Participants Display with Relationship Emoji - Mobile Only */}
        <div className="flex md:hidden justify-center mb-3">
          <div className="px-4 py-2 rounded-full glass-effect border-2 border-purple-300 dark:border-purple-800 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {chatData.participants[0]}
              </span>
              <span className="text-lg">{badge.emoji}</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {chatData.participants[1]}
              </span>
            </div>
          </div>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-3 md:space-y-6">
          {/* Hide TabsList on mobile - navigation is in the menu */}
          <TabsList className="hidden md:flex w-full bg-white dark:bg-gray-800 p-2 rounded-lg border-2 border-purple-300 dark:border-purple-700 shadow-lg">
            <TabsTrigger value="overview" className="flex-1">
              <Target className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="reply-times" className="flex-1">
              <Clock className="h-4 w-4 mr-2" />
              Responsiveness
            </TabsTrigger>
            <TabsTrigger value="emojis" className="flex-1">
              <Heart className="h-4 w-4 mr-2" />
              Engagement
            </TabsTrigger>
            <TabsTrigger value="words" className="flex-1">
              <MessageSquare className="h-4 w-4 mr-2" />
              Conversation
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex-1">
              <Activity className="h-4 w-4 mr-2" />
              Patterns
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-3 md:space-y-6">
            <FinalVerdict
              chatData={chatData}
              relationshipType={relationshipType as RelationshipType}
              connectionScore={connectionScore}
            />

            {/* Quick Insights Section */}
            <div className="space-y-2 md:space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xl md:text-2xl">⚡</span>
                <h2 className="text-xl md:text-2xl font-bold prism-text">Quick Insights</h2>
              </div>

              <div className="grid gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-3">
                <ConversationStarterBadge
                  data={conversationStarters}
                  participants={chatData.participants}
                />
                <div className="hidden md:block">
                  <NightOwlCard
                    data={peakActivity}
                    participants={chatData.participants}
                  />
                </div>
                <div className="hidden md:block">
                  <LongestStreakCard data={streakData} />
                </div>
              </div>
            </div>

            <div className="grid gap-3 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Messages"
                value={chatData.totalMessages}
                icon={MessageSquare}
                color="text-blue-600"
                gradient="bg-gradient-to-br from-blue-500 to-blue-600"
              />
              <StatCard
                title="Avg Reply Time"
                value={`${chatData.avgReplyTime} min`}
                icon={Clock}
                color="text-green-600"
                gradient="bg-gradient-to-br from-green-500 to-green-600"
              />
              <StatCard
                title="Media Shared"
                value={chatData.mediaCount}
                icon={Camera}
                color="text-purple-600"
                gradient="bg-gradient-to-br from-purple-500 to-purple-600"
              />
              <StatCard
                title="Connection Score"
                value={`${connectionScore}%`}
                icon={Target}
                color="text-pink-600"
                gradient="bg-gradient-to-br from-pink-500 to-pink-600"
              />
            </div>

            <div className="grid gap-3 md:gap-6 md:grid-cols-2">
              <MessageDistributionChart data={chatData.messageCountByUser} />
              <Card className="glass-effect border-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                    Message Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {chatData.participants.map((p, idx) => {
                      const total = chatData.totalMessages;
                      const count = chatData.messageCountByUser[p];
                      const percentage = total > 0 ? (count / total * 100).toFixed(1) : 0;
                      const colors = ['from-violet-500 to-purple-600', 'from-pink-500 to-rose-600'];
                      return (
                        <div key={p}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{p.split(' ')[0]}</span>
                            <span className="text-sm font-bold prism-text">{percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div className={`bg-gradient-to-r ${colors[idx % 2]} h-3 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Conversation Mathematics */}
            <ConversationMathematics data={conversationMath} />

            {/* Conversation Galaxy - Hidden on mobile */}
            <div className="hidden md:block">
              <ConversationGalaxy data={galaxyData} />
            </div>

            {/* Footer */}
            <div className="text-center py-6 text-sm relative z-10">
              <p className="text-gray-600 dark:text-gray-400">
                Made with ❤️ by{' '}
                <a href="https://www.instagram.com/abhi_rawat_uk1" target="_blank" rel="noopener noreferrer" className="font-bold prism-text hover:underline transition-all duration-300 relative z-10 cursor-pointer">
                  Abhi_rwt
                </a>
              </p>
            </div>
          </TabsContent>

          <TabsContent value="reply-times" className="space-y-3 md:space-y-6">
            <ReplyTimeChart data={chatData.replyTimes} />
            <MessageLengthCard data={messageLengthStats} participants={chatData.participants} />

            {/* Footer */}
            <div className="text-center py-6 text-sm">
              <p className="text-gray-600 dark:text-gray-400">
                Made with ❤️ by{' '}
                <a href="https://www.instagram.com/abhi_rawat_uk1" target="_blank" rel="noopener noreferrer" className="font-bold prism-text hover:underline transition-all duration-300">
                  Abhi_rwt
                </a>
              </p>
            </div>
          </TabsContent>

          <TabsContent value="emojis" className="space-y-3 md:space-y-6">
            <EmojiChart data={chatData.emojiFrequency} />
            <EmojiCompatibilityCard data={emojiCompatibility} participants={chatData.participants} />

            {/* Footer */}
            <div className="text-center py-6 text-sm">
              <p className="text-gray-600 dark:text-gray-400">
                Made with ❤️ by{' '}
                <a href="https://www.instagram.com/abhi_rawat_uk1" target="_blank" rel="noopener noreferrer" className="font-bold prism-text hover:underline transition-all duration-300">
                  Abhi_rwt
                </a>
              </p>
            </div>
          </TabsContent>

          <TabsContent value="words" className="space-y-3 md:space-y-6">
            <WordChart data={chatData.wordFrequency} />
            <TopWordsCard data={chatData.wordFrequency} participants={chatData.participants} />
            <ConversationStarterCard data={conversationStarters} participants={chatData.participants} />

            {/* Footer */}
            <div className="text-center py-6 text-sm">
              <p className="text-gray-600 dark:text-gray-400">
                Made with ❤️ by{' '}
                <a href="https://www.instagram.com/abhi_rawat_uk1" target="_blank" rel="noopener noreferrer" className="font-bold prism-text hover:underline transition-all duration-300">
                  Abhi_rwt
                </a>
              </p>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-3 md:space-y-6">
            <ActivityHeatmap data={chatData.hourlyActivity} />
            <PeakActivityCard data={peakActivity} participants={chatData.participants} />

            {/* Footer */}
            <div className="text-center py-6 text-sm">
              <p className="text-gray-600 dark:text-gray-400">
                Made with ❤️ by{' '}
                <a href="https://www.instagram.com/abhi_rawat_uk1" target="_blank" rel="noopener noreferrer" className="font-bold prism-text hover:underline transition-all duration-300">
                  Abhi_rwt
                </a>
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Mobile Menu - Fixed at top left corner */}
      <MobileMenu
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onReset={onReset}
      />
    </div>
  );
};

export default Dashboard;

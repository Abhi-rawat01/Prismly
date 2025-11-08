import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MessageCircle, Crown } from 'lucide-react';
import { ConversationStarter } from '@/utils/advancedAnalytics';

interface ConversationStarterCardProps {
    data: ConversationStarter;
    participants: string[];
}

export const ConversationStarterCard = ({ data, participants }: ConversationStarterCardProps) => {
    return (
        <Card className="glass-effect border-2">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2 text-blue-600" />
                    Conversation Starters
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {participants.map((person, idx) => {
                        const personData = data[person];
                        const isLeader = data.leader === person;
                        const colors = ['from-red-500 to-pink-500', 'from-blue-500 to-cyan-500'];

                        return (
                            <div key={person} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {person.split(' ')[0]}
                                        </span>
                                        {isLeader && (
                                            <Crown className="h-4 w-4 text-yellow-500" />
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <span className="text-lg font-bold prism-text">
                                            {personData.percentage.toFixed(0)}%
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                            ({personData.count} times)
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                    <div
                                        className={`bg-gradient-to-r ${colors[idx % 2]} h-3 rounded-full transition-all duration-500`}
                                        style={{ width: `${personData.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Total Conversations: <span className="font-bold prism-text">{data.totalConversations}</span>
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

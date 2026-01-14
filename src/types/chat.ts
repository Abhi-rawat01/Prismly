export interface Message {
  timestamp: Date;
  sender: string;
  message: string;
  replyTime?: number; // in minutes
}

export interface EmojiData {
  emoji: string;
  count: number;
  sender: string;
}

export interface WordData {
  word: string;
  count: number;
  sender: string;
}

export interface ReplyTimeData {
  messageIndex: number;
  replyTime: number;
  sender: string;
  message?: string;
  timestamp?: Date;
  previousMessage?: string;
  previousSender?: string;
  previousTimestamp?: Date;
}

export interface HourlyActivity {
  hour: number;
  count: number;
  sender: string;
}

export interface DailyEmojiData {
  date: string;
  [sender: string]: number;
}

export interface ChatData {
  messages: Message[];
  participants: string[];
  totalMessages: number;
  messageCountByUser: { [user: string]: number };
  wordCountByUser: { [user: string]: number };
  mediaCount: number;
  avgReplyTime: number;
  totalEmojis: number;
  messageRatio: number;
  consistencyRatio: number;
  replyTimes: ReplyTimeData[];
  emojiFrequency: EmojiData[];
  dailyEmojiData: DailyEmojiData[];
  wordFrequency: WordData[];
  hourlyActivity: HourlyActivity[];
  startDate: Date;
  endDate: Date;
}

export type RelationshipType = 'friend' | 'family' | 'romantic' | 'professional' | 'other';

export interface AppState {
  uploadedFile: File | null;
  relationshipType: RelationshipType | null;
  chatData: ChatData | null;
  isAnalyzing: boolean;
  error: string | null;
  showServerWakeUp: boolean;
  serverReady: boolean;
}

export interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isAnalyzing: boolean;
}

export interface DashboardProps {
  chatData: ChatData;
  relationshipType: RelationshipType;
  onReset: () => void;
}

export interface ServerWakeUpProps {
  onServerReady: () => void;
}

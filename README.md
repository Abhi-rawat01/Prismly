# 🌈 Prismly - WhatsApp Chat Analytics

> **Conversations refracted into colorful insights, like light through a prism.**

Prismly is a powerful WhatsApp chat analyzer that transforms your conversations into beautiful, meaningful insights. Whether it's romantic, friendship, family, or professional chats - discover hidden patterns, engagement metrics, and connection scores.

## ✨ Features

### 📊 Comprehensive Analytics
- **Connection Score**: Get a 0-100% rating based on messaging patterns, response times, and engagement
- **Message Distribution**: Visual breakdown of who sends more messages
- **Reply Time Analysis**: Track average response times and conversation flow
- **Emoji Analytics**: Discover emoji usage patterns and compatibility
- **Word Frequency**: See the most used words in your conversations
- **Activity Heatmap**: Visualize when you chat the most (hourly patterns)

### 🎯 Advanced Insights
- **Conversation Starters**: Find out who initiates conversations more often
- **Message Length Analysis**: Compare average message lengths between participants
- **Peak Activity Detection**: Identify your most active chatting times
- **Streak Tracking**: Discover your longest conversation streaks
- **Conversation Mathematics**: Unique mathematical patterns in your chats
- **Conversation Galaxy**: Space-themed visualization of your chat dynamics

### 💡 Relationship Types
Analyze any type of conversation:
- 💕 **Romantic** - For couples and romantic interests
- 👥 **Friend** - For friendships and casual relationships
- 👨‍👩‍👧 **Family** - For family conversations
- 💼 **Professional** - For work and business chats
- 💬 **Other** - For any other type of conversation

### 🎨 Beautiful UI
- Modern, responsive design with gradient effects
- Dark mode support
- Mobile-optimized interface
- Interactive charts and visualizations
- Smooth animations and transitions

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/prismly.git
cd prismly
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📱 How to Use

1. **Export Your WhatsApp Chat**
   - Open WhatsApp and go to the chat you want to analyze
   - Tap the three dots (⋮) → More → Export chat
   - Choose "Without Media" for faster processing
   - Save the `.txt` file

2. **Upload to Prismly**
   - Visit the Prismly website
   - Click "Upload Chat" and select your exported `.txt` file
   - Choose the relationship type
   - Wait for the analysis to complete

3. **Explore Your Insights**
   - Navigate through different tabs: Dashboard, Responsiveness, Engagement, Conversation, and Patterns
   - View your connection score and detailed analytics
   - Share insights with your chat partner!

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Components**: Radix UI + shadcn/ui
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Backend**: Express.js (for file processing)
- **Deployment**: Render

## 📊 Connection Score Calculation

The connection score is calculated based on multiple factors:
- ⚡ **Response Time** (up to +25 points): Faster replies indicate higher engagement
- 😊 **Emoji Usage** (up to +20 points): More emojis show emotional expression
- ⚖️ **Message Balance** (up to +15 points): Equal participation is ideal
- 📅 **Consistency** (up to +15 points): Regular chatting shows sustained interest

**Score Guide:**
- 90-100% 💖 Exceptional connection
- 75-89% 💕 Great chemistry
- 60-74% 💗 Good potential
- 40-59% 💛 Moderate engagement
- 0-39% 💔 Low engagement

## 🔒 Privacy & Security

- All chat analysis happens locally in your browser
- No chat data is stored on servers
- Your conversations remain completely private
- Files are processed temporarily and immediately discarded

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Created By

**ABHI_RAWT**  
📸 Instagram: [@abhi_rawat_uk1](https://www.instagram.com/abhi_rawat_uk1)

---

*Built with 💖 for analyzing the language of love and friendship*

**Note:** This is a fun analytical tool! Real relationships can't be fully captured by an algorithm. Use these insights as conversation starters, not absolute truths. 💝

# AI Chatbot Application

A modern, production-ready chatbot application built with React, TypeScript, and Supabase. Features real-time messaging, AI integration via OpenRouter, and secure authentication.

## Features

### 🔐 Authentication
- Email-based sign-up and sign-in with Supabase Auth
- Secure session management
- Email confirmation disabled by default

### 💬 Real-time Chat
- Create multiple chat conversations
- Real-time message updates via Supabase subscriptions
- Message history with timestamps
- Clean, modern chat interface

### 🤖 AI Integration
- AI-powered responses via OpenRouter API
- Uses Meta's Llama 3.2 3B Instruct (free tier)
- Secure API calls through Supabase Edge Functions
- Contextual AI responses

### 🔒 Security & Permissions
- Row-Level Security (RLS) on all database tables
- Users can only access their own chats and messages
- Authenticated API endpoints
- Secure credential handling

### 🎨 Modern UI/UX
- Responsive design for mobile and desktop
- Beautiful message bubbles with user/bot indicators
- Smooth animations and transitions
- Loading states and error handling

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database, Auth, Edge Functions)
- **AI**: OpenRouter API (Meta Llama 3.2 3B)
- **Real-time**: Supabase Realtime subscriptions
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite

## Getting Started

### Prerequisites

1. Create a [Supabase account](https://app.supabase.com)
2. Create a new Supabase project
3. Get an [OpenRouter API key](https://openrouter.ai) (free tier available)

### Setup Instructions

1. **Configure Supabase**
   - Click the "Connect to Supabase" button in the top right
   - Enter your Supabase project URL and anon key
   - The database schema will be automatically created

2. **Set up OpenRouter**
   - Go to your Supabase project dashboard
   - Navigate to Settings > Edge Functions > Environment Variables
   - Add: `OPENROUTER_API_KEY` with your OpenRouter API key

3. **Deploy Edge Function**
   - The chatbot Edge Function is already created in the project
   - It will be automatically deployed when you connect to Supabase

4. **Start Development**
   ```bash
   npm run dev
   ```

### Database Schema

The application uses two main tables:

**chats**
- Stores chat conversations
- Each chat belongs to a user
- Tracks creation and update timestamps

**messages** 
- Stores individual messages within chats
- Links to both chat and user
- Distinguishes between user and bot messages

Both tables have Row-Level Security enabled so users can only access their own data.

### Environment Variables

Required environment variables (automatically configured when connecting to Supabase):

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

Edge Function environment variables (set in Supabase dashboard):

- `OPENROUTER_API_KEY` - Your OpenRouter API key

## Architecture

### Authentication Flow
1. Users sign up/sign in with email and password
2. Supabase Auth handles session management
3. All API calls include authentication headers

### Chat Flow
1. Users create new chats or select existing ones
2. Messages are sent and stored in the database
3. Edge Function processes user messages
4. AI response is generated via OpenRouter
5. Bot response is saved and displayed
6. Real-time updates via Supabase subscriptions

### Security Model
- All data access is restricted by user ID
- Edge Functions validate chat ownership
- RLS policies prevent unauthorized access
- API keys are securely stored server-side

## Deployment

This is a frontend-only application that can be deployed to:
- Netlify (recommended)
- Vercel
- Cloudflare Pages
- Any static hosting service

The backend (Supabase) is automatically managed and deployed.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
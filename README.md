b# TAD AI

This project is a chat interface powered by an Express backend and the OpenAI API.

## Features
- Modern AI chat UI
- Real OpenAI responses when API key is configured
- Fallback guidance when API key is missing
- Clean static frontend served by Express

## Setup

1. Install dependencies:
   npm install

2. Create your environment file:
   cp .env.example .env

3. Add your OpenAI API key to `.env`:
   OPENAI_API_KEY=your_key_here

4. Start the app:
   npm start

5. Open in browser:
   http://localhost:3000

## Notes
- The app automatically uses `gpt-4o-mini` by default.
- If you do not add an API key, the app will return a helpful message instead of failing.

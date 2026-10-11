const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const OpenAI = require('openai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TAD AI backend is running.' });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body || {};

    if (!message || !String(message).trim()) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.json({
        reply: 'OpenAI API key is not configured yet. Create a .env file from .env.example and add OPENAI_API_KEY to enable real AI responses.'
      });
    }

    const openai = new OpenAI({ apiKey });

    const messages = [
      ...history.map((item) => ({
        role: item.role === 'user' ? 'user' : 'assistant',
        content: String(item.content || '')
      })),
      { role: 'user', content: String(message) }
    ];

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 800
    });

    const reply = completion.choices?.[0]?.message?.content || 'I could not generate a response.';

    return res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);

    const message = error?.response?.data?.error?.message || error.message || 'Something went wrong while generating a reply.';

    return res.status(500).json({
      error: message
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`TAD AI server running on http://localhost:${PORT}`);
});

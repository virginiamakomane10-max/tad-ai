const chat = document.getElementById('chat');
const promptInput = document.getElementById('prompt');
const sendButton = document.getElementById('send');

let chatHistory = [];

function appendMessage(role, text) {
  const message = document.createElement('div');
  message.className = `message ${role}`;
  message.textContent = role === 'user' ? `You: ${text}` : `TAD AI: ${text}`;
  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
}

function setLoading(isLoading) {
  sendButton.disabled = isLoading;
  sendButton.textContent = isLoading ? 'Thinking...' : 'Send ↑';
  promptInput.disabled = isLoading;
}

async function sendMessage() {
  const question = promptInput.value.trim();

  if (!question) return;

  document.getElementById('welcome')?.remove();
  appendMessage('user', question);
  chatHistory.push({ role: 'user', content: question });
  promptInput.value = '';
  setLoading(true);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: question,
        history: chatHistory
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    const aiReply = data.reply || 'No response was returned.';
    appendMessage('ai', aiReply);
    chatHistory.push({ role: 'assistant', content: aiReply });
  } catch (error) {
    appendMessage('ai', `Error: ${error.message}`);
  } finally {
    setLoading(false);
    promptInput.focus();
  }
}

function newChat() {
  chat.innerHTML = `
    <div class="welcome" id="welcome">
      <h1>What can I help with?</h1>
      <p>Welcome to your own AI assistant.</p>
    </div>
  `;
  chatHistory = [];
  promptInput.focus();
}

sendButton.addEventListener('click', sendMessage);

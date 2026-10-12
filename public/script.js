const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const submitBtn = form.querySelector('button[type="submit"]');

// Store conversation history in memory for multi-turn chat
const conversation = [];

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  // 1. Add user message to UI and conversation state
  appendMessage('user', userMessage);
  conversation.push({ role: 'user', text: userMessage });

  // Clear and disable input during request
  input.value = '';
  input.disabled = true;
  if (submitBtn) submitBtn.disabled = true;

  // 2. Show temporary "Thinking..." bot message
  const botMessageElement = appendMessage('bot', 'Thinking...');

  try {
    // 3. Send entire conversation history to /api/chat
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conversation }),
    });

    if (!response.ok) {
      const errPayload = await response.json().catch(() => null);
      let errMsg = errPayload?.message || 'Failed to get response from server.';

      // Extract nested message if returned as JSON string
      try {
        const parsed = JSON.parse(errMsg);
        if (parsed?.error?.message) {
          errMsg = parsed.error.message;
        }
      } catch (_) {}

      throw new Error(errMsg);
    }

    const data = await response.json();

    // 4. Replace "Thinking..." with AI response
    if (data && data.result) {
      botMessageElement.textContent = data.result;
      conversation.push({ role: 'model', text: data.result });
    } else {
      botMessageElement.textContent = 'Sorry, no response received.';
      conversation.pop(); // Revert user message if no response
    }
  } catch (error) {
    console.error('Error fetching chat response:', error);
    botMessageElement.textContent = error.message || 'Failed to get response from server.';
    conversation.pop(); // Revert user message so retry is consistent
  } finally {
    // Re-enable input and refocus
    input.disabled = false;
    if (submitBtn) submitBtn.disabled = false;
    input.focus();
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}

const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const submitBtn = document.getElementById('send-button') || form.querySelector('button[type="submit"]');
const resetChatBtn = document.getElementById('reset-chat-btn');

// Menyimpan histori percakapan multi-turn sesuai spesifikasi API
let conversation = [];

// Template sambutan awal dari Aruna
const welcomeMessageHTML = `
  <div class="message bot welcome-message">
    <div class="msg-avatar">🌺</div>
    <div class="msg-bubble">
      <p><strong>Sampurasun / Tabik Pun / Salam Hangat!</strong> 🙏</p>
      <p>Saya <strong>Aruna</strong>, sahabat virtual perjalananmu. Ingin mencari destinasi eksotis, kuliner khas, atau menyusun itinerary liburan di Indonesia hari ini?</p>
    </div>
  </div>
`;

// Helper untuk format teks markdown dasar (bold, italic, list, paragraph)
function formatMarkdown(text) {
  if (!text) return '';

  // Escape HTML dasar untuk keamanan
  let escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bolding **teks**
  escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Italic *teks*
  escaped = escaped.replace(/(^|[^*])\*(?!\*)(.*?)\*/g, '$1<em>$2</em>');

  // Mengubah baris menjadi paragraf & list
  const lines = escaped.split('\n');
  let inList = false;
  let listType = 'ul';
  let result = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      if (inList) {
        result += `</${listType}>`;
        inList = false;
      }
      continue;
    }

    // Bullet list: * atau -
    if (line.startsWith('* ') || line.startsWith('- ')) {
      if (!inList || listType !== 'ul') {
        if (inList) result += `</${listType}>`;
        result += '<ul>';
        inList = true;
        listType = 'ul';
      }
      result += `<li>${line.substring(2)}</li>`;
    } 
    // Numbered list: 1. 2. dst
    else if (/^\d+\.\s/.test(line)) {
      if (!inList || listType !== 'ol') {
        if (inList) result += `</${listType}>`;
        result += '<ol>';
        inList = true;
        listType = 'ol';
      }
      result += `<li>${line.replace(/^\d+\.\s/, '')}</li>`;
    } 
    // Paragraf biasa
    else {
      if (inList) {
        result += `</${listType}>`;
        inList = false;
      }
      result += `<p>${line}</p>`;
    }
  }

  if (inList) {
    result += `</${listType}>`;
  }

  return result || `<p>${escaped}</p>`;
}

// Menambahkan elemen pesan ke chat-box
function appendMessage(sender, text, isThinking = false) {
  const msgWrapper = document.createElement('div');
  msgWrapper.classList.add('message', sender);

  if (sender === 'bot') {
    const avatar = document.createElement('div');
    avatar.classList.add('msg-avatar');
    avatar.textContent = '🌺';
    msgWrapper.appendChild(avatar);
  }

  const bubble = document.createElement('div');
  bubble.classList.add('msg-bubble');

  if (isThinking) {
    bubble.innerHTML = `
      <div class="typing-indicator" aria-label="Aruna sedang berpikir...">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
  } else if (sender === 'bot') {
    bubble.innerHTML = formatMarkdown(text);
  } else {
    const p = document.createElement('p');
    p.textContent = text;
    bubble.appendChild(p);
  }

  msgWrapper.appendChild(bubble);
  chatBox.appendChild(msgWrapper);
  chatBox.scrollTop = chatBox.scrollHeight;

  // Kembalikan objek referensi bubble agar teks bisa diubah nantinya
  return {
    element: msgWrapper,
    bubble: bubble,
    updateContent: function (newText, isMarkdown = true) {
      if (isMarkdown) {
        bubble.innerHTML = formatMarkdown(newText);
      } else {
        bubble.textContent = newText;
      }
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  };
}

// Fungsi utama pengiriman pesan ke API
async function handleSendMessage(userMessage) {
  if (!userMessage || !userMessage.trim()) return;
  const cleanMessage = userMessage.trim();

  // 1. Tampilkan pesan user di chat box dan tambahkan ke conversation
  appendMessage('user', cleanMessage);
  conversation.push({ role: 'user', text: cleanMessage });

  // Kosongkan dan nonaktifkan input selama request
  input.value = '';
  input.disabled = true;
  if (submitBtn) submitBtn.disabled = true;

  // 2. Tampilkan status sementara "Thinking..." dengan animasi dot
  const botMessageObj = appendMessage('bot', '', true);

  try {
    // 3. Kirim POST request ke /api/chat sesuai spesifikasi
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conversation }),
    });

    if (!response.ok) {
      const errPayload = await response.json().catch(() => null);
      let errMsg = errPayload?.message || 'Gagal terhubung dengan server.';

      // Ekstrak pesan error tersembunyi jika format JSON string dari SDK
      try {
        const parsed = JSON.parse(errMsg);
        if (parsed?.error?.message) {
          errMsg = parsed.error.message;
        }
      } catch (_) {}

      throw new Error(errMsg);
    }

    const data = await response.json();

    // 4. Perbarui isi pesan bot dengan jawaban AI
    if (data && data.result) {
      botMessageObj.updateContent(data.result, true);
      conversation.push({ role: 'model', text: data.result });
    } else {
      botMessageObj.updateContent('Maaf, belum ada tanggapan yang diterima dari pemandu AI.', false);
      conversation.pop(); // Tarik kembali turn user terakhir
    }
  } catch (error) {
    console.error('Error fetching chat response:', error);
    const friendlyError = error.message || 'Gagal memuat jawaban dari server. Silakan coba lagi.';
    botMessageObj.updateContent(`⚠️ ${friendlyError}`, false);
    conversation.pop(); // Tarik kembali turn user agar histori tetap sinkron
  } finally {
    // Aktifkan kembali input dan fokuskan kursor
    input.disabled = false;
    if (submitBtn) submitBtn.disabled = false;
    input.focus();
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

// Event Listener Submit Form Chat
form.addEventListener('submit', function (e) {
  e.preventDefault();
  handleSendMessage(input.value);
});

// Event Listener Tombol Reset Chat
if (resetChatBtn) {
  resetChatBtn.addEventListener('click', function () {
    conversation = [];
    chatBox.innerHTML = welcomeMessageHTML;
    input.value = '';
    input.disabled = false;
    if (submitBtn) submitBtn.disabled = false;
    input.focus();
  });
}

// Event Delegation untuk Quick Chips, Kartu Destinasi, dan Footer Links
document.addEventListener('click', function (e) {
  // 1. Quick Prompts di Hero
  const chip = e.target.closest('.quick-chip');
  if (chip && chip.dataset.prompt) {
    e.preventDefault();
    handleSendMessage(chip.dataset.prompt);
    return;
  }

  // 2. Tombol "Tanya tentang destinasi ini" di Kartu Destinasi
  const destBtn = e.target.closest('.btn-ask-destination');
  if (destBtn && destBtn.dataset.prompt) {
    e.preventDefault();
    const chatSection = document.getElementById('chat-section');
    if (chatSection) {
      chatSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    handleSendMessage(destBtn.dataset.prompt);
    return;
  }

  // 3. Link Prompt di Footer
  const footerLink = e.target.closest('.footer-prompt-link');
  if (footerLink && footerLink.dataset.prompt) {
    e.preventDefault();
    const chatSection = document.getElementById('chat-section');
    if (chatSection) {
      chatSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    handleSendMessage(footerLink.dataset.prompt);
  }
});

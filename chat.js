// Ensure Pusher script is included in HTML: <script src="https://js.pusher.com/8.0/pusher.min.js"></script>

// Show Pusher logs in console
if (window.Pusher) {
  Pusher.logToConsole = true;
} else {
  console.error('[CLIENT] Pusher lib not loaded. Check that you included https://js.pusher.com/8.0/pusher.min.js in index.html');
}

// ====== Pusher Setup ======
const pusher = new Pusher('b7d05dcc13df522efbbc', { cluster: 'us2' });
const channelName = 'Veilian-CHAT-Z8';
console.log('[CLIENT] subscribing to channel:', channelName);
const channel = pusher.subscribe(channelName);

channel.bind('new-message', function(data) {
  console.log('[CLIENT] received new-message', data);
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) { console.error('[CLIENT] #chatMessages not found'); return; }

  const msgDiv = document.createElement('div');
  msgDiv.classList.add('chat-message');
  msgDiv.textContent = `${data.displayName}: ${data.message}`;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// ===== Open/Close & UI elements =====
const chatBox = document.getElementById('chatBox');
const chatInput = document.getElementById('chatInput');
const displayNameInput = document.getElementById('displayName');
const sendBtn = document.getElementById('sendBtn');

if (!sendBtn || !chatInput || !displayNameInput) {
  console.error('[CLIENT] Missing required DOM elements: sendBtn/chatInput/displayName');
}

// Toggle open/close by dblclick
let chatOpen = true;
if (chatBox) {
  chatBox.addEventListener('dblclick', () => {
    chatOpen = !chatOpen;
    const messagesDiv = document.getElementById('chatMessages');
    const inputWrapper = document.getElementById('chatInputWrapper');
    messagesDiv.style.display = chatOpen ? 'block' : 'none';
    inputWrapper.style.display = chatOpen ? 'flex' : 'none';
    console.log('[CLIENT] chatOpen set to', chatOpen);
  });
}

// ===== Send Messages =====
function sendMessage() {
  const name = (displayNameInput && displayNameInput.value.trim()) || 'Anon';
  const message = chatInput && chatInput.value.trim();
  if (!message) {
    console.log('[CLIENT] no message to send');
    return;
  }

  console.log('[CLIENT] sending message to backend:', { name, message });

  fetch('http://localhost:5000/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ displayName: name, message })
  })
  .then(res => res.text())
  .then(t => {
    console.log('[CLIENT] backend response:', t);
    // optionally optimistically append local message here (but rely on Pusher for canonical display)
    chatInput.value = '';
  })
  .catch(err => {
    console.error('[CLIENT] fetch error:', err);
  });
}

if (sendBtn) sendBtn.addEventListener('click', sendMessage);
if (chatInput) chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });

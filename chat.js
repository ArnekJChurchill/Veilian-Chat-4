// ===== Pusher Setup =====
const pusher = new Pusher('b7d05dcc13df522efbbc', {
  cluster: 'us2'
});

const channel = pusher.subscribe('veilian-chat');

// ===== Open/Close Chat Box =====
const chatBox = document.getElementById('chatBox');
let chatOpen = true;

chatBox.addEventListener('dblclick', () => {
  chatOpen = !chatOpen;
  const messagesDiv = document.getElementById('chatMessages');
  const inputWrapper = document.getElementById('chatInputWrapper');
  if (chatOpen) {
    messagesDiv.style.display = 'block';
    inputWrapper.style.display = 'flex';
  } else {
    messagesDiv.style.display = 'none';
    inputWrapper.style.display = 'none';
  }
});

// ===== Receive Messages =====
channel.bind('new-message', function(data) {
  if (!chatOpen) return; // only show if chat is open

  const chatMessages = document.getElementById('chatMessages');
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('chat-message');
  msgDiv.textContent = `${data.displayName}: ${data.message}`;
  chatMessages.appendChild(msgDiv);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// ===== Send Messages =====
const sendBtn = document.getElementById('sendBtn');
const chatInput = document.getElementById('chatInput');

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const displayName = document.getElementById('displayName').value.trim() || 'Anon';
  const message = chatInput.value.trim();
  if (!message) return;

  // Send to backend
  fetch('http://localhost:5000/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ displayName, message })
  });

  chatInput.value = '';
}


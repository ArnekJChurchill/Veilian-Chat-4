const chatMessages = document.getElementById('chatMessages');
const sendBtn = document.getElementById('sendBtn');

sendBtn.addEventListener('click', () => {
  const name = document.getElementById('displayName').value.trim() || 'Anon';
  const message = document.getElementById('chatInput').value.trim();
  
  if (!message) return; // don't send empty messages

  const messageElement = document.createElement('div');
  messageElement.textContent = `${name}: ${message}`;
  chatMessages.appendChild(messageElement);

  document.getElementById('chatInput').value = ''; // clear input
  chatMessages.scrollTop = chatMessages.scrollHeight; // scroll to bottom
});

// Optional: press Enter to send
document.getElementById('chatInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendBtn.click();
});
// ====== Pusher Setup ======
const pusher = new Pusher('b7d05dcc13df522efbbc', {
  cluster: 'us2'
});

const channel = pusher.subscribe('veilian-chat');

// Listen for new messages
channel.bind('new-message', function(data) {
  const chatMessages = document.getElementById('chatMessages');
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('chat-message');
  msgDiv.textContent = `${data.displayName}: ${data.message}`;
  chatMessages.appendChild(msgDiv);

  // Auto-scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// ====== Sending Messages ======
const sendBtn = document.getElementById('sendBtn');
sendBtn.addEventListener('click', () => {
  const displayName = document.getElementById('displayName').value.trim();
  const message = document.getElementById('chatInput').value.trim();
  if (!displayName || !message) return;

  // Send message to backend
  fetch('http://localhost:5000/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ displayName, message })
  });

  document.getElementById('chatInput').value = '';
});

// Optional: Send message on Enter key
document.getElementById('chatInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendBtn.click();
});
// ===== Pusher Setup =====
const pusher = new Pusher('b7d05dcc13df522efbbc', {
  cluster: 'us2'
});

const channel = pusher.subscribe('veilian-chat');

// ===== Open/Close Chat Box =====
const chatBox = document.getElementById('chatBox');
let chatOpen = true;

// Optional: make the top of the chat box clickable to toggle
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

  // Auto-scroll
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// ===== Send Messages =====
const sendBtn = document.getElementById('sendBtn');
sendBtn.addEventListener('click', sendMessage);

document.getElementById('chatInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const displayName = document.getElementById('displayName').value.trim();
  const message = document.getElementById('chatInput').value.trim();
  if (!displayName || !message) return;

  fetch('http://localhost:5000/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ displayName, message })
  });

  document.getElementById('chatInput').value = '';
}

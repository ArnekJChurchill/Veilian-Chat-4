document.addEventListener('DOMContentLoaded', () => {
  const chatMessages = document.getElementById('chatMessages');
  const chatBox = document.getElementById('chatBox');
  const chatInput = document.getElementById('chatInput');
  const displayNameInput = document.getElementById('displayName');
  const sendBtn = document.getElementById('sendBtn');

  // Pusher
  const pusher = new Pusher('b7d05dcc13df522efbbc', { cluster: 'us2' });
  const channel = pusher.subscribe('Veilian-CHAT-Z8');

  channel.bind('new-message', data => {
    const msgDiv = document.createElement('div');
    msgDiv.textContent = `${data.displayName}: ${data.message}`;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });

  function sendMessage() {
    const name = (displayNameInput && displayNameInput.value.trim()) || 'Anon';
    const message = chatInput && chatInput.value.trim();
    if (!message) return;

    fetch('https://veilian-chat-4-backend.onrender.com/message', { // <-- deployed backend
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName: name, message })
    })
    .then(() => { chatInput.value = ''; })
    .catch(err => console.error(err));
  }

  if (sendBtn) sendBtn.addEventListener('click', sendMessage);
  if (chatInput) chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });

  let chatOpen = true;
  if (chatBox) {
    chatBox.addEventListener('dblclick', () => {
      chatOpen = !chatOpen;
      const inputWrapper = document.getElementById('chatInputWrapper');
      chatMessages.style.display = chatOpen ? 'block' : 'none';
      if (inputWrapper) inputWrapper.style.display = chatOpen ? 'flex' : 'none';
    });
  }
});


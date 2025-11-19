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

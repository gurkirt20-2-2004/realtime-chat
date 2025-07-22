const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const chatForm = document.getElementById('chat-form');

let ws;


function initWebSocket() {
    ws = new WebSocket('ws://localhost:5000');

    ws.onopen = () => {
        displayStatus(' Connected to chat server');
    };

    ws.onmessage = (event) => {
        displayMessage(event.data, false);
    };

    ws.onclose = () => {
        displayStatus(' Disconnected from chat server. Trying to reconnect...');
        setTimeout(initWebSocket, 2000); // Retry after 2s
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        displayStatus('⚠ Connection error');
    };
}


function displayMessage(message, isSelf) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    if (isSelf) {
        messageDiv.classList.add('self');
    }
    messageDiv.textContent = message;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll
}


function displayStatus(status) {
    const statusDiv = document.createElement('div');
    statusDiv.classList.add('status');
    statusDiv.textContent = status;
    chatBox.appendChild(statusDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage(message) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(message);
        displayMessage(message, true);
    } else {
        displayStatus('⚠ Cannot send message. Not connected.');
    }
}

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message !== '') {
        sendMessage(message);
        messageInput.value = '';
    }
});


initWebSocket();

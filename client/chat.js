const socket = io("http://localhost:5000");

// Elements
const authDiv = document.getElementById("auth");
const chatDiv = document.getElementById("chat");
const userIdInput = document.getElementById("userId");
const roomIdInput = document.getElementById("roomId");
const messageInput = document.getElementById("messageInput");
const messagesDiv = document.getElementById("messages");

let userId, roomId;

// Join chat room
function joinChat() {
  userId = userIdInput.value.trim();
  roomId = roomIdInput.value.trim();

  if (!userId || !roomId) {
    alert("Please enter both User ID and Room ID");
    return;
  }

  // Authenticate and join room
  socket.emit("authenticate", userId);
  socket.emit("joinRoom", roomId);

  // Switch UI
  authDiv.style.display = "none";
  chatDiv.style.display = "block";
}

// Send message
function sendMessage() {
  const content = messageInput.value.trim();
  if (content) {
    socket.emit("sendMessage", { roomId, userId, content });
    messageInput.value = "";
  }
}

// Receive messages
socket.on("newMessage", (msg) => {
  const messageEl = document.createElement("div");
  messageEl.className = "message";
  messageEl.innerHTML = `<span class="sender">${msg.sender}</span>: ${
    msg.content
  } <small>(${new Date(msg.createdAt).toLocaleTimeString()})</small>`;
  messagesDiv.appendChild(messageEl);
  messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll to bottom
});

// Handle errors
socket.on("error", (error) => {
  console.error("Socket error:", error);
  alert(error.message);
});

// Handle connection
socket.on("connect", () => {
  console.log("Connected to server");
});

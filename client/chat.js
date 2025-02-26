const socket = io("http://localhost:5000");

// Elements
const authDiv = document.getElementById("auth");
const chatDiv = document.getElementById("chat");
const userIdInput = document.getElementById("userId");
const roomIdInput = document.getElementById("roomId");
const messageInput = document.getElementById("messageInput");
const messagesDiv = document.getElementById("messages");

let userId, roomId;
const userMap = {};

// Fetch user full name by ID from backend port
async function getUserFullName(userId) {
  if (userMap[userId]) return userMap[userId];
  try {
    const response = await fetch(
      `http://localhost:5000/api/users/get-users/${userId}`,
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiVTJGc2RHVmtYMS9kcjliSmkvR0hFdE5oQXJrRUkvUlFrb09lMUhHMloyK2xsM3V4OTBTRzNFVGJORXRwOExJdU91VktQRWlmSzd5WXdSK0cwRWs0NDhqbHhadTB3Z0t2QS9IeUJ1VDZ5emZCUjVrd1NKYlJNSStCY0xqblNDckEiLCJpYXQiOjE3NDA1NzcyOTUsImV4cCI6MTc0MDU3ODE5NX0.99kVzyNhvJe4quIcxmDFbofkJ1QEH0XqPCb49EB5S_I",
        }, // Replace with real token
      }
    );
    const data = await response.json();
    if (data.metadata && data.metadata.status === "SUCCESS") {
      userMap[userId] =
        data.payload.data.fullName || data.payload.data.username;
      return userMap[userId];
    }
    console.error("User fetch failed:", data);
    return userId;
  } catch (error) {
    console.error("Error fetching user:", error);
    return userId;
  }
}

// Join chat room
function joinChat() {
  userId = userIdInput.value.trim();
  roomId = roomIdInput.value.trim();

  if (!userId || !roomId) {
    alert("Please enter both User ID and Room ID");
    return;
  }

  socket.emit("authenticate", userId);
  socket.emit("joinRoom", roomId);
  console.log(`Joining room ${roomId} as user ${userId}`);

  socket.once("roomJoined", async (data) => {
    console.log("Room joined:", data);
    authDiv.style.display = "none";
    chatDiv.style.display = "block";
    const fullName = await getUserFullName(userId);
    console.log(`Logged in as: ${fullName}`);
  });
}

// Send message
function sendMessage() {
  const content = messageInput.value.trim();
  if (content) {
    socket.emit("sendMessage", { roomId, userId, content });
    console.log(`Sent message: ${content} to room ${roomId}`);
    messageInput.value = "";
  }
}

// Receive messages
socket.on("newMessage", async (msg) => {
  const senderFullName = await getUserFullName(msg.sender);
  console.log("Received new message:", msg);
  const messageEl = document.createElement("div");
  messageEl.className = "message";
  messageEl.innerHTML = `<span class="sender">${senderFullName}</span>: ${msg.content} `;
  messagesDiv.appendChild(messageEl);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// Handle errors and connection
socket.on("error", (error) => console.error("Socket error:", error));
socket.on("connect", () =>
  console.log("Connected to server with socket ID:", socket.id)
);

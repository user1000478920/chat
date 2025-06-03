let socket = new WebSocket(`ws://${location.hostname}:8080`);
let chatBox = document.getElementById("chat-box");
let inputBox = document.getElementById("input-box");
let addressBar = document.getElementById("address-bar");

addressBar.textContent = `Connected to: ${location.hostname}`;

inputBox.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    let message = inputBox.value;
    socket.send(message);
    inputBox.value = "";
  }
});

socket.onmessage = function (event) {
  let data = JSON.parse(event.data);
  let msgElement = document.createElement("div");

  // Alternate colors based on sender IP
  msgElement.className = data.color === "black" ? "message-black" : "message-gray";

  // Prevent scripts but allow formatting (via <noscript>)
  let content = document.createElement("noscript");
  content.innerHTML = `<b>${data.ip}:</b> ${data.message}`;
  msgElement.innerHTML = content.textContent; // Sanitize with noscript

  // Re-apply formatting (excluding scripts)
  msgElement.innerHTML = `<b>${data.ip}:</b> ${data.message.replace(/<script.*?>.*?<\/script>/gi, '')}`;

  chatBox.appendChild(msgElement);
  chatBox.scrollTop = chatBox.scrollHeight;
};
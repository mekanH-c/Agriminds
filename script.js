function openPanel(panelId) {
  let container = document.getElementById("panelContainer");
  container.style.display = "block";
  setTimeout(() => container.classList.add("active"), 10);

  document.querySelectorAll(".panel-content").forEach(p => {
    p.classList.remove("active");
  });

  document.getElementById(panelId).classList.add("active");
}

function closePanel() {
  let container = document.getElementById("panelContainer");
  container.classList.remove("active");
  setTimeout(() => container.style.display = "none", 300);
}

/* CHAT FUNCTION */
function sendMessage() {
  let input = document.getElementById("chatInput");
  let chatBox = document.getElementById("chatBox");

  if (input.value.trim() === "") return;

  let userMsg = document.createElement("div");
  userMsg.className = "user-msg";
  userMsg.innerText = input.value;
  chatBox.appendChild(userMsg);

  let botMsg = document.createElement("div");
  botMsg.className = "bot-msg";
  botMsg.innerText = "Analyzing your plant query... 🌱";
  chatBox.appendChild(botMsg);

  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
}
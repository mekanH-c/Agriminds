/* ================= LOAD ON START ================= */
window.onload = function () {
  displayPlants();
};


/* ================= MODAL SYSTEM ================= */
function showSection(type) {
  const modal = document.getElementById("popupModal");
  const body = document.getElementById("modalBody");

  if (!modal || !body) {
    console.error("Modal or modalBody missing!");
    return;
  }

  let content = "";

  if (type === "add") {
    content = `
      <h2>Add Plant</h2>
      <input id="plantName" type="text" placeholder="Plant Name">
      <input id="plantType" type="text" placeholder="Plant Type">
      <input id="plantCity" type="text" placeholder="City">
      <button onclick="addPlant()">Add Plant</button>
      <p id="plantList"></p>
    `;
  }

  else if (type === "diagnose") {
    content = `
      <h2>Diagnose Plant</h2>
      <input type="text" placeholder="Plant Name">
      <input type="file">
      <button>Upload</button>
    `;
  }

  else if (type === "recommend") {
  content = `
    <h2>🌾 Crop Recommendations</h2>

    <label>City</label>
    <input id="recCity" type="text" placeholder="e.g. Delhi">

    <label>Soil Type</label>
    <select id="soilType">
      <option value="">Select Soil Type</option>
      <option value="loamy">Loamy</option>
      <option value="clay">Clay</option>
      <option value="sandy">Sandy</option>
      <option value="black">Black Soil</option>
      <option value="red">Red Soil</option>
    </select>

    <button onclick="getRecommendation()">Get Crops</button>

    <p id="resultBox" style="margin-top:15px;"></p>
  `;
}

  body.innerHTML = content;
  modal.classList.add("active");

  // reload plant list if opening add section
  if (type === "add") displayPlants();
}

function closeModal() {
  document.getElementById("popupModal").classList.remove("active");
}

// close when clicking outside
window.onclick = function (e) {
  const modal = document.getElementById("popupModal");
  if (e.target === modal) {
    modal.classList.remove("active");
  }
};


/* ================= ADD PLANT (LOCAL STORAGE) ================= */
function addPlant() {
  const name = document.getElementById('plantName').value;
  const type = document.getElementById('plantType').value;
  const city = document.getElementById('plantCity').value;

  if (!name || !type || !city) {
    alert("Please fill all fields!");
    return;
  }

  let plants = JSON.parse(localStorage.getItem("plants")) || [];

  plants.push({ name, type, city });

  localStorage.setItem("plants", JSON.stringify(plants));

  displayPlants();
  clearInputs();
}

function getRecommendation() {
  const city = document.getElementById("recCity").value.toLowerCase();
  const soil = document.getElementById("soilType").value;
  const resultBox = document.getElementById("resultBox");

  if (!city || !soil) {
    resultBox.innerHTML = "⚠️ Please fill all fields!";
    return;
  }

  let crops = "";

  // 🌱 Simple logic (you can upgrade later)
  if (soil === "loamy") {
    crops = "Wheat, Sugarcane, Cotton";
  } else if (soil === "clay") {
    crops = "Rice, Broccoli";
  } else if (soil === "sandy") {
    crops = "Carrots, Peanuts, Watermelon";
  } else if (soil === "black") {
    crops = "Cotton, Soybean";
  } else if (soil === "red") {
    crops = "Millets, Pulses";
  }

  resultBox.innerHTML = `🌾 Recommended crops for <b>${city}</b> (${soil} soil): <br> ${crops}`;
}

function displayPlants() {
  const list = document.getElementById("plantList");
  const plants = JSON.parse(localStorage.getItem("plants")) || [];

  if (!list) return;

  if (plants.length === 0) {
    list.innerHTML = "No plants added yet.";
    return;
  }

  list.innerHTML = plants.map(p =>
    `🌱 ${p.name} (${p.type}) - ${p.city}`
  ).join("<br>");
}

function clearInputs() {
  const name = document.getElementById('plantName');
  const type = document.getElementById('plantType');
  const city = document.getElementById('plantCity');

  if (name) name.value = "";
  if (type) type.value = "";
  if (city) city.value = "";
}


/* ================= AI POPUP (FLOAT BUTTON) ================= */
function toggleAI() {
  const popup = document.getElementById("aiPopup");
  if (popup) popup.classList.toggle("active");
}


/* ================= CHAT SYSTEM ================= */
async function sendMessage() {
  let input = document.getElementById("chatInput");
  let chatBox = document.getElementById("chatBox");

  if (!input || !chatBox) return;

  let message = input.value.trim();
  if (message === "") return;

  // USER MESSAGE
  let userMsg = document.createElement("div");
  userMsg.innerText = "🧑 " + message;
  chatBox.appendChild(userMsg);

  input.value = "";

  // BOT LOADING
  let botMsg = document.createElement("div");
  botMsg.innerText = "🌱 Thinking...";
  chatBox.appendChild(botMsg);

  chatBox.scrollTop = chatBox.scrollHeight;

  await new Promise(resolve => setTimeout(resolve, 800));

  let reply = getSmartReply(message);

  botMsg.innerText = "🤖 " + reply;
  chatBox.scrollTop = chatBox.scrollHeight;
}


/* ================= SMART AI ================= */
function getSmartReply(msg) {
  msg = msg.toLowerCase();

  if (msg.includes("tomato")) {
    return "Tomatoes need 6-8 hours of sunlight and well-drained soil.";
  }

  if (msg.includes("water")) {
    return "Water when top soil feels dry. Avoid overwatering.";
  }

  if (msg.includes("fertilizer")) {
    return "Use compost or NPK every 2-3 weeks.";
  }

  if (msg.includes("disease")) {
    return "Use neem oil for fungal infections.";
  }

  if (msg.includes("sunlight")) {
    return "Most plants need 4-8 hours sunlight.";
  }

  return "Ask me about plants, watering, sunlight, or diseases 🌱";
}


/* ================= ENTER KEY SUPPORT ================= */
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
});
let langPopup = document.getElementById('langPopup');

function toggleLang() {
  langPopup.classList.toggle('active');
}

function setLang(lang) {
  document.documentElement.lang = lang;
  localStorage.setItem('lang', lang);
  langPopup.classList.remove('active');
  // Close AI popup if open
  document.getElementById('aiPopup')?.classList.remove('active');
}

// Close on outside click
document.addEventListener('click', (e) => {
  if (!e.target.closest('.lang-toggle') && !e.target.closest('.lang-popup')) {
    langPopup.classList.remove('active');
  }
});

// Load saved language
document.documentElement.lang = localStorage.getItem('lang') || 'en';
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

    <!-- Soil Type -->
    <label>🌱 Soil Type (India)</label>
    <select id="soilType">
      <option value="">--- Select Soil Type ---</option>
      <option value="alluvial">Alluvial Soil (Punjab, UP, Bihar)</option>
      <option value="black">Black Soil (Maharashtra, MP, Gujarat)</option>
      <option value="red">Red Soil (Tamil Nadu, Karnataka)</option>
      <option value="laterite">Laterite Soil (Kerala, Odisha)</option>
      <option value="desert">Desert Soil (Rajasthan)</option>
      <option value="mountain">Mountain Soil (Himalayas)</option>
      <option value="peaty">Peaty Soil (Kerala, Odisha deltas)</option>
      <option value="saline">Saline Soil (Gujarat, UP)</option>
      <option value="alkaline">Alkaline Soil (Haryana, Punjab)</option>
      <option value="forest-loamy">Forest Loamy Soil (NE India)</option>
      <option value="coastal-sandy">Coastal Sandy Soil (Tamil Nadu)</option>
      <option value="deltaic">Deltaic Alluvial (Sundarbans)</option>
    </select>
    
    <!-- Soil Quality -->
    <label>🌿 Soil Nutrient Analysis</label>
    <select id="recSoilNutrient">
      <option value="">--- Select Nutrient Analysis  ---</option>
      <option value="nitrogen">Nitrogen-rich</option>
      <option value="phosphorus">Phosphorus-rich</option>
      <option value="potassium">Potassium-rich</option>
      <option value="balanced">Balanced</option>
    </select>

    

    <button onclick="getRecommendation()">Get Recommendation</button>

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
function showContent(type) {
  let content = "";

  if (type === "recommend") {
    content = `
      <h2>🌾 Crop Recommendations</h2>

      <!-- Soil Type -->
      <label>🌱 Soil Type (India)</label>
      <select id="soilType">
        <option value="">--- Select Soil Type ---</option>
        <option value="alluvial">🌾 Alluvial Soil (Punjab, UP, Bihar)</option>
        <option value="black">🖤 Black Soil (Maharashtra, MP, Gujarat)</option>
        <option value="red">🟥 Red Soil (Tamil Nadu, Karnataka)</option>
        <option value="laterite">🟫 Laterite Soil (Kerala, Odisha)</option>
        <option value="desert">🏜️ Desert Soil (Rajasthan)</option>
        <option value="mountain">⛰️ Mountain Soil (Himalayas)</option>
        <option value="peaty">🟫 Peaty Soil (Kerala, Odisha deltas)</option>
        <option value="saline">💧 Saline Soil (Gujarat, UP)</option>
        <option value="alkaline">⚪ Alkaline Soil (Haryana, Punjab)</option>
        <option value="forest-loamy">🌳 Forest Loamy Soil (NE India)</option>
        <option value="coastal-sandy">🏖️ Coastal Sandy Soil (Tamil Nadu)</option>
        <option value="deltaic">🌊 Deltaic Alluvial (Sundarbans)</option>
      </select>

      <!-- Soil Nutrient Analysis -->
      <label>🌿 Soil Nutrient Analysis</label>
      <select id="recSoilNutrient">
        <option value="">--- Select Soil Quality ---</option>
        <option value="nitrogen">💪 Nitrogen-rich</option>
        <option value="phosphorus">⚡ Phosphorus-rich</option>
        <option value="potassium">🔥 Potassium-rich</option>
        <option value="balanced">✅ Balanced</option>
      </select>

      

      <button onclick="getRecommendation()">Get Recommendation</button>

      <p id="resultBox" style="margin-top:15px;"></p>
    `;
  }

  document.getElementById("recommend").innerHTML = content;
}

function getRecommendation() {
  const soilType = document.getElementById("soilType").value;
  const soilQuality = document.getElementById("recSoilNutrient").value;

  const resultBox = document.getElementById("resultBox");

  if (!soilType || !soilNutrient) {
    resultBox.innerHTML = "⚠️ Please fill all fields!";
    return;
  }

  let crops = "";

  switch (soilType) {
    case "alluvial":
      crops = "Rice, Wheat, Sugarcane — fertile, well-drained soil";
      break;
    case "black":
      crops = "Cotton, Soybean, Sunflower — retains moisture, rich in clay";
      break;
    case "red":
      crops = "Millets, Pulses, Groundnut — acidic, moderate fertility";
      break;
    case "laterite":
      crops = "Cashew, Coffee, Tea — rich in iron and aluminum";
      break;
    case "desert":
      crops = "Millets, Barley — low moisture, requires irrigation";
      break;
    case "mountain":
      crops = "Potatoes, Apple, Tea — sloped terrain, drainage important";
      break;
    case "peaty":
      crops = "Rice, Oil Palm — high organic matter, acidic soil";
      break;
    case "saline":
      crops = "Barley, Cotton — tolerant crops, needs salt management";
      break;
    case "alkaline":
      crops = "Wheat, Mustard — requires proper pH adjustment";
      break;
    case "forest-loamy":
      crops = "Spices, Vegetables — nutrient-rich, good organic content";
      break;
    case "coastal-sandy":
      crops = "Coconut, Cashew — drains quickly, requires irrigation";
      break;
    case "deltaic":
      crops = "Rice, Fish Farming — nutrient-rich, waterlogged tolerant";
      break;
    default:
      crops = "No recommendation available";
  }

  resultBox.innerHTML = `
    🌾 Recommended crops for <b>${soilType}</b> soil 
    (${soilNutrient}): <br> ${crops}
  `;
}

// Initialize
showContent("recommend");


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

/* ================= AI CHATBOT ================= */
// Send message when send button clicked
document.querySelector('.send-btn').addEventListener('click', sendMessage);

// Send message on Enter key
document.getElementById('chatInput').addEventListener('keypress', function(e){
  if(e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const input = document.getElementById('chatInput');
  const chatBox = document.getElementById('chatBox');
  const message = input.value.trim();
  if(!message) return;

  // User message
  const userMsg = document.createElement('div');
  userMsg.textContent = "🧑 " + message;
  chatBox.appendChild(userMsg);

  // Bot response
  const botMsg = document.createElement('div');
  botMsg.textContent = "🤖 " + getSmartReply(message);
  chatBox.appendChild(botMsg);

  // Scroll down
  chatBox.scrollTop = chatBox.scrollHeight;

  // Clear input
  input.value = "";
}

// Example AI response logic
function getSmartReply(msg) {
  msg = msg.toLowerCase();
  if(msg.includes("tomato")) return "Tomatoes need 6-8 hours of sunlight and well-drained soil.";
  if(msg.includes("water")) return "Water when top soil feels dry. Avoid overwatering.";
  if(msg.includes("fertilizer")) return "Use compost or NPK every 2-3 weeks.";
  return "I am here to help! Ask me about your plants or soil.";
}

// Load saved language
document.documentElement.lang = localStorage.getItem('lang') || 'en';
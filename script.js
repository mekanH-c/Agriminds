/* ================= LOAD ON START ================= */
window.onload = function () {
  displayPlants();
};

/* ================= MODAL SYSTEM ================= */
function showSection(type) {
  const modal = document.getElementById("popupModal");
  const body = document.getElementById("modalBody");

  if (!modal || !body) {
    console.error("Modal missing!");
    return;
  }

  let content = "";

  // ================= ADD PLANT =================
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

  // ================= DIAGNOSE =================
  else if (type === "diagnose") {
    content = `
      <h2>Diagnose Plant</h2>
      <input type="text" placeholder="Plant Name">
      <input type="file">
      <button>Upload</button>
    `;
  }

  // ================= RECOMMEND =================
  else if (type === "recommend") {
    content = `
      <h2>🌾 Crop Recommendations</h2>

      <label>🌱 Soil Type (India)</label>
      <select id="soilType">
        <option value="">--- Select Soil Type ---</option>
        <option value="alluvial">Alluvial Soil</option>
        <option value="black">Black Soil</option>
        <option value="red">Red Soil</option>
        <option value="laterite">Laterite Soil</option>
        <option value="desert">Desert Soil</option>
        <option value="mountain">Mountain Soil</option>
        <option value="peaty">Peaty Soil</option>
        <option value="saline">Saline Soil</option>
        <option value="alkaline">Alkaline Soil</option>
        <option value="forest-loamy">Forest Loamy Soil</option>
        <option value="coastal-sandy">Coastal Sandy Soil</option>
        <option value="deltaic">Deltaic Soil</option>
      </select>
      <div style="text-align:center; margin:15px 0; font-weight:600;">
        -------- OR --------
      </div>
     <label>⚗️ Soil Nutrient Values (NPK) & pH</label>
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <input type="number" id="soilN" placeholder="Nitrogen Content (N)" />
        <input type="number" id="soilP" placeholder="Phosphorus Content (P)" />
        <input type="number" id="soilK" placeholder="Potassium Content (K)" />
        <input type="number" id="soilPH" placeholder="pH value" step="0.1" />
      </div> 

      <button onclick="getRecommendation()">Get Recommendation</button>
      <p id="resultBox" style="margin-top:15px;"></p>
    `;
  }

  body.innerHTML = content;
  modal.classList.add("active");

  if (type === "add") displayPlants();
}

function closeModal() {
  document.getElementById("popupModal").classList.remove("active");
}

// Close modal on outside click
window.onclick = function (e) {
  const modal = document.getElementById("popupModal");
  if (e.target === modal) {
    modal.classList.remove("active");
  }
};

/* ================= ADD PLANT ================= */
function addPlant() {
  const name = document.getElementById("plantName").value;
  const type = document.getElementById("plantType").value;
  const city = document.getElementById("plantCity").value;

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
  document.getElementById("plantName").value = "";
  document.getElementById("plantType").value = "";
  document.getElementById("plantCity").value = "";
}

/* ================= RECOMMENDATION ================= */
function getRecommendation() {
  const soilType = document.getElementById("soilType").value;

  const n = document.getElementById("soilN")?.value;
  const p = document.getElementById("soilP")?.value;
  const k = document.getElementById("soilK")?.value;
  const ph = document.getElementById("soilPH")?.value;

  const resultBox = document.getElementById("resultBox");

  if (!soilType && (!n || !p || !k || !ph)) {
    resultBox.innerHTML = "⚠️ Please select soil type OR enter NPK & pH values!";
    return;
  }

  let crops = "";

  // Soil Type Logic
  if (soilType) {
    switch (soilType) {
      case "alluvial": crops = "Rice, Wheat, Sugarcane"; break;
      case "black": crops = "Cotton, Soybean, Sunflower"; break;
      case "red": crops = "Millets, Pulses, Groundnut"; break;
      case "laterite": crops = "Cashew, Coffee, Tea"; break;
      case "desert": crops = "Millets, Barley"; break;
      case "mountain": crops = "Potatoes, Apple, Tea"; break;
      case "peaty": crops = "Rice, Oil Palm"; break;
      case "saline": crops = "Barley, Cotton"; break;
      case "alkaline": crops = "Wheat, Mustard"; break;
      case "forest-loamy": crops = "Spices, Vegetables"; break;
      case "coastal-sandy": crops = "Coconut, Cashew"; break;
      case "deltaic": crops = "Rice, Jute"; break;
      default: crops = "No recommendation available";
    }

    resultBox.innerHTML = `🌾 Recommended crops:<br>${crops}`;
  }

  // NPK Logic
  else {
    const N = parseFloat(n);
    const P = parseFloat(p);
    const K = parseFloat(k);
    const PH = parseFloat(ph);

    let suggestion = "";

    if (N > 50 && P > 40 && K > 40) {
      suggestion = "High nutrients → Sugarcane, Maize";
    } else if (N > 40 && P > 30) {
      suggestion = "Moderate nutrients → Wheat, Rice";
    } else if (K > 40) {
      suggestion = "High potassium → Potato, Tomato";
    } else {
      suggestion = "Low nutrients → Millets, Pulses";
    }

    if (PH < 5.5) {
      suggestion += "<br>⚠️ Acidic soil → Add lime";
    } else if (PH > 7.5) {
      suggestion += "<br>⚠️ Alkaline soil → Add compost";
    }

    resultBox.innerHTML = `
      🌱 Soil Data:<br>
      N: ${N}, P: ${P}, K: ${K}, pH: ${PH}<br><br>
      🌾 ${suggestion}
    `;
  }
}

/* ================= AI POPUP ================= */
function toggleAI() {
  document.getElementById("aiPopup").classList.toggle("active");
}

/* ================= CHATBOT ================= */
function sendMessage() {
  const input = document.getElementById("chatInput");
  const chatBox = document.getElementById("chatBox");

  const message = input.value.trim();
  if (!message) return;

  const userMsg = document.createElement("div");
  userMsg.textContent = "🧑 " + message;
  chatBox.appendChild(userMsg);

  const botMsg = document.createElement("div");
  botMsg.textContent = "🤖 " + getSmartReply(message);
  chatBox.appendChild(botMsg);

  chatBox.scrollTop = chatBox.scrollHeight;
  input.value = "";
}

function getSmartReply(msg) {
  msg = msg.toLowerCase();

  if (msg.includes("tomato")) return "Tomatoes need 6-8 hours sunlight.";
  if (msg.includes("water")) return "Water when soil is dry.";
  if (msg.includes("fertilizer")) return "Use compost or NPK.";
  if (msg.includes("disease")) return "Use neem oil.";
  if (msg.includes("sunlight")) return "Plants need 4-8 hrs sunlight.";

  return "Ask me about plants 🌱";
}

/* ================= EVENTS ================= */
document.querySelector('.send-btn')?.addEventListener('click', sendMessage);

document.getElementById('chatInput')?.addEventListener('keypress', function(e){
  if(e.key === 'Enter') sendMessage();
});

/* ================= LANGUAGE ================= */
let langPopup = document.getElementById('langPopup');

function toggleLang() {
  langPopup.classList.toggle('active');
}

function setLang(lang) {
  document.documentElement.lang = lang;
  localStorage.setItem('lang', lang);
  langPopup.classList.remove('active');
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.lang-toggle') && !e.target.closest('.lang-popup')) {
    langPopup.classList.remove('active');
  }
});

document.documentElement.lang = localStorage.getItem('lang') || 'en';
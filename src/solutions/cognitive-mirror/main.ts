// [ARCH-COMPLIANCE] SOP-01: Cognitive Mirror Controller
import {
  getSentiricClient,
  AppConfig,
  injectVersionInfo,
} from "@lib/sdk-provider";

const elements = {
  transcriptBox: document.getElementById("transcriptBox")!,
  memoryCards: document.getElementById("memoryCards")!,
  toggleBtn: document.getElementById("toggleBtn") as HTMLButtonElement,
  mood: document.getElementById("moodVal")!,
  radar: document.getElementById("radar")!,
  statusDot: document.getElementById("connection-status")!,
  shell: document.querySelector(".app-shell") as HTMLElement,
};

let client: any = null;
injectVersionInfo(document.body);

async function toggle() {
  if (client) {
    client.stop();
    client = null;
    elements.toggleBtn.innerText = "SİSTEMİ BAŞLAT";
    elements.statusDot.classList.remove("active");
    return;
  }

  const SDK = await getSentiricClient();
  client = new SDK({
    gatewayUrl: AppConfig.gatewayUrl,
    tenantId: AppConfig.tenantId,
    onTranscript: (t: any) => {
      if (t.isFinal) {
        const b = document.createElement("div");
        b.className = "bubble";
        b.innerText = t.text;
        elements.transcriptBox.appendChild(b);
        elements.transcriptBox.scrollTop = elements.transcriptBox.scrollHeight;
      }
    },
    onCognitiveMap: (m: any) => {
      handleCognitiveUpdate(m);
    },
  });

  try {
    await client.start();
    elements.toggleBtn.innerText = "SİSTEMİ DURDUR";
    elements.statusDot.classList.add("active");
  } catch (err) {
    console.error("COGNITIVE_START_FAIL", err);
    elements.toggleBtn.innerText = "HATA: TEKRAR DENE";
  }
}

function handleCognitiveUpdate(map: any) {
  if (map.dominantResonance) {
    const mood = map.dominantResonance.toUpperCase();
    elements.mood.innerText = mood;

    // Dinamik Tema Değişimi
    let color = "#8b5cf6"; // Violet (Default)
    if (mood.includes("ANGRY")) color = "#ef4444";
    if (mood.includes("DEEP") || mood.includes("MEDITATIVE")) color = "#10b981";

    elements.radar.style.borderColor = color;
    elements.radar.style.boxShadow = `inset 0 0 20px ${color}`;
    elements.shell.style.background = `radial-gradient(circle at 50% 0%, ${color}11 0%, #09090b 70%)`;
  }

  if (map.recentFactSummary) {
    const card = document.createElement("div");
    card.className = "fact-card";
    card.innerHTML = `
            <small>✨ Yeni Bilgi Mühürlendi</small>
            <span>${map.recentFactSummary}</span>
        `;
    elements.memoryCards.prepend(card);
  }
}

elements.toggleBtn.onclick = toggle;

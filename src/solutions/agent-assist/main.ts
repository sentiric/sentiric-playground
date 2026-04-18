// [ARCH-COMPLIANCE] SOP-01: Agent Assist (Real-time Whispering) Controller
import {
  getSentiricClient,
  AppConfig,
  injectVersionInfo,
} from "@lib/sdk-provider";

const elements = {
  suggestions: document.getElementById("suggestions")!,
  liveLog: document.getElementById("liveLog")!,
  btn: document.getElementById("startAssistBtn") as HTMLButtonElement,
};

let client: any = null;
injectVersionInfo(document.body);

async function toggleAssist() {
  if (client) {
    client.stop();
    client = null;
    elements.btn.innerText = "YARDIMI BAŞLAT";
    elements.btn.classList.remove("active");
    return;
  }

  const SDK = await getSentiricClient();
  client = new SDK({
    gatewayUrl: AppConfig.gatewayUrl,
    tenantId: AppConfig.tenantId,
    listenOnlyMode: true, // Temsilci konuşurken AI sadece dinler
    onTranscript: (t: any) => {
      if (t.isFinal) handleLiveTranscription(t);
    },
  });

  try {
    await client.start();
    elements.btn.innerText = "YARDIMI DURDUR";
    elements.btn.classList.add("active");
    elements.suggestions.innerHTML = "";
    elements.liveLog.innerHTML = "";
  } catch (err) {
    console.error("ASSIST_ERROR", err);
  }
}

function handleLiveTranscription(t: any) {
  const entry = document.createElement("div");
  entry.className = "log-entry";
  entry.innerHTML = `<small>[${new Date().toLocaleTimeString()}]</small> <span>${t.text}</span>`;
  elements.liveLog.appendChild(entry);
  elements.liveLog.scrollTop = elements.liveLog.scrollHeight;

  // [SIMULATION]: Akıllı Sufle Üretimi
  if (t.text.length > 20) {
    generateWhisper(t.text);
  }
}

function generateWhisper(triggerText: string) {
  const card = document.createElement("div");
  card.className = "suggestion-card";

  // Basit bir niyet simülasyonu
  let advice = "Müşterinin sorusunu detaylandırmasını isteyin.";
  if (triggerText.includes("fiyat") || triggerText.includes("para"))
    advice = "Müşteriye güncel kampanya ve %10 indirimden bahsedin.";
  if (triggerText.includes("sorun") || triggerText.includes("hata"))
    advice = "Teknik ekibe kayıt açtığınızı belirterek güven verin.";

  card.innerHTML = `
        <strong>💡 AI ÖNERİSİ</strong>
        <p>${advice}</p>
    `;

  elements.suggestions.prepend(card);
}

elements.btn.onclick = toggleAssist;

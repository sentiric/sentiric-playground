// [ARCH-COMPLIANCE] SOP-01: Megaphone (Speak-Only) Implementation
import {
  getSentiricClient,
  AppConfig,
  injectVersionInfo,
} from "@lib/sdk-provider";

const elements = {
  input: document.getElementById("textInput") as HTMLTextAreaElement,
  btn: document.getElementById("broadcastBtn")!,
  status: document.getElementById("status-text")!,
  history: document.getElementById("history")!,
};

let client: any = null;

// Linter Temizliği & Gözlemci
injectVersionInfo(document.body);

async function initMegaphone() {
  const SDK = await getSentiricClient();
  client = new SDK({
    gatewayUrl: AppConfig.gatewayUrl,
    tenantId: AppConfig.tenantId,
    speakOnlyMode: true, // KRİTİK: STT/LLM Bypass
    onAudioReceived: () => {
      elements.status.innerText = "YAYINLANIYOR...";
      elements.status.style.color = "#fbbf24";
    },
    onTranscript: (t: any) => {
      // AI konuşması bittiğinde status güncelle
      if (t.sender === "AI" && t.isFinal) {
        elements.status.innerText = "YAYIN TAMAMLANDI";
        elements.status.style.color = "#10b981";
      }
    },
  });

  await client.start();
}

function broadcast() {
  const val = elements.input.value.trim();
  if (!val || !client) return;

  // Önceki yayını durdur (Interrupt)
  client.sendInterrupt();

  // Metni gönder
  client.sendText(val);

  // Tarihçeye ekle
  const entry = document.createElement("div");
  entry.className = "log-entry";
  entry.innerText = `[${new Date().toLocaleTimeString()}] ${val.substring(0, 50)}...`;
  elements.history.prepend(entry);

  elements.input.value = "";
  elements.input.focus();
}

elements.btn.onclick = broadcast;
elements.input.onkeypress = (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    broadcast();
  }
};

initMegaphone();

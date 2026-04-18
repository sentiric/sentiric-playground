// [ARCH-COMPLIANCE] SOP-01: Meeting Analyst (Passive Observer) Controller
import {
  getSentiricClient,
  AppConfig,
  injectVersionInfo,
} from "@lib/sdk-provider";

const elements = {
  logBox: document.getElementById("logBox")!,
  startBtn: document.getElementById("startBtn") as HTMLButtonElement,
};

let client: any = null;
injectVersionInfo(document.body);

async function toggle() {
  if (client) {
    client.stop();
    client = null;
    elements.startBtn.innerText = "DİNLEMEYİ BAŞLAT";
    return;
  }

  const SDK = await getSentiricClient();
  client = new SDK({
    gatewayUrl: AppConfig.gatewayUrl,
    tenantId: AppConfig.tenantId,
    listenOnlyMode: true, // KRİTİK: AI Cevap vermez, sadece dinler.
    onTranscript: (t: any) => {
      if (t.isFinal) renderEntry(t);
    },
  });

  await client.start();
  elements.startBtn.innerText = "DURDUR";
  elements.logBox.innerHTML = ""; // Ekranı temizle
}

function renderEntry(t: any) {
  const div = document.createElement("div");
  div.className = "entry";

  // Konuşmacıya özel renk belirle (Basit hash)
  const colors = ["#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"];
  const spkIndex = t.speakerId ? parseInt(t.speakerId.split("_")[1]) || 0 : 0;
  const color = colors[spkIndex % colors.length];

  div.innerHTML = `
    <span class="spk-id" style="color: ${color}; border: 1px solid ${color}44;">${t.speakerId || "UNKNOWN"}</span>
    <span class="text">${t.text}</span>
  `;

  elements.logBox.appendChild(div);
  elements.logBox.scrollTop = elements.logBox.scrollHeight;
}

elements.startBtn.onclick = toggle;

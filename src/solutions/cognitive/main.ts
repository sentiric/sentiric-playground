// File: src/solutions/cognitive/main.ts
import { getSentiricClient } from "../../lib/sdk-provider";

const elements = {
  transcriptBox: document.getElementById("transcriptBox")!,
  memoryCards: document.getElementById("memoryCards")!,
  toggleBtn: document.getElementById("toggleBtn")!,
  status: document.getElementById("status")!,
  mood: document.getElementById("moodVal")!,
};

let client: any = null;

async function toggleSession() {
  if (client) {
    client.stop();
    client = null;
    elements.toggleBtn.innerText = "OTURUMU BAŞLAT";
    elements.status.innerText = "Bağlantı kesildi.";
    return;
  }

  elements.status.innerText = "Bağlanıyor...";

  try {
    const SentiricStreamClient = await getSentiricClient();

    client = new SentiricStreamClient({
      gatewayUrl: "wss://http-stream-gateway-service-sentiric.azmisahin.com/ws",
      tenantId: "demo-tenant",
      onTranscript: (t: any) => {
        if (t.isFinal) {
          const b = document.createElement("div");
          b.className = "bubble";
          b.innerText = t.text;
          elements.transcriptBox.appendChild(b);
          elements.transcriptBox.scrollTop =
            elements.transcriptBox.scrollHeight;
        }
      },
      onCognitiveMap: (m: any) => {
        if (m.dominantResonance)
          elements.mood.innerText = m.dominantResonance.toUpperCase();
        if (m.recentFactSummary) {
          const c = document.createElement("div");
          c.className = "fact-card";
          c.innerText = m.recentFactSummary;
          elements.memoryCards.prepend(c);
        }
      },
    });

    await client.start();
    elements.toggleBtn.innerText = "OTURUMU DURDUR";
    elements.status.innerText = "Bağlantı aktif.";
  } catch (e: any) {
    elements.status.innerText = `HATA: ${e.message}`;
    client = null;
  }
}

elements.toggleBtn.onclick = toggleSession;

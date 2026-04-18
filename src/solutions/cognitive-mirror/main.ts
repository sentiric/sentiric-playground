// [ARCH-COMPLIANCE] SOP-01: Real-time Mood Visualization (Reflex Mapping)
import { getSentiricClient } from "@lib/sdk-provider";
const elements = {
  transcriptBox: document.getElementById("transcriptBox")!,
  memoryCards: document.getElementById("memoryCards")!,
  toggleBtn: document.getElementById("toggleBtn")!,
  mood: document.getElementById("moodVal")!,
  shell: document.querySelector(".app-shell") as HTMLElement,
};
let client: any = null;

async function toggle() {
  if (client) {
    client.stop();
    client = null;
    elements.toggleBtn.innerText = "SİSTEMİ BAŞLAT";
    return;
  }
  const SDK = await getSentiricClient();
  client = new SDK({
    gatewayUrl: "wss://http-stream-gateway-service-sentiric.azmisahin.com/ws",
    tenantId: "demo",
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
      if (m.dominantResonance) {
        const mood = m.dominantResonance.toUpperCase();
        elements.mood.innerText = mood;

        // [VISUAL REFLEX]: Duyguya göre arka plan ışıltısını değiştir
        let color = "rgba(139, 92, 246, 0.15)"; // Default Violet
        if (mood.includes("ANGRY") || mood.includes("STRESS"))
          color = "rgba(239, 68, 68, 0.25)";
        if (mood.includes("DEEP") || mood.includes("MEDITATIVE"))
          color = "rgba(16, 185, 129, 0.25)";

        elements.shell.style.background = `radial-gradient(circle at 50% 0%, ${color} 0%, #09090b 70%)`;
      }
      if (m.recentFactSummary) {
        const c = document.createElement("div");
        c.className = "fact-card";
        c.innerHTML = `<strong>Hafıza Mühürlendi:</strong><br>${m.recentFactSummary}`;
        elements.memoryCards.prepend(c);
      }
    },
  });
  await client.start();
  elements.toggleBtn.innerText = "SİSTEMİ DURDUR";
}
elements.toggleBtn.onclick = toggle;

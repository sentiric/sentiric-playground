import { getSentiricClient } from "@lib/sdk-provider";
const elements = {
  transcriptBox: document.getElementById("transcriptBox")!,
  memoryCards: document.getElementById("memoryCards")!,
  toggleBtn: document.getElementById("toggleBtn")!,
  mood: document.getElementById("moodVal")!,
};
let client: any = null;
async function toggle() {
  if (client) {
    client.stop();
    client = null;
    elements.toggleBtn.innerText = "BAŞLAT";
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
  elements.toggleBtn.innerText = "DURDUR";
}
elements.toggleBtn.onclick = toggle;

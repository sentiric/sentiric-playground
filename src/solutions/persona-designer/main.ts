import { getSentiricClient } from "../../lib/sdk-provider";
const btn = document.getElementById("testBtn")!;
const log = document.getElementById("chat")!;

btn.onclick = async () => {
  const sys = (document.getElementById("sysPrompt") as HTMLTextAreaElement)
    .value;
  const voice = (document.getElementById("voiceId") as HTMLSelectElement).value;

  log.innerHTML = "🔵 New Persona loading...";
  const SDK = await getSentiricClient();
  const client = new SDK({
    gatewayUrl: "wss://http-stream-gateway-service-sentiric.azmisahin.com/ws",
    tenantId: "demo",
    systemPromptId: sys,
    ttsVoiceId: voice,
    onTranscript: (t: any) => {
      if (t.isFinal) log.innerHTML += `<p><strong>AI:</strong> ${t.text}</p>`;
    },
  });
  await client.start();
  btn.innerText = "DURDUR";
};

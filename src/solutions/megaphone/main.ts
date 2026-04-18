import { getSentiricClient } from "../../lib/sdk-provider";
const input = document.getElementById("textInput") as HTMLTextAreaElement;
const btn = document.getElementById("broadcastBtn")!;
let client: any = null;

async function init() {
  const SDK = await getSentiricClient();
  client = new SDK({
    gatewayUrl: "wss://http-stream-gateway-service-sentiric.azmisahin.com/ws",
    tenantId: "demo",
    speakOnlyMode: true, // Kritik: STT ve LLM bypass
  });
  await client.start();
}

btn.onclick = () => {
  if (!input.value.trim()) return;
  client.sendInterrupt(); // Öncekini sustur
  client.sendText(input.value);
};
init();

import { getSentiricClient } from "@lib/sdk-provider";
const btn = document.getElementById("startBtn")!;
const log = document.getElementById("analystLog")!;
let client: any = null;

btn.onclick = async () => {
  if (client) {
    client.stop();
    client = null;
    btn.innerText = "DİNLEMEYİ BAŞLAT";
    return;
  }
  const SDK = await getSentiricClient();
  client = new SDK({
    gatewayUrl: "wss://http-stream-gateway-service-sentiric.azmisahin.com/ws",
    tenantId: "demo",
    listenOnlyMode: true,
    onTranscript: (t: any) => {
      const entry = document.createElement("div");
      entry.innerText = `[${t.speakerId}] ${t.text}`;
      log.prepend(entry);
    },
  });
  await client.start();
  btn.innerText = "DURDUR";
};

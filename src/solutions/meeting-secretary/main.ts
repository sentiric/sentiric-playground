import { getSentiricClient } from "../../lib/sdk-provider";
const tBox = document.getElementById("transcript")!;
async function start() {
  const SDK = await getSentiricClient();
  const client = new SDK({
    gatewayUrl: "wss://http-stream-gateway-service-sentiric.azmisahin.com/ws",
    tenantId: "demo",
    listenOnlyMode: true,
    onTranscript: (t: any) => {
      if (t.isFinal) tBox.innerHTML += `<p>${t.text}</p>`;
    },
  });
  await client.start();
}
start();

import { getSentiricClient } from "../../lib/sdk-provider";
const btn = document.getElementById("micBtn")!;
const log = document.getElementById("transcript")!;
let client: any = null;

btn.onclick = async () => {
  if (client) {
    client.stop();
    client = null;
    btn.classList.remove("active");
    return;
  }
  const SDK = await getSentiricClient();
  client = new SDK({
    gatewayUrl: "wss://http-stream-gateway-service-sentiric.azmisahin.com/ws",
    tenantId: "demo",
    onTranscript: (t: any) => {
      log.innerText = t.text;
    },
  });
  await client.start();
  btn.classList.add("active");
};

import { getSentiricClient } from "../../lib/sdk-provider";
const log = document.getElementById("cmdLog")!;
async function init() {
  const SDK = await getSentiricClient();
  const client = new SDK({
    gatewayUrl: "wss://http-stream-gateway-service-sentiric.azmisahin.com/ws",
    tenantId: "demo",
    systemPromptId: "PROMPT_COMMANDER",
    onTranscript: (t: any) => {
      if (t.isFinal) log.innerHTML += `<br>[EXEC]: ${t.text}`;
    },
  });
  await client.start();
}
init();

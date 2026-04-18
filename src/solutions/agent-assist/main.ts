import { getSentiricClient } from "@lib/sdk-provider";
const suggestBox = document.getElementById("suggestions")!;

async function startAssist() {
  const SDK = await getSentiricClient();
  const client = new SDK({
    gatewayUrl: "wss://http-stream-gateway-service-sentiric.azmisahin.com/ws",
    tenantId: "demo",
    listenOnlyMode: true,
    onTranscript: (t: any) => {
      if (t.isFinal) {
        const s = document.createElement("div");
        s.className = "suggestion-card";
        s.innerHTML = `<strong>Öneri:</strong> ${t.text} konusuyla ilgili müşteri temsilcisine şu bilgiyi ver...`;
        suggestBox.prepend(s);
      }
    },
  });
  await client.start();
}
startAssist();

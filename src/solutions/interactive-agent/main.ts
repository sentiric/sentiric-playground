// [ARCH-COMPLIANCE] SOP-01: Connect UI to SDK v0.8.8 Robust States
import { getSentiricClient } from "../../lib/sdk-provider";
const btn = document.getElementById("micBtn")!;
const log = document.getElementById("transcript")!;
let client: any = null;

btn.onclick = async () => {
  if (client) {
    client.stop();
    client = null;
    btn.classList.remove("active");
    log.innerText = "Bağlantı kapatıldı.";
    return;
  }

  const SDK = await getSentiricClient();
  client = new SDK({
    gatewayUrl: "wss://http-stream-gateway-service-sentiric.azmisahin.com/ws",
    tenantId: "demo",
    onTranscript: (t: any) => {
      log.innerText = t.text;
      log.style.opacity = t.isFinal ? "1" : "0.6";
    },
    onError: (err: any) => {
      console.error("SDK_ERR", err);
      log.innerText = "❌ Bağlantı hatası!";
      btn.classList.remove("active");
    },
  });

  try {
    await client.start();
    btn.classList.add("active");
    log.innerText = "Dinliyor...";
  } catch {
    log.innerText = "❌ Mikrofon izni verilmedi.";
  }
};

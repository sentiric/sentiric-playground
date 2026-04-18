import {
  getSentiricClient,
  AppConfig,
  injectVersionInfo,
} from "../../lib/sdk-provider";
const btn = document.getElementById("micBtn")!;
const log = document.getElementById("transcript")!;
let client: any = null;

// Versiyon bilgisini sağ alt köşeye enjekte et
injectVersionInfo(document.body);

btn.onclick = async () => {
  if (client) {
    client.stop();
    client = null;
    btn.classList.remove("active");
    return;
  }

  const SDK = await getSentiricClient();
  client = new SDK({
    gatewayUrl: AppConfig.gatewayUrl, // Merkezi URL
    tenantId: AppConfig.tenantId, // Merkezi Tenant
    onTranscript: (t: any) => {
      log.innerText = t.text;
    },
  });

  await client.start();
  btn.classList.add("active");
};

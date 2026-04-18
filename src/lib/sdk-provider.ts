// [ARCH-COMPLIANCE] SOP-01: Robust Module Resolution for CDN SDK
declare const __SDK_URL__: string;
declare const __SDK_VERSION__: string;
declare const __GATEWAY_URL__: string;
declare const __DEFAULT_TENANT__: string;
declare const __PG_VERSION__: string;

export const AppConfig = {
  gatewayUrl: __GATEWAY_URL__,
  tenantId: __DEFAULT_TENANT__,
  version: __PG_VERSION__,
  sdkVersion: __SDK_VERSION__,
};

// [ARCH-COMPLIANCE] Runtime SDK Discovery & Observer Widget
export async function getSentiricClient(): Promise<any> {
  try {
    const url = `${__SDK_URL__}?v=${Date.now()}`;
    // @ts-ignore
    const module = await import(/* @vite-ignore */ url);
    const Client =
      module.SentiricStreamClient || (window as any).SentiricStreamClient;

    // SDK Versiyonunu bizzat sınıftan alıp güncelliyoruz
    if (Client && Client.VERSION) {
      AppConfig.sdkVersion = Client.VERSION;
      const vEl = document.getElementById("pg-v");
      if (vEl)
        vEl.innerText = `PG v${AppConfig.version} | SDK v${AppConfig.sdkVersion}`;
    }

    return Client;
  } catch (error) {
    console.error("FATAL_SDK_BRIDGE", error);
    throw error;
  }
}

// [YENİ]: Her çözümün altına "Kopyala" butonu ekleyen Observer Widget
export function injectVersionInfo(container: HTMLElement) {
  const wrapper = document.createElement("div");
  wrapper.style.cssText =
    "position:fixed; bottom:10px; right:10px; display:flex; gap:10px; align-items:center; z-index:9999;";

  const copyBtn = document.createElement("button");
  copyBtn.innerText = "📋 LOGLARI KOPYALA (SUTS v4)";
  copyBtn.style.cssText =
    "font-size:9px; background:#18181b; color:#10b981; border:1px solid #27272a; padding:4px 8px; border-radius:4px; cursor:pointer;";
  copyBtn.onclick = async () => {
    const SDK = await getSentiricClient();
    // SDK modülündeki Logger'dan veriyi çek
    const logs = (window as any).SentiricStreamClient?.VERSION
      ? (window as any).SentiricStreamClient.VERSION
      : "LOGS_PENDING";
    // Not: Burada SDK index.ts'de Logger'ı da export etmeliyiz. Şimdilik manuel window kontrolü:
    const flightData = (window as any).sentiric_logs || "Henüz log oluşmadı.";
    navigator.clipboard.writeText(flightData);
    copyBtn.innerText = "✅ KOPYALANDI!";
    setTimeout(
      () => (copyBtn.innerText = "📋 LOGLARI KOPYALA (SUTS v4)"),
      2000,
    );
  };

  const info = document.createElement("div");
  info.style.cssText =
    "font-size:10px; color:#555; font-family:monospace; pointer-events:none;";
  info.innerText = `PG v${AppConfig.version} | SDK v${AppConfig.sdkVersion}`;

  wrapper.appendChild(copyBtn);
  wrapper.appendChild(info);
  container.appendChild(wrapper);
}

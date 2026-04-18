// [ARCH-COMPLIANCE] SOP-01: Reactive SDK Bridge & Modern Observer UI
declare const __SDK_URL__: string;
// declare const __SDK_VERSION__: string;
declare const __GATEWAY_URL__: string;
declare const __DEFAULT_TENANT__: string;
declare const __PG_VERSION__: string;

export const AppConfig = {
  gatewayUrl: __GATEWAY_URL__,
  tenantId: __DEFAULT_TENANT__,
  version: __PG_VERSION__,
  sdkVersion: "loading...",
};

export async function getSentiricClient(): Promise<any> {
  try {
    const url = `${__SDK_URL__}?v=${Date.now()}`;
    // @ts-ignore
    const module = await import(/* @vite-ignore */ url);
    const Client =
      module.SentiricStreamClient || (window as any).SentiricStreamClient;

    if (Client && Client.VERSION) {
      AppConfig.sdkVersion = Client.VERSION;
      // Sayfadaki tüm versiyon etiketlerini bul ve güncelle
      document.querySelectorAll(".pg-version-display").forEach((el) => {
        (el as HTMLElement).innerText =
          `PG v${AppConfig.version} | SDK v${AppConfig.sdkVersion}`;
      });
    }
    return Client;
  } catch (error) {
    console.error("FATAL_SDK_BRIDGE", error);
    throw error;
  }
}

export function injectVersionInfo(container: HTMLElement) {
  const wrapper = document.createElement("div");
  wrapper.style.cssText =
    "position:fixed; bottom:20px; right:20px; display:flex; flex-direction:column; align-items:flex-end; gap:8px; z-index:99999;";

  const copyBtn = document.createElement("button");
  copyBtn.innerHTML = `
        <div style="display:flex; align-items:center; gap:6px;">
            <div style="width:8px; height:8px; border-radius:50%; background:#10b981; animation:pulse 2s infinite;"></div>
            LOGLARI KOPYALA (SUTS v4)
        </div>
    `;
  copyBtn.style.cssText =
    "font-size:10px; background:#18181b; color:#fff; border:1px solid #27272a; padding:8px 12px; border-radius:8px; cursor:pointer; font-weight:bold; box-shadow: 0 4px 12px rgba(0,0,0,0.5); transition:0.2s;";

  copyBtn.onclick = () => {
    const Logger = (window as any).SentiricLogger;
    if (Logger && typeof Logger.getFlightLog === "function") {
      navigator.clipboard.writeText(Logger.getFlightLog());
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = "✅ PANOLANDI!";
      setTimeout(() => (copyBtn.innerHTML = originalText), 2000);
    }
  };

  const info = document.createElement("div");
  info.className = "pg-version-display"; // Dinamik güncelleme için class eklendi
  info.style.cssText =
    "font-size:10px; color:#555; font-family:monospace; background:rgba(0,0,0,0.3); padding:2px 6px; border-radius:4px;";
  info.innerText = `PG v${AppConfig.version} | SDK v${AppConfig.sdkVersion}`;

  wrapper.appendChild(info);
  wrapper.appendChild(copyBtn);
  container.appendChild(wrapper);
}

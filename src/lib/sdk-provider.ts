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

export async function getSentiricClient(): Promise<any> {
  try {
    // URL'in sonuna timestamp ekleyerek cache-bursting yapıyoruz (Geliştirme aşaması için kritik)
    const url = `${__SDK_URL__}?t=${Date.now()}`;
    // @ts-ignore
    const module = await import(/* @vite-ignore */ url);

    console.log("📦 SDK_MODULE_LOADED", module);

    // Named export veya Default export kontrolü
    const Client =
      module.SentiricStreamClient ||
      module.default?.SentiricStreamClient ||
      module.default;

    if (!Client) {
      throw new Error(
        "SentiricStreamClient bulunamadı. Export yapısını kontrol edin.",
      );
    }

    return Client;
  } catch (error) {
    console.error("FATAL: Failed to load Sentiric SDK from CDN", error);
    throw error;
  }
}

export function injectVersionInfo(container: HTMLElement) {
  const footer = document.createElement("div");
  footer.style.cssText =
    "position:fixed; bottom:10px; right:10px; font-size:10px; color:#555; font-family:monospace; pointer-events:none; z-index:9999;";
  footer.innerText = `PG v${AppConfig.version} | SDK v${AppConfig.sdkVersion}`;
  container.appendChild(footer);
}

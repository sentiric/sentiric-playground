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

// [ARCH-COMPLIANCE] SOP-01: Auto-Cache-Busting via Versioning
export async function getSentiricClient(): Promise<any> {
  try {
    // Versiyon bilgisini URL'e ekleyerek browser cache'ini zorla yeniliyoruz
    const url = `${__SDK_URL__}?v=${AppConfig.sdkVersion}`;
    // @ts-ignore
    const module = await import(/* @vite-ignore */ url);

    // Hem ES Module exportunu hem de window fallbackini kontrol et
    const Client =
      module.SentiricStreamClient || (window as any).SentiricStreamClient;

    if (!Client) {
      throw new Error("SentiricStreamClient yüklenemedi. Bundle bozuk.");
    }

    return Client;
  } catch (error) {
    console.error("FATAL_SDK_BRIDGE", error);
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

// File: src/lib/sdk-provider.ts

declare const __SDK_URL__: string;
declare const __SDK_VERSION__: string; // <--- Eklendi
declare const __GATEWAY_URL__: string;
declare const __DEFAULT_TENANT__: string;
declare const __PG_VERSION__: string;

export const AppConfig = {
  gatewayUrl: __GATEWAY_URL__,
  tenantId: __DEFAULT_TENANT__,
  version: __PG_VERSION__,
  sdkVersion: __SDK_VERSION__, // <--- Eklendi
};

export async function getSentiricClient(): Promise<any> {
  try {
    // @ts-ignore
    const module = await import(/* @vite-ignore */ __SDK_URL__);
    return module.SentiricStreamClient;
  } catch (error) {
    console.error("FATAL: Failed to load Sentiric SDK from CDN", error);
    throw error;
  }
}

// Çözümlerin altına versiyon bilgisini basan yardımcı
export function injectVersionInfo(container: HTMLElement) {
  const footer = document.createElement("div");
  footer.style.cssText =
    "position:fixed; bottom:10px; right:10px; font-size:10px; color:#555; font-family:monospace; pointer-events:none; z-index:9999;";
  footer.innerText = `PG v${AppConfig.version} | SDK v${AppConfig.sdkVersion}`;
  container.appendChild(footer);
}

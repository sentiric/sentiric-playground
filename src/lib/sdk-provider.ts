// File: src/lib/sdk-provider.ts

declare const __SDK_URL__: string;

/**
 * [ARCH-COMPLIANCE]: SDK Provider (The Bridge)
 */
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

# 🧬 Playground Orchestration Logic

## 1. Otonom Çözüm Keşfi (Auto-Discovery)
Vite derleme süreci (`vite.config.ts`), `src/solutions` klasörünü `glob` paterniyle tarar. Her `index.html` dosyası otomatik olarak yeni bir "Entry Point" olarak kaydedilir. Bu sayede manuel index yönetimi gereksizleşir ve hata payı sıfıra iner.

## 2. Dynamic SDK Bridging
Playground, kütüphane bağımlılığını (SDK) derleme zamanında (Build-time) değil, çalışma zamanında (Run-time) yükler. 
*   **Neden:** NPM Registry yetkilendirme (Auth) karmaşasından kurtulmak ve kütüphanenin en güncel (mühürlü) halini doğrudan CDN'den çekmek için.
*   **Mekanizma:** `src/lib/sdk-provider.ts` dosyası, `import()` fonksiyonunu kullanarak SDK'yı asenkron olarak yükler ve `SentiricStreamClient` sınıfını çözümlere enjekte eder.

## 3. UI/UX İzolasyonu
Her çözüm (`Solution`), `app-shell` yapısını bozmadan kendi stil dünyasını (Shadow DOM benzeri izolasyon) `style.css` üzerinden kurar. Bu, "Innovation Lab" içindeki fikirlerin birbirine karışmadan hızlıca prototiplenmesini sağlar.
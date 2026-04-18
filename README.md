# 🧪 Sentiric Innovation Lab (Playground)

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![Platform](https://img.shields.io/badge/platform-Sentiric%20OS-blue)]()

Sentiric OS ekosistemi için geliştirilen otonom yeteneklerin ve etkileşimli çözümlerin canlı vitrinidir. Bu repo, `@sentiric/stream-sdk` kütüphanesini kullanarak gerçek dünya senaryolarını simüle eder.

## 🚀 Canlı Deneyim
Tüm çözümleri anında test etmek için laboratuvarı ziyaret edin:
👉 **[https://sentiric.github.io/sentiric-playground/](https://sentiric.github.io/sentiric-playground/)**

## 🏗️ Mimari Yaklaşım (Solution-Based)
Bu repo, **"Capability Solutions"** mimarisiyle inşa edilmiştir. Her klasör (`src/solutions/*`) kendi HTML, TS ve CSS dosyalarına sahip izole bir mikro-uygulamadır.
*   **Zero-Infection:** Bir çözümdeki değişiklik diğerlerini etkilemez.
*   **Auto-Discovery:** Yeni bir klasör açıldığında Vite tarafından otomatik olarak keşfedilir ve yayınlanır.
*   **SDK Bridge:** Kütüphane bağımlılığı doğrudan CDN (GitHub Pages) üzerinden asenkron olarak yüklenir.

## 🏛️ Mimari ve Mantık
* **Geliştirici Kuralları:** Gizli [.context.md](.context.md) dosyasını okuyun (AI Ajanları için zorunludur).
* **İş Mantığı ve Algoritmalar:** [LOGIC.md](LOGIC.md) dosyasını inceleyin.
* **Anayasal Konum:** [sentiric-spec/spec/frontends/playground.yaml](https://github.com/sentiric/sentiric-spec)
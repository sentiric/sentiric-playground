// [ARCH-COMPLIANCE] SOP-01: Multi-modal Vision Interface
import { AppConfig, injectVersionInfo } from "@lib/sdk-provider";

const elements = {
  video: document.getElementById("webcam") as HTMLVideoElement,
  overlay: document.getElementById("overlay") as HTMLCanvasElement,
  btn: document.getElementById("cameraBtn") as HTMLButtonElement,
  insight: document.getElementById("ai-insights")!,
  fps: document.getElementById("fps")!,
  layout: document.querySelector(".vision-layout")!,
};

let stream: MediaStream | null = null;
injectVersionInfo(document.body);

async function toggleCamera() {
  if (stream) {
    stream.getTracks().forEach((t) => t.stop());
    stream = null;
    elements.btn.innerText = "KAMERAYI ETKİNLEŞTİR";
    elements.layout.classList.remove("active");
    elements.insight.innerText = "SİSTEM DURDURULDU.";
    return;
  }

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false,
    });
    elements.video.srcObject = stream;
    elements.btn.innerText = "DURDUR";
    elements.layout.classList.add("active");
    startAnalysisLoop();
  } catch (err) {
    console.error("VISION_ERROR", err);
    elements.insight.innerText = "HATA: Kamera erişimi reddedildi.";
  }
}

function startAnalysisLoop() {
  elements.insight.innerText = "BAĞLAM ANALİZ EDİLİYOR...";

  // [SIMULATION]: Yapay zekanın "gördüğünü" simüle eden döngü
  const scenarios = [
    "Analiz: Çalışma masası ve teknolojik ekipmanlar saptandı.",
    "Tespit: Kullanıcı etkileşim modunda.",
    "Insight: Ortam ışığı optimizasyonu önerilir.",
    "Analiz: Görüntüde bir insan yüzü ve odaklanmış bakış var.",
  ];

  let i = 0;
  const interval = setInterval(() => {
    if (!stream) {
      clearInterval(interval);
      return;
    }
    elements.insight.innerText = scenarios[i % scenarios.length];
    elements.fps.innerText = (Math.random() * 5 + 24).toFixed(1);
    i++;
  }, 5000);
}

elements.btn.onclick = toggleCamera;

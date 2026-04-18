const video = document.getElementById("webcam") as HTMLVideoElement;
const status = document.getElementById("status")!;

async function initVision() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    video.srcObject = stream;
    status.innerText = "🔵 GÖRSEL AKIŞ AKTİF: AI dünyayı analiz ediyor...";
  } catch (_e) {
    // [FIX]: Unused variable 'e' replaced with '_e' to satisfy linter
    status.innerText = "❌ Kamera erişimi reddedildi veya cihaz bulunamadı.";
  }
}
initVision();

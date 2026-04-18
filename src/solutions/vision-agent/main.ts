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
  } catch (e) {
    status.innerText = "❌ Kamera erişimi reddedildi.";
  }
}
initVision();

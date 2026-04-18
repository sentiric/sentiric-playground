// [ARCH-COMPLIANCE] SOP-01: Meeting Secretary (Autonomous extraction) Implementation
import {
  getSentiricClient,
  AppConfig,
  injectVersionInfo,
} from "@lib/sdk-provider";

const elements = {
  transcript: document.getElementById("transcript")!,
  actions: document.getElementById("actions")!,
  recordBtn: document.getElementById("recordBtn") as HTMLButtonElement,
  timer: document.getElementById("session-timer")!,
};

let client: any = null;
let sentenceCount = 0;

injectVersionInfo(document.body);

async function toggleMeeting() {
  if (client) {
    client.stop();
    client = null;
    elements.recordBtn.innerText = "TOPLANTIYI BAŞLAT";
    elements.recordBtn.classList.remove("active");
    return;
  }

  const SDK = await getSentiricClient();
  client = new SDK({
    gatewayUrl: AppConfig.gatewayUrl,
    tenantId: AppConfig.tenantId,
    listenOnlyMode: true,
    onTranscript: (t: any) => {
      if (t.isFinal) handleTranscription(t);
    },
  });

  try {
    await client.start();
    elements.recordBtn.innerText = "TOPLANTIYI BİTİR";
    elements.recordBtn.classList.add("active");
    elements.transcript.innerHTML = "";
    elements.actions.innerHTML = "";
    sentenceCount = 0;
  } catch (err) {
    console.error("SECRETARY_ERROR", err);
  }
}

function handleTranscription(t: any) {
  sentenceCount++;

  const line = document.createElement("div");
  line.className = "line";
  line.innerHTML = `<strong>${t.speakerId || "SPK_X"}</strong><p>${t.text}</p>`;
  elements.transcript.appendChild(line);
  elements.transcript.scrollTop = elements.transcript.scrollHeight;

  // [SIMULATION]: Önemli anları yakalama simülasyonu
  if (sentenceCount % 4 === 0) {
    generateActionItem(t.text);
  }
}

function generateActionItem(text: string) {
  if (elements.actions.querySelector(".empty-state")) {
    elements.actions.innerHTML = "";
  }

  const action = document.createElement("div");
  action.className = "action-item";
  action.innerText = `📌 Aksiyon Saptandı: "${text.substring(0, 40)}..." konusu CRM'e not olarak eklendi.`;
  elements.actions.prepend(action);
}

elements.recordBtn.onclick = toggleMeeting;

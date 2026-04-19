// [ARCH-COMPLIANCE] SOP-01: Persona Designer (Dynamic Context) Controller
import {
  getSentiricClient,
  AppConfig,
  injectVersionInfo,
} from "@lib/sdk-provider";

const elements = {
  sysPrompt: document.getElementById("sysPrompt") as HTMLTextAreaElement,
  voiceId: document.getElementById("voiceId") as HTMLSelectElement,
  applyBtn: document.getElementById("applyBtn") as HTMLButtonElement,
  chat: document.getElementById("chat-stream")!,
  status: document.getElementById("preview-status")!,
};

let client: any = null;
injectVersionInfo(document.body);

async function togglePersona() {
  if (client) {
    client.stop();
    client = null;
    elements.applyBtn.innerText = "TASARIMI UYGULA VE BAŞLAT";
    elements.applyBtn.classList.remove("active");
    elements.status.innerText = "LIVE PREVIEW: STANDBY";
    return;
  }

  const SDK = await getSentiricClient();

  // Dinamik Ayarları Oku
  const customPrompt = elements.sysPrompt.value.trim();
  const customVoice = elements.voiceId.value;

  client = new SDK({
    gatewayUrl: AppConfig.gatewayUrl,
    tenantId: AppConfig.tenantId,
    systemPromptId: customPrompt, // Dinamik Persona
    ttsVoiceId: customVoice, // Dinamik Ses
    onTranscript: (t: any) => {
      renderBubble(t);
    },
  });

  try {
    await client.start();
    elements.applyBtn.innerText = "OTURUMU DURDUR";
    elements.applyBtn.classList.add("active");
    elements.status.innerText = "LIVE PREVIEW: ACTIVE";
    elements.chat.innerHTML = "";
  } catch (err) {
    console.error("DESIGNER_START_FAIL", err);
  }
}

function renderBubble(t: any) {
  if (!t.isFinal) return;
  const div = document.createElement("div");
  div.className = `bubble ${t.sender === "USER" ? "user" : "ai"}`;
  div.innerText = t.text;
  elements.chat.appendChild(div);
  elements.chat.scrollTop = elements.chat.scrollHeight;
}

elements.applyBtn.onclick = togglePersona;

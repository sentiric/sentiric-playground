// [ARCH-COMPLIANCE] SOP-01: Fix unused 'e' and verify constructor call
import {
  getSentiricClient,
  AppConfig,
  injectVersionInfo,
} from "../../lib/sdk-provider";

const elements = {
  btn: document.getElementById("micBtn") as HTMLButtonElement,
  chat: document.getElementById("chat-box")!,
  status: document.getElementById("status-tag")!,
  shell: document.querySelector(".shell")!,
};

let client: any = null;
let activeBubble: HTMLElement | null = null;

injectVersionInfo(document.body);

async function startSession() {
  try {
    const ClientClass = await getSentiricClient();

    // constructor çağrısı öncesi kontrol
    client = new ClientClass({
      gatewayUrl: AppConfig.gatewayUrl,
      tenantId: AppConfig.tenantId,
      onTranscript: (t: any) => {
        handleTranscript(t);
      },
      onError: (err: any) => {
        console.error("AGENT_ERROR", err);
        updateStatus("HATA", "#ef4444");
        stopSession();
      },
    });

    await client.start();
    updateStatus("DİNLİYOR", "#10b981");
    elements.btn.classList.add("active");
  } catch (err) {
    console.error("START_FAIL", err);
    updateStatus("ERİŞİM HATASI", "#ef4444");
    stopSession();
  }
}

function stopSession() {
  if (client) {
    try {
      client.stop();
    } catch (err) {
      console.warn("STOP_ERR", err);
    }
  }
  client = null;
  elements.btn.classList.remove("active");
  elements.shell.classList.remove("ai-speaking");
  updateStatus("ÇEVRİMDIŞI", "#a1a1aa");
}

function updateStatus(text: string, color: string) {
  elements.status.innerText = text;
  elements.status.style.background = `${color}22`;
  elements.status.style.color = color;
}

function handleTranscript(t: any) {
  const isUser = t.sender === "USER";
  if (!isUser) elements.shell.classList.add("ai-speaking");
  else elements.shell.classList.remove("ai-speaking");

  if (!activeBubble || activeBubble.dataset.sender !== t.sender) {
    activeBubble = document.createElement("div");
    activeBubble.className = `bubble ${isUser ? "user" : "ai"}`;
    activeBubble.dataset.sender = t.sender;
    elements.chat.appendChild(activeBubble);
  }

  activeBubble.innerText = t.text;
  activeBubble.classList.toggle("partial", !t.isFinal);

  if (t.isFinal) {
    activeBubble = null;
    elements.chat.scrollTop = elements.chat.scrollHeight;
  }
}

elements.btn.onclick = () => {
  if (client) stopSession();
  else startSession();
};

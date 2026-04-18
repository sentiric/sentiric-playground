// [ARCH-COMPLIANCE] SOP-01: Omni-Chat (Text-Only) Controller
import {
  getSentiricClient,
  AppConfig,
  injectVersionInfo,
} from "@lib/sdk-provider";
import { marked } from "marked";

const elements = {
  chatBox: document.getElementById("chatBox")!,
  msgInput: document.getElementById("msgInput") as HTMLInputElement,
  sendBtn: document.getElementById("sendBtn")!,
};

let client: any = null;
let activeAiBubble: HTMLElement | null = null;

injectVersionInfo(document.body);

async function initChat() {
  const SDK = await getSentiricClient();
  client = new SDK({
    gatewayUrl: AppConfig.gatewayUrl,
    tenantId: AppConfig.tenantId,
    chatOnlyMode: true, // KRİTİK: Mikrofon ve Hoparlör kullanılmaz
    onTranscript: (t: any) => {
      if (t.sender === "AI") {
        handleAiResponse(t);
      }
    },
  });

  await client.start();
}

function handleAiResponse(t: any) {
  if (!activeAiBubble) {
    activeAiBubble = document.createElement("div");
    activeAiBubble.className = "bubble ai";
    elements.chatBox.appendChild(activeAiBubble);
  }

  // Markdown Render
  activeAiBubble.innerHTML = marked.parse(
    t.text + (t.isFinal ? "" : " ▋"),
  ) as string;
  elements.chatBox.scrollTop = elements.chatBox.scrollHeight;

  if (t.isFinal) {
    activeAiBubble = null;
  }
}

function sendMessage() {
  const text = elements.msgInput.value.trim();
  if (!text || !client) return;

  // Kullanıcı baloncuğunu ekle
  const uBubble = document.createElement("div");
  uBubble.className = "bubble user";
  uBubble.innerText = text;
  elements.chatBox.appendChild(uBubble);

  client.sendText(text); // SDK üzerinden metni gönder
  elements.msgInput.value = "";
  elements.chatBox.scrollTop = elements.chatBox.scrollHeight;
}

elements.sendBtn.onclick = sendMessage;
elements.msgInput.onkeypress = (e) => {
  if (e.key === "Enter") sendMessage();
};

initChat();

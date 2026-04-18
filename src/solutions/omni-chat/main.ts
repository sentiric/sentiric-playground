// [ARCH-COMPLIANCE] SOP-01: Omni-Chat Turn-based Bubble Logic Fix
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
    chatOnlyMode: true,
    onTranscript: (t: any) => {
      if (t.sender === "AI") {
        handleAiResponse(t);
      }
    },
  });
  await client.start();
}

function handleAiResponse(t: any) {
  // Eğer yeni bir tur başlamışsa ve eski balon temizlenmemişse veya hiç balon yoksa yeni oluştur
  if (!activeAiBubble) {
    activeAiBubble = document.createElement("div");
    activeAiBubble.className = "bubble ai";
    elements.chatBox.appendChild(activeAiBubble);
  }

  // Daktilo efekti ve Markdown render
  activeAiBubble.innerHTML = marked.parse(
    t.text + (t.isFinal ? "" : " ▋"),
  ) as string;
  elements.chatBox.scrollTop = elements.chatBox.scrollHeight;

  // KRİTİK FİX: Cümle bittiğinde referansı temizle ki bir sonraki cevap yeni balona gitsin
  if (t.isFinal) {
    activeAiBubble = null;
  }
}

function sendMessage() {
  const text = elements.msgInput.value.trim();
  if (!text || !client) return;

  // Yeni tur: Kullanıcı balonu
  const uBubble = document.createElement("div");
  uBubble.className = "bubble user";
  uBubble.innerText = text;
  elements.chatBox.appendChild(uBubble);

  // AI cevabı için hazırlık: Eğer havada asılı bir AI balonu varsa mühürle
  activeAiBubble = null;

  client.sendText(text);
  elements.msgInput.value = "";
  elements.chatBox.scrollTop = elements.chatBox.scrollHeight;
}

elements.sendBtn.onclick = sendMessage;
elements.msgInput.onkeypress = (e) => {
  if (e.key === "Enter") sendMessage();
};

initChat();

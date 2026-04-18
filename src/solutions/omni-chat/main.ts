import { getSentiricClient } from "../../lib/sdk-provider";
import { marked } from "marked";

const chatBox = document.getElementById("chatBox")!;
const input = document.getElementById("msgInput") as HTMLInputElement;
let activeBubble: HTMLElement | null = null;
let client: any = null;

async function init() {
  const SDK = await getSentiricClient();
  client = new SDK({
    gatewayUrl: "wss://http-stream-gateway-service-sentiric.azmisahin.com/ws",
    tenantId: "demo",
    chatOnlyMode: true,
    onTranscript: (t: any) => {
      if (t.sender === "AI") {
        if (!activeBubble) {
          activeBubble = document.createElement("div");
          activeBubble.className = "ai-msg";
          chatBox.appendChild(activeBubble);
        }
        activeBubble.innerHTML = marked.parse(t.text + (t.isFinal ? "" : " ▋"));
        if (t.isFinal) activeBubble = null;
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    },
  });
  await client.start();
}

document.getElementById("sendBtn")!.onclick = () => {
  const val = input.value.trim();
  if (!val) return;
  const u = document.createElement("div");
  u.className = "user-msg";
  u.innerText = val;
  chatBox.appendChild(u);
  client.sendText(val);
  input.value = "";
};

init();

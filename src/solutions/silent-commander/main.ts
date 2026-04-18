// [ARCH-COMPLIANCE] SOP-01: Silent Commander (Intent-to-Action) Controller
import {
  getSentiricClient,
  AppConfig,
  injectVersionInfo,
} from "@lib/sdk-provider";

const elements = {
  output: document.getElementById("cmd-output")!,
  btn: document.getElementById("authBtn") as HTMLButtonElement,
  aiStatus: document.getElementById("ai-status")!,
};

let client: any = null;
injectVersionInfo(document.body);

async function toggleCommander() {
  if (client) {
    client.stop();
    client = null;
    elements.btn.classList.remove("active");
    log("> SESSION TERMINATED.");
    return;
  }

  const SDK = await getSentiricClient();
  client = new SDK({
    gatewayUrl: AppConfig.gatewayUrl,
    tenantId: AppConfig.tenantId,
    systemPromptId: "PROMPT_COMMANDER", // AI'ı komut moduna sokar
    onTranscript: (t: any) => {
      handleCommanderInput(t);
    },
  });

  try {
    await client.start();
    elements.btn.classList.add("active");
    log("> VOICE LINK ESTABLISHED.");
    elements.aiStatus.innerText = "LISTENING";
  } catch (err) {
    log("!! ACCESS DENIED: MIC ERROR");
  }
}

function handleCommanderInput(t: any) {
  if (t.sender === "USER") {
    if (t.isFinal) {
      log(`[VOICE_CMD]: ${t.text.toUpperCase()}`);
      elements.aiStatus.innerText = "PROCESSING";
    }
  } else if (t.sender === "AI") {
    if (t.isFinal) {
      const line = document.createElement("div");
      line.className = "exec-line";
      line.innerText = `> EXECUTING: ${t.text}`;
      elements.output.appendChild(line);
      elements.aiStatus.innerText = "IDLE";
      elements.output.scrollTop = elements.output.scrollHeight;
    }
  }
}

function log(msg: string) {
  const div = document.createElement("div");
  div.className = "sys-msg";
  div.innerText = msg;
  elements.output.appendChild(div);
  elements.output.scrollTop = elements.output.scrollHeight;
}

elements.btn.onclick = toggleCommander;

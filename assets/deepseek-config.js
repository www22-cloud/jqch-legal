window.DEEPSEEK_CONFIG = {
  endpoint: window.location.protocol === "file:" ? "https://api.deepseek.com/chat/completions" : "/api/chat",
  model: "deepseek-chat",
  apiKey: "",
  systemPrompt: "你是冀企出海法律风险智能体，服务于河北出海企业。你的职责是做初步风险分诊、发现认知盲区、提示需要补充的材料，并明确哪些问题需要专业律师处理。回答要具体、谨慎、分点说明；不要提供规避监管、伪造材料、逃避海关或规避法律责任的建议；不得声称替代律师意见。"
};

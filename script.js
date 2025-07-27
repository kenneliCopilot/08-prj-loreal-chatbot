// script.js

/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const systemPrompt = {
  role: "system",
  content: `You are an assistant for L’Oréal. Only answer questions about L’Oréal products, skincare, makeup, haircare, and beauty routines. If asked unrelated questions, politely reply that you can only discuss L’Oréal and beauty topics. `,
};
// secrets.js

// Set initial message
chatWindow.textContent = "Hi, this is L’Oréal. How can I assist you today?";

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = userInput.value.trim();
  if (!input) return;

  // 显示用户消息
  const userMsg = document.createElement("div");
  userMsg.className = "msg user";
  userMsg.textContent = input;
  chatWindow.appendChild(userMsg);

  // 清空输入框
  userInput.value = "";

  // 显示 AI 正在思考
  const aiMsg = document.createElement("div");
  aiMsg.className = "msg ai";
  aiMsg.textContent = "Thinking...";
  chatWindow.appendChild(aiMsg);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  // 构造请求消息
  const messages = [systemPrompt, { role: "user", content: input }];

  try {
    const response = await fetch(
      "https://loreal-chat-proxy.mrna.workers.dev/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: messages,
          max_tokens: 200,
        }),
      }
    );

    const data = await response.json();
    console.log("OpenAI Response:", data); // 添加这行！
    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I couldn't understand.";

    aiMsg.textContent = reply;
    chatWindow.scrollTop = chatWindow.scrollHeight;
  } catch (err) {
    aiMsg.textContent = "Something went wrong. Please try again.";
    console.error(err);
  }
});

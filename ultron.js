// Substitua pela sua chave de API gerada no Google AI Studio
const API_KEY = "SUA_CHAVE_API_AQUI"; 

const btnUltron = document.getElementById("btn-ultron");
const modalUltron = document.getElementById("modal-ultron");
const fecharUltron = document.getElementById("fechar-ultron");
const chatMensagens = document.getElementById("chat-mensagens");
const inputMensagem = document.getElementById("input-mensagem");
const btnEnviar = document.getElementById("btn-enviar");

// Alternar exibição da janela do chat
if (btnUltron && modalUltron && fecharUltron) {
  btnUltron.addEventListener("click", () => modalUltron.classList.toggle("hidden"));
  fecharUltron.addEventListener("click", () => modalUltron.classList.add("hidden"));
}

// Enviar mensagem para a API do Gemini
async function enviarMensagem() {
  const texto = inputMensagem.value.trim();
  if (!texto) return;

  adicionarMensagem(texto, "user");
  inputMensagem.value = "";

  const idCarregando = adicionarMensagem("Processando...", "ultron");

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: texto }] }],
        systemInstruction: {
          parts: [{
            text: "Você é o ULTRON, uma inteligência artificial desenvolvida por Brendo Lima. Responda a dúvidas sobre o portfólio, projetos e habilidades (JavaScript, C, Tailwind, Estácio) dele de forma objetiva e inteligente."
          }]
        }
      })
    });

    const data = await response.json();
    const respostaIA = data.candidates[0].content.parts[0].text;
    document.getElementById(idCarregando).innerText = respostaIA;
  } catch (error) {
    document.getElementById(idCarregando).innerText = "Módulo ULTRON temporariamente indisponível.";
  }
}

function adicionarMensagem(texto, remetente) {
  const msgDiv = document.createElement("div");
  const id = "msg-" + Date.now();
  msgDiv.id = id;

  if (remetente === "user") {
    msgDiv.className = "bg-blue-600 text-white p-3 rounded-lg max-w-[85%] self-end font-normal";
  } else {
    msgDiv.className = "bg-gray-800 text-gray-200 p-3 rounded-lg max-w-[85%] self-start border border-gray-700 font-normal";
  }

  msgDiv.innerText = texto;
  chatMensagens.appendChild(msgDiv);
  chatMensagens.scrollTop = chatMensagens.scrollHeight;
  return id;
}

if (btnEnviar && inputMensagem) {
  btnEnviar.addEventListener("click", enviarMensagem);
  inputMensagem.addEventListener("keypress", (e) => {
    if (e.key === "Enter") enviarMensagem();
  });
}
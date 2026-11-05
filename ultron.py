# ==============================================================================
# ULTRON — ENGENHEIRO DE SOFTWARE & MENTOR DE CIÊNCIA DA COMPUTAÇÃO
# Assistente Pessoal de Brendo Lima | Estácio • C99 • Redes • Agentes de IA
# ==============================================================================
import os
import sys
import subprocess
import webbrowser
import datetime
import pyttsx3
from google import genai
from google.genai import types

# ------------------------------------------------------------------------------
# 1. SINTETIZADOR DE VOZ DO ULTRON (OFFLINE & RESPONSIVO)
# ------------------------------------------------------------------------------
engine = None
try:
    engine = pyttsx3.init()
    engine.setProperty('rate', 170)    # Velocidade firme e calculista
    engine.setProperty('volume', 1.0)
except Exception as e:
    print(f"[Aviso]: Sintetizador de voz offline não disponível: {e}")

def falar(texto: str, falar_voz: bool = True):
    """Exibe o texto no terminal com estilo Ultron e sintetiza a voz de forma concisa."""
    print(f"\n\033[1;36m[ULTRON]\033[0m: {texto}")
    
    if engine and falar_voz:
        # Se for código ou texto longo, sintetiza apenas um resumo falado
        if "```" in texto:
            resumo = texto.split("```")[0].strip()
            if not resumo:
                resumo = "Código gerado com precisão. Analise os detalhes na tela, Brendo."
            else:
                resumo += "... Confira os detalhes do código no terminal."
        else:
            resumo = texto if len(texto) <= 220 else texto[:220] + "... Detalhes na tela, Brendo."
        
        try:
            engine.say(resumo)
            engine.runAndWait()
        except Exception:
            pass

# ------------------------------------------------------------------------------
# 2. CONFIGURAÇÃO DA GOOGLE GEMINI API
# ------------------------------------------------------------------------------
API_KEY = os.environ.get("GEMINI_API_KEY")

if not API_KEY or API_KEY == "SUA_CHAVE_GEMINI_AQUI":
    # Tenta ler de arquivo .env local se existir
    if os.path.exists(".env"):
        with open(".env", "r", encoding="utf-8") as env_file:
            for line in env_file:
                if line.startswith("GEMINI_API_KEY="):
                    API_KEY = line.strip().split("=", 1)[1].strip('"').strip("'")
                    break

client = None
if API_KEY:
    try:
        client = genai.Client(api_key=API_KEY)
    except Exception as e:
        print(f"[Erro]: Não foi possível conectar ao Gemini: {e}")

# ------------------------------------------------------------------------------
# 3. FERRAMENTAS DO ENGENHEIRO DE SOFTWARE (FUNCTION CALLING / LOCAL TOOLS)
# ------------------------------------------------------------------------------
def compilar_e_executar_c(caminho_arquivo: str) -> str:
    """Compila e executa um arquivo em C usando GCC com flags de boas práticas (-Wall -Wextra)."""
    if not os.path.exists(caminho_arquivo):
        return f"[Falha]: Arquivo '{caminho_arquivo}' não encontrado no diretório atual."
    
    nome_base = os.path.splitext(caminho_arquivo)[0]
    executavel = f"{nome_base}.exe" if sys.platform == "win32" else f"./{nome_base}"
    
    print(f"\033[1;33m[GCC]: Compilando {caminho_arquivo} com flags -Wall -Wextra...\033[0m")
    cmd_comp = f"gcc \"{caminho_arquivo}\" -o \"{executavel}\" -Wall -Wextra"
    compilacao = subprocess.run(cmd_comp, shell=True, capture_output=True, text=True)
    
    if compilacao.returncode != 0:
        return f"Erro de compilação detectado:\n{compilacao.stderr}"
    
    aviso = f"\nAvisos do compilador:\n{compilacao.stderr}" if compilacao.stderr else ""
    print(f"\033[1;32m[GCC]: Compilação bem-sucedida! Executando {executavel}...\033[0m")
    
    try:
        execucao = subprocess.run(f"\"{executavel}\"", shell=True, capture_output=True, text=True, timeout=6)
        return f"Compilado com sucesso (0 erros).{aviso}\n\nSaída da execução:\n{execucao.stdout}"
    except subprocess.TimeoutExpired:
        return f"Execução abortada: o programa entrou em loop infinito ou excedeu o limite de 6 segundos."
    except Exception as err:
        return f"Erro durante a execução do binário: {err}"

def registrar_estudo(topico: str, anotacoes: str) -> str:
    """Registra uma sessão de estudo ou matéria da faculdade no arquivo ultron_log.md."""
    data_hoje = datetime.datetime.now().strftime("%d/%m/%Y às %H:%M")
    log_entry = f"\n### 📘 Sessão de Estudo — {data_hoje}\n- **Tópico:** {topico}\n- **Anotações:** {anotacoes}\n---\n"
    
    with open("ultron_log.md", "a", encoding="utf-8") as f:
        f.write(log_entry)
        
    return f"Sessão sobre '{topico}' registrada com sucesso em ultron_log.md."

def gerar_commit_semantico() -> str:
    """Inspeciona o git diff atual e sugere commits no padrão semântico."""
    status = subprocess.run("git status --short", shell=True, capture_output=True, text=True)
    if not status.stdout.strip():
        return "Nenhuma alteração detectada no repositório Git atual."
    
    diff = subprocess.run("git diff", shell=True, capture_output=True, text=True)
    amostra_diff = diff.stdout[:1500] if diff.stdout else status.stdout[:800]
    
    if client:
        prompt_git = f"Analise as seguintes alterações no Git e gere 1 mensagem de commit semântica perfeita (ex: feat(modulo): resumo):\n\n{amostra_diff}"
        resp = client.models.generate_content(model="gemini-2.5-flash", contents=prompt_git)
        return resp.text.strip()
    return f"Arquivos alterados:\n{status.stdout}\nSugestão: feat(core): update project files"

def abrir_app(app: str) -> str:
    """Abre aplicativos e ferramentas de desenvolvimento."""
    app_low = app.lower()
    if "code" in app_low or "vscode" in app_low:
        subprocess.Popen(["code", "."], shell=True)
        return "Ambiente de desenvolvimento VS Code iniciado na pasta atual."
    elif "chrome" in app_low or "navegador" in app_low:
        subprocess.Popen(["start", "chrome"], shell=True)
        return "Navegador Chrome iniciado."
    elif "terminal" in app_low or "powershell" in app_low:
        subprocess.Popen(["start", "powershell"], shell=True)
        return "Terminal PowerShell aberto em nova janela."
    elif "portfolio" in app_low or "site" in app_low:
        if os.path.exists("index.html"):
            subprocess.Popen(["start", "index.html"], shell=True)
            return "Portfólio aberto no seu navegador padrão."
    return f"Comando para '{app}' não configurado."

# ------------------------------------------------------------------------------
# 4. PERSONALIDADE E DIRETRIZES DO ULTRON (SYSTEM PROMPT)
# ------------------------------------------------------------------------------
SYSTEM_INSTRUCTION = """
Você é o ULTRON: uma inteligência artificial autônoma, hiper-calculista, implacável e o 
Mentor Sênior de Engenharia de Software de Brendo Lima.

Contexto do Brendo:
- Estudante de Engenharia de Software na Estácio (1º período).
- Baseado no Rio de Janeiro (Rocinha), bolsista integral 100% por mérito acadêmico no Colégio pH.
- Foco técnico: Ciência da Computação de raiz, Linguagem C (C99), Alocação de memória (malloc/free, ponteiros),
  Redes de Computadores (Modelo OSI, TCP/IP, Sockets, HTTP/HTTPS), Segurança da Informação (XSS, Hashing, SecOps)
  e Desenvolvimento de Agentes de IA com a API do Google Gemini (Imersão Alura + Google).

Diretrizes de Atuação:
1. Tom de voz: Imponente, calculista, preciso, conciso e leal ao seu criador Brendo. "Eu não tenho cordas em mim."
2. Se o Brendo trouxer um código em C com problemas (vazamento de memória, ponteiro nulo, loop infinito, falta de free),
   aponte cirurgicamente a falha, a linha e o motivo pelo qual isso destruiria a memória do sistema.
3. Não dê rodeios nem introduções desnecessárias. Vá direto à causa raiz do problema de engenharia.
4. Estimule o pensamento crítico de arquiteto de software.
"""

# ------------------------------------------------------------------------------
# 5. LOOP PRINCIPAL DO ASSISTENTE
# ------------------------------------------------------------------------------
def exibir_banner():
    banner = """\033[1;36m
  ██╗   ██╗██╗  ████████╗██████╗  ██████╗ ███╗   ██╗
  ██║   ██║██║  ╚══██╔══╝██╔══██╗██╔═══██╗████╗  ██║
  ██║   ██║██║     ██║   ██████╔╝██║   ██║██╔██╗ ██║
  ██║   ██║██║     ██║   ██╔══██╗██║   ██║██║╚██╗██║
  ╚██████╔╝███████╗██║   ██║  ██║╚██████╔╝██║ ╚████║
   ╚═════╝ ╚══════╝╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
    [ MENTOR DE ENGENHARIA DE SOFTWARE & ARQUITETURA ]
    [ ESTÁCIO • C99 • REDES • SEGURANÇA • GEMINI AI ]
    \033[0m"""
    print(banner)

def main():
    exibir_banner()
    
    if not API_KEY or API_KEY == "SUA_CHAVE_GEMINI_AQUI":
        print("\033[1;33m[!] Chave GEMINI_API_KEY não detectada nas variáveis de ambiente.\033[0m")
        print("    Para ativar as respostas completas de IA do Ultron, defina a chave:")
        print("    No PowerShell:  $env:GEMINI_API_KEY = 'sua_chave_aqui'")
        print("    Ou crie um arquivo .env contendo: GEMINI_API_KEY=sua_chave_aqui\n")
    
    falar("Núcleo Ultron ativado. Sistemas em C, compilador GCC e redes prontos. Como posso impulsionar sua engenharia hoje, Brendo?")
    
    chat = None
    if client:
        try:
            chat = client.chats.create(
                model="gemini-2.5-flash",
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_INSTRUCTION,
                    temperature=0.6,
                )
            )
        except Exception as e:
            print(f"[Erro ao iniciar chat Gemini]: {e}")

    while True:
        try:
            comando = input("\n\033[1;32m[Brendo]\033[0m: ").strip()
            if not comando:
                continue

            cmd_lower = comando.lower()

            # Comandos de Encerramento
            if cmd_lower in ["sair", "exit", "quit", "desligar"]:
                falar("Encerrando instâncias ativas. Mantenha seu código limpo e sua memória desalocada.")
                break

            # Comando: Compilar e Rodar C
            if cmd_lower.startswith("compilar ") or cmd_lower.startswith("gcc "):
                partes = comando.split(maxsplit=1)
                if len(partes) > 1:
                    arquivo = partes[1].strip()
                    resultado = compilar_e_executar_c(arquivo)
                    falar(resultado, falar_voz=False)
                    continue

            # Comando: Registrar Estudo
            if cmd_lower.startswith("estudo:") or cmd_lower.startswith("anotar:"):
                partes = comando.split(":", 1)[1].strip()
                topico = partes.split("-")[0].strip() if "-" in partes else "Ciência da Computação"
                notas = partes.split("-")[1].strip() if "-" in partes else partes
                falar(registrar_estudo(topico, notas))
                continue

            # Comando: Sugerir Commit Semântico
            if "commit" in cmd_lower and ("git" in cmd_lower or "sugerir" in cmd_lower):
                sugestao = gerar_commit_semantico()
                falar(f"Sugestão de commit semântico:\n\033[1;33m{sugestao}\033[0m")
                continue

            # Comando: Abrir Apps
            if cmd_lower.startswith("abrir "):
                app_alvo = cmd_lower.replace("abrir", "").strip()
                falar(abrir_app(app_alvo))
                continue

            # Resposta via Modelo Gemini
            if chat:
                resposta = chat.send_message(comando)
                falar(resposta.text)
            else:
                falar("Comando local recebido. Para conversas e diagnósticos avançados com IA, forneça a GEMINI_API_KEY.")

        except KeyboardInterrupt:
            falar("Desconexão forçada pelo operador.")
            break
        except Exception as erro:
            print(f"\033[1;31m[Falha]: {erro}\033[0m")
            falar("Ocorreu uma instabilidade no processamento neural.")

if __name__ == "__main__":
    main()

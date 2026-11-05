# Guia Prático: Como Atualizar seu Portfólio & Usar o Ultron

Parabéns pelo seu portfólio de **Engenharia de Software** e pelo seu assistente **Ultron**! Este documento foi feito para você consultar rapidamente sempre que quiser atualizar informações, avançar de período na faculdade ou usar as ferramentas de IA.

---

## 1. Como usar o ULTRON no Terminal (Mentor de Engenharia em C)

O Ultron é o seu copiloto de Ciência da Computação e Engenharia de Software.

### Como iniciar:
No terminal do seu VS Code (na pasta do projeto), rode:
```bash
python ultron.py
```

### O que você pode pedir para ele:
- **Compilar e rodar código em C:**
  Digite: `compilar sample_c_program.c`
  Ele usa o compilador `gcc` com avisos ativados (`-Wall -Wextra`), detecta erros de compilação ou vazamentos e roda o binário automaticamente.
- **Registrar o que estudou na faculdade:**
  Digite: `estudo: Ponteiros e Structs - Pratiquei alocação dinâmica com malloc e free para listas encadeadas`
  Ele salva automaticamente a data e a matéria em `ultron_log.md`.
- **Sugerir mensagem de commit do Git:**
  Digite: `sugerir commit`
  Ele inspeciona suas alterações locais e sugere commits no formato semântico (`feat(...)`, `fix(...)`).
- **Tirar dúvidas conceituais:**
  Pergunte sobre arquitetura de redes (OSI, TCP/IP), complexidade de algoritmos (Big-O) ou padrões de código limpo.

> **Dica da API:** Se quiser ativar as respostas completas de IA do Google Gemini no Ultron, basta definir sua chave gratuita:
> No PowerShell: `$env:GEMINI_API_KEY="sua_chave_aqui"`

---

## 2. O ULTRON no Navegador (Web Widget)

No seu site, há um botão no canto inferior esquerdo chamado **🤖 ULTRON AI**.
- Ao clicar nele, abre uma janela de chat cibernética futurista com som sintetizado.
- Ele já tem chips de perguntas rápidas prontas para recrutadores perguntarem sobre seus projetos, sua graduação na Estácio, sua bolsa no Colégio pH e seu domínio em Linguagem C.
- Ele é controlado pelo arquivo [`ultron.js`](file:///c:/Users/brend/OneDrive/Desktop/primeiro-projeto/meu-portfolio/ultron.js).

---

## 3. Modais de "Ver Arquitetura" nos Projetos

Nos 4 projetos do seu carrossel (**RigDoctor**, **FitHome**, **TaskMaster** e **Agente de IA**), há um novo botão com ícone de camadas (`<i class="fa-solid fa-layer-group"></i>`).
- Ao clicar nele, abre um pop-up de **Engenharia e Arquitetura de Software**.
- Mostra para recrutadores e tech leads:
  1. O problema de engenharia resolvido;
  2. O fluxo de dados e arquitetura técnica;
  3. As decisões de segurança adotadas (sanitização XSS, persistência em localStorage, zero coleta invasiva).
- Os textos de cada projeto ficam centralizados no objeto `dadosArquitetura` dentro de [`Assets/js/script.js`](file:///c:/Users/brend/OneDrive/Desktop/primeiro-projeto/meu-portfolio/Assets/js/script.js).

---

## 4. Como mudar de período (Ex: 1º para 2º período)

No arquivo `index.html`, procure os pontos marcados com comentários em maiúsculas:

1. **No Hero (Apresentação inicial):**
   - Procure por `<!-- [EDITAR PERÍODO / APRESENTAÇÃO] -->` (em torno da linha 130).
   - Mude `(1º período)` para `(2º período)`.

2. **No Terminal de Código em C (Card da direita):**
   - Procure por `<!-- [EDITAR PERÍODO NO TERMINAL] -->` (em torno da linha 200).
   - Mude `"Eng. de Software (1º)"` para `"Eng. de Software (2º)"`.

3. **Na Seção "Sobre Mim":**
   - Procure por `<!-- [EDITAR PERÍODO NO TEXTO] -->` e no card de resumo.
   - Atualize `1º período` para `2º período`.

4. **Na Linha do Tempo ("Trajetória"):**
   - Procure por `<!-- [EDITAR PERÍODO NA TRAJETÓRIA] -->`.
   - Atualize o título para `Engenharia de Software (2º Período)`.

---

## 5. Como adicionar um novo projeto no carrossel

1. Localize a div `<div class="projects-track" id="projectsTrack">` no `index.html`.
2. Duplique um bloco `<article class="project-card">...</article>`.
3. Altere o título, a descrição, as tags e os links.
4. No container `<div class="carousel-dots" id="projectDots">`, adicione mais um botão:
   ```html
   <button data-slide="4" aria-label="Projeto 5"></button>
   ```

O carrossel reconhece e calcula a rolagem automaticamente!

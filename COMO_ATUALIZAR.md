# Guia Prático: Como Atualizar seu Portfólio

Parabéns pelo seu portfólio de **Engenharia de Software**! Este documento foi feito para você consultar rapidamente sempre que quiser atualizar informações, avançar de período na faculdade ou adicionar novos projetos.

---

## 1. Como mudar de período (Ex: 1º para 2º período)

No arquivo `index.html`, você encontra os pontos marcados com comentários em maiúsculas:

1. **No Hero (Apresentação inicial):**
   - Procure por `<!-- [EDITAR PERÍODO / APRESENTAÇÃO] -->` (em torno da linha 130).
   - Mude `(1º período)` para `(2º período)`.

2. **No Terminal de Código em C (Card da direita):**
   - Procure por `<!-- [EDITAR PERÍODO NO TERMINAL] -->` (em torno da linha 200).
   - Mude `"Eng. de Software (1º)"` para `"Eng. de Software (2º)"`.

3. **Na Seção "Sobre Mim":**
   - Procure por `<!-- [EDITAR PERÍODO NO TEXTO] -->` (em torno da linha 260) e no card de resumo (em torno da linha 285).
   - Atualize `1º período` para `2º período`.

4. **Na Linha do Tempo ("Trajetória"):**
   - Procure por `<!-- [EDITAR PERÍODO NA TRAJETÓRIA] -->` (em torno da linha 400).
   - Atualize o título para `Engenharia de Software (2º Período)`.

---

## 2. Como adicionar um novo projeto no carrossel

Dentro de `index.html`, na seção `<section class="projects section" id="projetos">`:

1. Localize a div `<div class="projects-track" id="projectsTrack">`.
2. Basta copiar um bloco `<article class="project-card">...</article>` existente e colar antes ou depois.
3. Modifique:
   - O título: `<h3>Nome do Projeto</h3>`
   - A descrição: o texto em `<span class="lang-pt">` e `<span class="lang-en">`
   - O link do GitHub: `<a href="https://github.com/BRENDOice/novo-projeto">`
   - O link da Live Demo: `<a href="https://brendoice.github.io/novo-projeto/">`
   - As tags de tecnologia: `<span>React</span>`, `<span>TypeScript</span>`, etc.
4. Logo abaixo do carrossel, no container `<div class="carousel-dots" id="projectDots">`, adicione um novo botão de indicador:
   ```html
   <button data-slide="4" aria-label="Projeto 5"></button>
   ```

O JavaScript do carrossel reconhece automaticamente o novo projeto, ajusta a rolagem touch e os botões de próxima/anterior sem precisar alterar nenhuma linha de código JS!

---

## 3. Segurança e Formulário de Contato

1. **Honeypot Integrado:**
   - O formulário já contém a proteção anti-bot invisível:
     ```html
     <input type="checkbox" name="botcheck" class="hidden" style="display: none;">
     ```
   - Bots que preencherem o formulário automaticamente são bloqueados.

2. **Chave do Web3Forms:**
   - O site está configurado para receber mensagens com o serviço gratuito Web3Forms.
   - Se quiser que as mensagens cheguem diretamente na sua caixa de entrada, crie uma chave gratuita no site [web3forms.com](https://web3forms.com) com o seu e-mail (`brendolimadefreitas@gmail.com`) e substitua o valor do campo:
     ```html
     <input type="hidden" name="access_key" value="SUA_CHAVE_AQUI">
     ```
   - No painel deles, marque a opção para permitir envios apenas do seu domínio (ex: `brendoice.github.io`) para blindar contra qualquer uso indevido.

---

## 4. Como colocar seu Currículo em PDF para download

1. Salve seu currículo em formato PDF com o nome:
   `cv-brendo-lima.pdf`
2. Coloque esse arquivo dentro da pasta `Assets/`.
3. O botão **Currículo / Resume** no topo do site já está apontado para `./Assets/cv-brendo-lima.pdf`.

/* ==========================================================================
   PORTFÓLIO BRENDO LIMA — JAVASCRIPT DE ALTA PERFORMANCE & SEGURANÇA
   ========================================================================== */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isDesktopPointer = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1001px)").matches;

  /* ==========================================================================
     1. LOADER DE INICIALIZAÇÃO
     ========================================================================== */
  const loader = $("#loader");
  const hideLoader = () => window.setTimeout(() => loader?.classList.add("hide"), 350);
  if (document.readyState === "complete") {
    hideLoader();
  } else {
    window.addEventListener("load", hideLoader, { once: true });
  }
  // Failsafe de 2.5s para conexões lentas
  window.setTimeout(() => loader?.classList.add("hide"), 2500);

  /* ==========================================================================
     2. EFEITO DE TEXTO DIGITADO (BILÍNGUE)
     ========================================================================== */
  const typingElement = $("#typing");
  const phrasesPt = [
    "estudante de engenharia de software.",
    "desenvolvedor web.",
    "programador em C.",
    "focado em segurança da informação."
  ];
  const phrasesEn = [
    "software engineering student.",
    "web developer.",
    "C programmer.",
    "focused on information security."
  ];

  let currentLang = "pt";
  try {
    currentLang = localStorage.getItem("portfolio_lang") || "pt";
  } catch (_) {}

  let wordIndex = 0,
    charIndex = 0,
    deleting = false,
    typingTimer = null;

  function typeEffect() {
    if (!typingElement) return;
    const words = currentLang === "en" ? phrasesEn : phrasesPt;
    const word = words[wordIndex % words.length];

    charIndex += deleting ? -1 : 1;
    typingElement.textContent = word.slice(0, charIndex);

    let delay = deleting ? 36 : 75;

    if (!deleting && charIndex >= word.length) {
      deleting = true;
      delay = 1800; // Pausa no final da frase
    } else if (deleting && charIndex <= 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 350;
    }

    typingTimer = window.setTimeout(typeEffect, reducedMotion ? 2000 : delay);
  }

  function resetTyping() {
    if (typingTimer) clearTimeout(typingTimer);
    charIndex = 0;
    deleting = false;
    typeEffect();
  }

  /* ==========================================================================
     3. ALTERNADOR DE IDIOMA (PT / EN)
     ========================================================================== */
  function setLanguage(lang) {
    currentLang = lang;
    try {
      localStorage.setItem("portfolio_lang", lang);
    } catch (_) {}

    document.documentElement.lang = lang === "en" ? "en" : "pt-BR";

    const btnPt = $("#btn-pt");
    const btnEn = $("#btn-en");

    if (lang === "en") {
      btnEn?.classList.add("active");
      btnPt?.classList.remove("active");
    } else {
      btnPt?.classList.add("active");
      btnEn?.classList.remove("active");
    }

    resetTyping();
  }

  $("#btn-pt")?.addEventListener("click", () => setLanguage("pt"));
  $("#btn-en")?.addEventListener("click", () => setLanguage("en"));
  setLanguage(currentLang);

  /* ==========================================================================
     4. TEMA CLARO / ESCURO (COM PERSISTÊNCIA)
     ========================================================================== */
  const themeBtn = $("#themeBtn");
  let savedTheme = "dark";
  try {
    savedTheme = localStorage.getItem("theme") || "dark";
  } catch (_) {}

  if (savedTheme === "light") {
    document.body.classList.add("light");
  }

  function updateThemeIcon() {
    if (!themeBtn) return;
    const isLight = document.body.classList.contains("light");
    themeBtn.innerHTML = isLight
      ? '<i class="fa-solid fa-sun" aria-hidden="true"></i>'
      : '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
    themeBtn.setAttribute("aria-label", isLight ? "Ativar tema escuro" : "Ativar tema claro");
  }

  updateThemeIcon();

  themeBtn?.addEventListener("click", () => {
    document.body.classList.toggle("light");
    const theme = document.body.classList.contains("light") ? "light" : "dark";
    try {
      localStorage.setItem("theme", theme);
    } catch (_) {}
    updateThemeIcon();
  });

  /* ==========================================================================
     5. MENU MOBILE ACESSÍVEL
     ========================================================================== */
  const menuBtn = $("#menuBtn");
  const nav = $("#nav");

  function closeMenu() {
    menuBtn?.classList.remove("open");
    nav?.classList.remove("open");
    menuBtn?.setAttribute("aria-expanded", "false");
    menuBtn?.setAttribute("aria-label", "Abrir menu");
  }

  menuBtn?.addEventListener("click", () => {
    const open = !nav?.classList.contains("open");
    nav?.classList.toggle("open", open);
    menuBtn?.classList.toggle("open", open);
    menuBtn?.setAttribute("aria-expanded", String(open));
    menuBtn?.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  });

  $$(".nav-link").forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (e) => {
    if (nav?.classList.contains("open") && !nav.contains(e.target) && !menuBtn?.contains(e.target)) {
      closeMenu();
    }
  });

  window.addEventListener(
    "resize",
    () => {
      if (window.innerWidth > 800) closeMenu();
    },
    { passive: true }
  );

  /* ==========================================================================
     6. SCROLL LISTENER (HEADER SCROLLED & BOTÃO VOLTAR AO TOPO)
     ========================================================================== */
  const header = $("#header");
  const backTop = $("#backTop");
  let scrollQueued = false;

  function updateOnScroll() {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(() => {
      header?.classList.toggle("scrolled", window.scrollY > 30);
      backTop?.classList.toggle("show", window.scrollY > 400);
      scrollQueued = false;
    });
  }

  window.addEventListener("scroll", updateOnScroll, { passive: true });
  updateOnScroll();

  backTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  });

  /* ==========================================================================
     7. SCROLL REVEAL (INTERSECTION OBSERVER COM FALLBACK IMEDIATO)
     ========================================================================== */
  const revealElements = $$(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px 50px 0px" }
    );
    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("show"));
  }

  // Garante que o conteúdo do Hero fique visível imediatamente
  $$(".hero .reveal").forEach((el) => el.classList.add("show"));

  /* ==========================================================================
     8. LINK ATIVO NA NAVEGAÇÃO (SCROLLSPY)
     ========================================================================== */
  const navLinks = $$(".nav-link");
  const sections = $$("main section[id]");
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) =>
            link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`)
          );
        });
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    sections.forEach((sec) => sectionObserver.observe(sec));
  }

  /* ==========================================================================
     9. GERADOR DE PARTÍCULAS CIBERNÉTICAS
     ========================================================================== */
  const particlesContainer = $("#particles");
  if (particlesContainer && !reducedMotion) {
    const count = window.innerWidth < 480 ? 8 : window.innerWidth < 800 ? 14 : 26;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const particle = document.createElement("span");
      particle.className = "particle";
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${12 + Math.random() * 12}s`;
      particle.style.animationDelay = `${Math.random() * -18}s`;
      fragment.appendChild(particle);
    }
    particlesContainer.appendChild(fragment);
  }

  /* ==========================================================================
     10. FORMULÁRIO DE CONTATO SEGURO COM HONEYPOT
     ========================================================================== */
  const contactForm = $("#contactForm");
  const formMessage = $("#formMessage");

  contactForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const honeypot = contactForm.querySelector('input[name="botcheck"]');
    if (honeypot && honeypot.checked) {
      console.warn("[Security] Envio bloqueado por Honeypot.");
      return;
    }

    const button = $(".send-btn", contactForm);
    if (!button) return;

    const originalHTML = button.innerHTML;
    button.disabled = true;
    button.innerHTML = currentLang === "en" 
      ? 'Sending... <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>' 
      : 'Enviando... <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>';

    if (formMessage) formMessage.textContent = "";

    try {
      const formData = new FormData(contactForm);
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Erro no envio.");
      }

      if (formMessage) {
        formMessage.textContent = currentLang === "en"
          ? "Message sent successfully! I will reply soon."
          : "Mensagem enviada com sucesso! Responderei em breve.";
        formMessage.style.color = "#00f0ff";
      }
      contactForm.reset();
    } catch (err) {
      console.error("Falha no envio:", err);
      if (formMessage) {
        formMessage.textContent = currentLang === "en"
          ? "Could not send right now. Please email directly or try again."
          : "Não foi possível enviar agora. Envie um e-mail direto ou tente novamente.";
        formMessage.style.color = "#ef4444";
      }
    } finally {
      button.disabled = false;
      button.innerHTML = originalHTML;
    }
  });

  /* ==========================================================================
     11. CURSOR PERSONALIZADO DESKTOP (CROSSHAIR & GLOW)
     ========================================================================== */
  if (isDesktopPointer && !reducedMotion) {
    document.body.classList.add("custom-cursor");

    const glow = document.createElement("div");
    const follower = document.createElement("div");
    glow.className = "mouse-glow";
    follower.className = "mouse-follower";
    document.body.append(glow, follower);

    let x = window.innerWidth / 2,
      y = window.innerHeight / 2,
      fx = x,
      fy = y,
      gx = x,
      gy = y,
      started = false;

    document.addEventListener(
      "mousemove",
      (e) => {
        x = e.clientX;
        y = e.clientY;
        document.documentElement.style.setProperty("--mouse-x", `${x}px`);
        document.documentElement.style.setProperty("--mouse-y", `${y}px`);

        if (!started) {
          started = true;
          glow.classList.add("active");
          follower.classList.add("active");
        }
      },
      { passive: true }
    );

    const animateMouse = () => {
      fx += (x - fx) * 0.18;
      fy += (y - fy) * 0.18;
      gx += (x - gx) * 0.07;
      gy += (y - gy) * 0.07;

      follower.style.transform = `translate3d(${fx}px, ${fy}px, 0) translate(-50%, -50%)`;
      glow.style.transform = `translate3d(${gx}px, ${gy}px, 0) translate(-50%, -50%)`;

      requestAnimationFrame(animateMouse);
    };
    animateMouse();

    $$("a, button, .skill-card, .project-card, .about-info div").forEach((el) => {
      el.addEventListener("mouseenter", () => follower.classList.add("hover"));
      el.addEventListener("mouseleave", () => follower.classList.remove("hover"));
    });

    document.addEventListener("mouseleave", () => {
      glow.classList.remove("active");
      follower.classList.remove("active");
    });
    document.addEventListener("mouseenter", () => {
      if (started) {
        glow.classList.add("active");
        follower.classList.add("active");
      }
    });
  }

  /* ==========================================================================
     12. PARALLAX NO HERO VISUAL (DESKTOP)
     ========================================================================== */
  const heroVisual = $(".hero-visual");
  if (heroVisual && window.innerWidth > 1100 && !reducedMotion && isDesktopPointer) {
    let targetX = 0,
      targetY = 0,
      currX = 0,
      currY = 0,
      framePending = false;

    document.addEventListener(
      "mousemove",
      (e) => {
        targetX = (window.innerWidth / 2 - e.clientX) / 120;
        targetY = (window.innerHeight / 2 - e.clientY) / 120;

        if (framePending) return;
        framePending = true;

        requestAnimationFrame(() => {
          currX += (targetX - currX) * 0.05;
          currY += (targetY - currY) * 0.05;
          heroVisual.style.translate = `${currX}px ${currY}px`;
          framePending = false;
        });
      },
      { passive: true }
    );
  }

  /* ==========================================================================
     13. CARROSSEL DE PROJETOS (TOUCH + CLIQUE + RESIZE)
     ========================================================================== */
  const track = $("#projectsTrack");
  const prev = $("#projectPrev");
  const next = $("#projectNext");
  const dotsContainer = $("#projectDots");
  const dots = dotsContainer ? $$("button", dotsContainer) : [];
  let currentProject = 0;

  const cards = () => (track ? $$(".project-card", track) : []);

  function updateCarousel(smooth = true) {
    const allCards = cards();
    if (!track || !allCards.length) return;

    currentProject = Math.max(0, Math.min(currentProject, allCards.length - 1));
    const card = allCards[currentProject];

    track.scrollTo({
      left: card.offsetLeft - allCards[0].offsetLeft,
      behavior: smooth && !reducedMotion ? "smooth" : "auto",
    });

    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === currentProject);
      dot.setAttribute("aria-current", idx === currentProject ? "true" : "false");
    });
  }

  next?.addEventListener("click", () => {
    const allCards = cards();
    if (!allCards.length) return;
    currentProject = (currentProject + 1) % allCards.length;
    updateCarousel();
  });

  prev?.addEventListener("click", () => {
    const allCards = cards();
    if (!allCards.length) return;
    currentProject = (currentProject - 1 + allCards.length) % allCards.length;
    updateCarousel();
  });

  dots.forEach((dot, idx) =>
    dot.addEventListener("click", () => {
      currentProject = idx;
      updateCarousel();
    })
  );

  let touchStartX = 0;
  track?.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].clientX;
    },
    { passive: true }
  );

  track?.addEventListener(
    "touchend",
    (e) => {
      const delta = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(delta) < 45) return;
      const allCards = cards();
      if (!allCards.length) return;
      currentProject =
        delta > 0
          ? (currentProject + 1) % allCards.length
          : (currentProject - 1 + allCards.length) % allCards.length;
      updateCarousel();
    },
    { passive: true }
  );

  window.addEventListener("resize", () => updateCarousel(false), { passive: true });

  /* ==========================================================================
     14. EASTER EGG NO CONSOLE DO DESENVOLVEDOR (F12)
     ========================================================================== */
  console.log(
    "%c <Brendo Lima /> %c Engenharia de Software ",
    "background: #00f0ff; color: #02040a; font-size: 15px; font-weight: bold; padding: 6px 12px; border-radius: 4px;",
    "background: #050a17; color: #38bdf8; font-size: 13px; font-weight: bold; padding: 6px 10px; border-radius: 4px;"
  );
  console.log(
    "%c[+] Status: %cGraduando em Engenharia de Software (1º Período - Estácio)",
    "color: #00f0ff; font-weight: bold;",
    "color: #f8fafc;"
  );
  console.log(
    "%c[+] Local:  %cRio de Janeiro, RJ (Rocinha)",
    "color: #00f0ff; font-weight: bold;",
    "color: #f8fafc;"
  );
  console.log(
    "%c[+] Stack:  %cLinguagem C (C99), Web Frontend, Redes & Segurança",
    "color: #00f0ff; font-weight: bold;",
    "color: #f8fafc;"
  );
  console.log(
    "%c[+] Contato:%c brendolimadefreitas@gmail.com",
    "color: #00f0ff; font-weight: bold;",
    "color: #38bdf8;"
  );
});

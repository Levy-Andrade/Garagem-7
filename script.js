/* =============================================================
   GARAGE 7 — script.js  [REFATORADO]
   PAPEL: Lógica principal da landing page. Controla slider,
   menu mobile, scroll suave, modal de serviços, FAQ e
   animações de scroll reveal.

   ALTERAÇÕES DESTA VERSÃO:
     1. servicesData agora inclui a chave "icon" em cada
        serviço para preencher corretamente o modalIcon.
        O código original chamava modalIcon.className sem
        garantir que a chave existia no objeto.
     2. Nenhuma funcionalidade removida; todas as correções
        anteriores mantidas (modalImage → modalVideo,
        preload removido, Esc listener único, whatsapp-float
        sem inline style).
============================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =========================================================
       A. ELEMENTOS GLOBAIS
       → Selecionados uma única vez e reutilizados em todo o script
    ========================================================= */

    const header      = document.querySelector(".header");
    const modal       = document.getElementById("serviceModal");
    const mobileMenu  = document.querySelector(".mobile-menu");
    const menuOverlay = document.querySelector(".menu-overlay");


    /* =========================================================
       B. HEADER — EFEITO DE SCROLL
       → Escurece o fundo do header ao rolar além de 80px
       → Disparado em "scroll" e também na inicialização
    ========================================================= */

    function handleHeaderScroll() {
        if (!header) return;

        if (window.scrollY > 80) {
            header.style.background = "rgba(0,0,0,0.90)";
            header.style.boxShadow  = "0 10px 30px rgba(0,0,0,.35)";
        } else {
            header.style.background = "rgba(0,0,0,.45)";
            header.style.boxShadow  = "none";
        }
    }

    window.addEventListener("scroll", handleHeaderScroll);
    handleHeaderScroll();


    /* =========================================================
       C. HERO SLIDER
       → Controla slides, dots, botões prev/next e autoplay
    ========================================================= */

    const slides   = document.querySelectorAll(".slide");
    const dots     = document.querySelectorAll(".dot");
    const nextBtn  = document.querySelector(".next");
    const prevBtn  = document.querySelector(".prev");

    let currentSlide   = 0;
    let sliderInterval = null;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove("active"));
        dots.forEach(dot   => dot.classList.remove("active"));

        slides[index].classList.add("active");
        dots[index].classList.add("active");

        currentSlide = index;
    }

    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }

    function prevSlide() {
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prevIndex);
    }

    function startSlider() {
        sliderInterval = setInterval(nextSlide, 5000);
    }

    function restartSlider() {
        clearInterval(sliderInterval);
        startSlider();
    }

    if (nextBtn) nextBtn.addEventListener("click", () => { nextSlide(); restartSlider(); });
    if (prevBtn) prevBtn.addEventListener("click", () => { prevSlide(); restartSlider(); });

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => { showSlide(index); restartSlider(); });
    });

    if (slides.length > 0) {
        showSlide(0);
        startSlider();
    }


    /* =========================================================
       D. MENU MOBILE LATERAL
       → Abre: .mobile-menu-btn
       → Fecha: .close-menu | .menu-overlay | links | tecla Esc
    ========================================================= */

    const mobileBtn    = document.querySelector(".mobile-menu-btn");
    const closeMenuBtn = document.querySelector(".close-menu");
    const mobileLinks  = document.querySelectorAll(".mobile-menu a");

    function openMobileMenu() {
        mobileMenu.classList.add("active");
        menuOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove("active");
        menuOverlay.classList.remove("active");
        document.body.style.overflow = "auto";
    }

    if (mobileBtn)    mobileBtn.addEventListener("click", openMobileMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener("click", closeMobileMenu);
    if (menuOverlay)  menuOverlay.addEventListener("click", closeMobileMenu);

    mobileLinks.forEach(link => link.addEventListener("click", closeMobileMenu));


    /* =========================================================
       E. SCROLL SUAVE (SMOOTH SCROLL)
       → Para links internos (#ancora) no header e no logo
       → Desconta a altura do header fixo (80px)
    ========================================================= */

    const navLinks = document.querySelectorAll(".nav-links a, .logo");

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const href = link.getAttribute("href");
            if (!href || !href.startsWith("#")) return;

            e.preventDefault();

            const target = document.querySelector(href);
            if (!target) return;

            const offset = 80;
            window.scrollTo({
                top: target.offsetTop - offset,
                behavior: "smooth"
            });

            closeMobileMenu();
        });
    });


    /* =========================================================
       F. DADOS DOS SERVIÇOS
       → Objeto central que alimenta o modal.
       → "videoSrc": caminho do vídeo local
       → "icon": classe Font Awesome usada em modalIcon
                 CORREÇÃO: chave "icon" adicionada a todos os
                 serviços para evitar erro ao setar className.
       → "whatsappMsg": texto pré-preenchido no WhatsApp
    ========================================================= */

    const WHATSAPP_NUMBER = "5544991698192";

    const servicesData = {

        lavagem: {
            title: "Lavagem Detalhada",
            icon: "fa-soap",
            videoSrc: "assets/videos/lavagem detalhada.mp4",
            description:
                "A lavagem detalhada é realizada utilizando técnicas seguras e produtos " +
                "específicos para remover sujeiras, resíduos e contaminantes sem agredir " +
                "a pintura. O processo inclui limpeza externa completa, rodas, caixas de " +
                "roda, acabamento em plásticos e inspeção detalhada das superfícies.",
            whatsappMsg: "Olá! Gostaria de agendar uma Lavagem Detalhada."
        },

        enceramento: {
            title: "Enceramento Técnico",
            icon: "fa-star",
            videoSrc: "assets/videos/encerramento tecnico.mp4",
            description:
                "Aplicação profissional de cera de alta performance para aumentar o brilho " +
                "da pintura e criar uma camada de proteção contra raios UV, chuva ácida, " +
                "poeira e contaminantes do ambiente.",
            whatsappMsg: "Olá! Gostaria de agendar um Enceramento Técnico."
        },

        higienizacao: {
            title: "Higienização Interna",
            icon: "fa-spray-can",
            videoSrc: "assets/videos/higienizaçao interna.mp4",
            description:
                "Limpeza profunda de bancos, carpetes, teto, painéis e acabamentos internos. " +
                "Utilizamos equipamentos especializados para remover sujeiras, manchas, odores " +
                "e microrganismos.",
            whatsappMsg: "Olá! Gostaria de agendar uma Higienização Interna."
        },

        polimento: {
            title: "Polimento Automotivo",
            icon: "fa-circle-notch",
            videoSrc: "assets/videos/polimento automotivo.mp4",
            description:
                "Processo realizado em etapas para corrigir micro riscos, marcas superficiais " +
                "e defeitos na pintura. O resultado é um acabamento com brilho intenso e " +
                "aspecto renovado.",
            whatsappMsg: "Olá! Gostaria de agendar um Polimento Automotivo."
        },

        vitrificacao: {
            title: "Vitrificação Automotiva",
            icon: "fa-shield-halved",
            videoSrc: "assets/videos/vitrificação.mp4",
            description:
                "Aplicação de revestimento cerâmico de alta resistência que protege a pintura " +
                "contra agentes externos, facilita a limpeza e proporciona brilho prolongado.",
            whatsappMsg: "Olá! Gostaria de agendar uma Vitrificação."
        },

        "micro-pintura": {
            title: "Micro Pintura",
            icon: "fa-paint-brush",
            videoSrc: "assets/videos/micro pintura.mp4",
            description:
                "Correção localizada de pequenos riscos, arranhões e imperfeições da pintura " +
                "utilizando técnicas precisas para restaurar o acabamento original do veículo.",
            whatsappMsg: "Olá! Gostaria de agendar uma Micro Pintura."
        }

    };


    /* =========================================================
       G. MODAL DE SERVIÇOS
       → openModal(serviceKey): lê servicesData[serviceKey],
         preenche todos os campos e exibe com .active.
       → closeModalFunction(): remove .active e restaura scroll.
    ========================================================= */

    const modalTitle       = document.getElementById("modalTitle");
    const modalVideo       = document.getElementById("modalVideo");
    const modalDescription = document.getElementById("modalDescription");
    const modalWhatsapp    = document.getElementById("modalWhatsapp");
    const modalIcon        = document.getElementById("modalIcon");
    const closeModalBtn    = document.querySelector(".close-modal");
    const serviceButtons   = document.querySelectorAll(".service-btn");

    function openModal(serviceKey) {
        const service = servicesData[serviceKey];
        if (!service) {
            console.warn(`[Garage7] Serviço não encontrado: "${serviceKey}"`);
            return;
        }

        /* Preenche o título */
        modalTitle.textContent = service.title;

        /* Preenche a descrição */
        modalDescription.textContent = service.description;

        /*
         * CORREÇÃO: "icon" garantido em todos os serviços do objeto.
         * Classe composta: "fas " + service.icon (ex.: "fas fa-soap")
         */
        if (modalIcon && service.icon) {
            modalIcon.className = `fas ${service.icon}`;
        }

        /* Atualiza o <source> dentro do <video> e recarrega */
        const videoSource = modalVideo.querySelector("source");
        videoSource.src   = service.videoSrc;
        modalVideo.load();

        /* Atualiza o link do WhatsApp com mensagem pré-preenchida */
        const encodedMsg = encodeURIComponent(service.whatsappMsg);
        modalWhatsapp.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`;

        /* Exibe o modal */
        modal.classList.add("active");
        document.body.style.overflow = "hidden";

        /* Foca o botão de fechar para acessibilidade */
        setTimeout(() => closeModalBtn && closeModalBtn.focus(), 50);
    }

    function closeModalFunction() {
        modal.classList.remove("active");
        document.body.style.overflow = "auto";

        /* Pausa o vídeo ao fechar para evitar áudio residual */
        modalVideo.pause();
    }

    /* Botões "Saber Mais" nos cards de serviço */
    serviceButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            openModal(button.dataset.service);
        });
    });

    /* Clique no card (fora do botão) também abre o modal */
    const serviceCards = document.querySelectorAll(".service-card");

    serviceCards.forEach(card => {
        card.addEventListener("click", () => {
            const button = card.querySelector(".service-btn");
            if (!button) return;
            openModal(button.dataset.service);
        });
    });

    /* Botão × no modal */
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", closeModalFunction);
    }

    /* Clique fora do conteúdo do modal fecha-o */
    if (modal) {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) closeModalFunction();
        });
    }


    /* =========================================================
       H. EVENTOS GLOBAIS DE TECLADO
       → Tecla Esc: fecha modal OU menu mobile
       (listener único — sem duplicatas)
    ========================================================= */

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;

        if (modal && modal.classList.contains("active")) {
            closeModalFunction();
        }

        if (mobileMenu && mobileMenu.classList.contains("active")) {
            closeMobileMenu();
        }
    });


    /* =========================================================
       I. SCROLL REVEAL
       → Adiciona .reveal a elementos definidos no seletor.
       → IntersectionObserver adiciona .active quando o elemento
         entra em 85% da viewport.
    ========================================================= */

    const revealSelector = [
        ".section-title",
        ".about-image",
        ".about-content",
        ".service-card",
        ".team-image",
        ".team-content",
        ".contact-map",
        ".contact-social"
    ].join(", ");

    const revealElements = document.querySelectorAll(revealSelector);

    revealElements.forEach(el => el.classList.add("reveal"));

    function revealOnScroll() {
        const trigger = window.innerHeight * 0.85;
        revealElements.forEach(el => {
            if (el.getBoundingClientRect().top < trigger) {
                el.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll();


    /* =========================================================
       J. FAQ — ACORDEÃO
       → Abre e fecha perguntas frequentes via classe .active
    ========================================================= */

    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {
        const button = item.querySelector(".faq-question");

        button.addEventListener("click", () => {
            /* Fecha todos os outros itens antes de abrir o clicado */
            faqItems.forEach(other => {
                if (other !== item) other.classList.remove("active");
            });
            item.classList.toggle("active");
        });
    });


    /* =========================================================
       K. LOG DE INICIALIZAÇÃO
    ========================================================= */

    console.log(
        "%cGarage 7 | Inicializado com sucesso ✓",
        "color:#E10600;font-size:14px;font-weight:bold;"
    );

});
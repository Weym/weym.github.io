feather.replace();

const toggleButton = document.querySelector('.center-circle');
const menuList = document.querySelector('.circle-menu');

toggleButton.addEventListener('click', () => {
    menuList.classList.toggle('menu-active');
});

document.addEventListener("DOMContentLoaded", () => {
    // FOOTER
    // 1. Tenta encontrar os elementos
    const footer = document.querySelector('.footer');
    const sidebarLeft = document.querySelector('.sidebar--left');
    const sidebarRight = document.querySelector('.sidebar--right');

    // DEBUG: Verifica se achou os elementos
    if (!footer) {
        console.error("ERRO: Não encontrei nenhum elemento com a classe '.footer'");
        return;
    }
    console.log("Sistema pronto: Footer e Sidebars encontrados.");

    // 2. Configura o Observador
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log("ENTROU: O footer apareceu na tela!");

                console.log(sidebarLeft)
                sidebarLeft.classList.add('rotate-sidebar-left');
                sidebarRight.classList.add('rotate-sidebar-right');
                console.log(sidebarLeft)
                // Adiciona classe para esconder sidebars

                // Adiciona classe para animar footer
                footer.classList.add('animate-in');

            } else {
                console.log("SAIU: O footer saiu da tela.");

                // Remove as classes (reseta o estado)
                sidebarLeft.classList.remove('rotate-sidebar-left');
                sidebarRight.classList.remove('rotate-sidebar-right');
                footer.classList.remove('animate-in');
            }
        });
    }, {
        // Ajuste: threshold menor para garantir que detecte logo que uma pontinha apareça
        threshold: 0.5
    });

    footerObserver.observe(footer);


    // --- Lógica do Slider de Blog (Drag & Scroll) ---
    // TODO: add snap-in-place
    const slider = document.querySelector('.blog__slider-container');
    let isDown = false;
    let startX;
    let scrollLeft;

    if (slider) {
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');

            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        const stopDragging = () => {
            isDown = false;
            slider.classList.remove('active');
        };

        slider.addEventListener('mouseleave', stopDragging);
        slider.addEventListener('mouseup', stopDragging);

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX);
            slider.scrollLeft = scrollLeft - walk;
        });
    }



    // Seleciona todas as sections que têm o atributo data-theme
    const sections = document.querySelectorAll("section[data-theme]");

    const observerOptions = {
        root: null,
        rootMargin: "-50% 0px -50% 0px",
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log("Sessão ativa:", entry.target.id); // Para debug no F12

                const theme = entry.target.getAttribute("data-theme");

                if (theme === "dark") {
                    document.body.classList.add("dark-mode");

                } else {
                    document.body.classList.remove("dark-mode");
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});
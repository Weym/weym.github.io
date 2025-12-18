/* =========================================
   MENU TOGGLE LOGIC
   ========================================= */
const toggleButton = document.querySelector('.center-circle');
const menuList = document.querySelector('.circle-menu');

toggleButton.addEventListener('click', () => {
    menuList.classList.toggle('menu-active');
});

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       FOOTER ANIMATION (SIDEBAR ROTATION)
       ========================================= */
    const footer = document.querySelector('.footer');
    const sidebarLeft = document.querySelector('.sidebar--left');
    const sidebarRight = document.querySelector('.sidebar--right');

    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                sidebarLeft.classList.add('rotate-sidebar-left');
                sidebarRight.classList.add('rotate-sidebar-right');
                footer.classList.add('animate-in');
            } else {
                sidebarLeft.classList.remove('rotate-sidebar-left');
                sidebarRight.classList.remove('rotate-sidebar-right');
                footer.classList.remove('animate-in');
            }
        });
    }, {
        threshold: 0.5
    });

    if (footer) footerObserver.observe(footer);

    /* =========================================
       BLOG SLIDER (DRAG TO SCROLL)
       ========================================= */
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

    /* =========================================
       THEME SWITCHING (DARK/LIGHT MODE)
       ========================================= */
    const sections = document.querySelectorAll("section[data-theme]");

    const observerOptions = {
        root: null,
        rootMargin: "-50% 0px -50% 0px",
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
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
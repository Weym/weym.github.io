feather.replace();

const toggleButton = document.querySelector('.center-circle');
const menuList = document.querySelector('.circle-menu');

toggleButton.addEventListener('click', () => {
    // We toggle the class on the parent container
    menuList.classList.toggle('menu-active');
});


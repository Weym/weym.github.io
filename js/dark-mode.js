const toggleBtn = document.getElementById('theme-toggle');
const body = document.body;

const darkThemeSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-moon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`
const lightThemeSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sun"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

// Helper to update the button icon
function updateIcon(isDark) {
    toggleBtn.innerHTML = isDark ? darkThemeSVG : lightThemeSVG;
}

// The core toggle function
function setTheme(isDark) {
    body.classList.toggle('dark-mode', isDark);
    localStorage.setItem('blog-theme', isDark ? 'dark' : 'light');
    updateIcon(isDark);

    // DISPATCH CUSTOM EVENT: This is the "decoupling" magic.
    // Any other script can now "listen" for this change.
    const themeEvent = new CustomEvent('themeChanged', { detail: { isDark } });
    window.dispatchEvent(themeEvent);
}

// Initial State
const savedTheme = localStorage.getItem('blog-theme') === 'dark';
setTheme(savedTheme);

toggleBtn.addEventListener('click', () => {
    const isDark = !body.classList.contains('dark-mode');
    setTheme(isDark);
});
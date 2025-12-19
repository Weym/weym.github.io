function togglePaletteNamesAndHex() {
    const nameElements = document.querySelectorAll('.palette__name');
    const hexElements = document.querySelectorAll('.palette__hex');

    const reverseText = (elements) => {
        const reversed = Array.from(elements).map(el => el.textContent).reverse();
        elements.forEach((el, i) => el.textContent = reversed[i]);
    };

    reverseText(nameElements);
    reverseText(hexElements);
}

// Listen for the global theme change and only toggle if moving TO dark mode
window.addEventListener('themeChanged', (e) => {
    if (e.detail.isDark) {
        togglePaletteNamesAndHex();
    }
});
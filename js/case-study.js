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

// Listen for the global theme change
window.addEventListener('themeChanged', (e) => {
    // Only toggle if we are moving TO dark mode (based on your original logic)
    if (e.detail.isDark) {
        togglePaletteNamesAndHex();
    }
});
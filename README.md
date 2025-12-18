# Portfolio - Weydson Marinho

![Portfolio Preview](assets/portfolio.jpg)

> "Transforming ideas into reality via code and design."

A digital portfolio focused on **User Experience (UX)**, **visual storytelling**, and **performance**. Inspired by bringing an editorial and journalistic aesthetic, this project was developed to demonstrate front-end development skills, with a special emphasis on creative interactions without relying on UI frameworks.

The entire website was built using only two colors

🔗 **Live:** [Here](https://weym.github.io/)
🎨 **Design System** [Here](https://weym.github.io/pages/case-study.html)

## 🛠️ Technologies Used

The project was built using the "Holy Trinity" of the Web, exploring modern features of each language:

* **Semantic HTML5:** Focus on accessibility (a11y) and SEO.
* **Modern CSS3:**
    * Extensive use of **CSS Grid** and **Flexbox**.
    * CSS Variables (`:root`) for design system consistency.
    * Modern functions like `color-mix()` and `clamp()` for fluid typography.
    * High-performance animations (`transform`, `opacity`).
* **Vanilla JavaScript (ES6+):**
    * `IntersectionObserver API` for theme switching and scroll animations.
    * Custom "Drag-to-scroll" logic.
    * Lightweight and efficient DOM manipulation.

## ✨ Feature Highlights

### 1. Immersive Theme Switching
The site automatically switches between **Light Mode** and **Dark Mode** depending on the section the user is currently viewing to enhance the focus on visual content. This is controlled via `data-attributes` in the HTML and monitored by an `IntersectionObserver` in JS, creating an immersive atmosphere for each type of content.

### 2. Circular Navigation Menu
A unique approach to the mobile/desktop menu. Upon clicking the central toggle, the menu expands into animated concentric rings, utilizing rotation mathematics and transition delays.

### 3. Sticky Stacking Cards
In the "What I Do" section, skill cards use `position: sticky`. As the user scrolls down, the cards stack on top of one another, allowing for focused reading without losing the visual context.

### 4. Dynamic Footer
The sidebars (social links and email) feature a complex animation upon reaching the bottom of the page: they rotate 90 degrees and integrate into the footer layout, effectively "closing" the site's frame.

## 🎨 Design System

* **Typography:**
    * *Montserrat:* Titles and visual impact.
    * *Poppins:* Body text and readability.
    * *Space Mono:* Technical data, numbers, and code details.
* **Color Palette:**
    * Dark: `#131313` (Soft Black)
    * Light: `#d0d0cd` (Warm Paper Gray)

## 🚀 How to Run Locally

This is a static project and does not require complex dependency installations.

1.  Clone the repository:
    ```bash
    git clone https://github.com/Weym/weym.github.io.git
    ```
    or
    ```bash
    git clone git@github.com:Weym/weym.github.io.git
    ```

    ```
2.  Navigate to the folder:
    ```bash
    cd your-repository
    ```
3.  Open the `index.html` file in your browser or use an extension like **Live Server** (VS Code) to simulate a local server.

## 📬 Contact

I am open to work opportunities worldwide.

* **Email:** weydsonmarinho@gmail.com
* **GitHub:** https://github.com/weym
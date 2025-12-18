# Portfolio - Weydson Marinho

![Portfolio Preview](assets/portfolio.jpg)

> "Transforming ideas into reality via code and design."

Um portfólio digital focado em **experiência do usuário (UX)**, **narrativa visual** e **performance**. Este projeto foi desenvolvido para demonstrar habilidades em desenvolvimento Full Stack, com ênfase especial em interações criativas no Frontend sem dependência de frameworks pesados de UI.

🔗 **Demo:** [Link do seu site aqui]

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando a "Santíssima Trindade" da Web, explorando recursos modernos de cada linguagem:

* **HTML5 Semântico:** Foco em acessibilidade (a11y) e SEO.
* **CSS3 Moderno:**
    * Uso extensivo de **CSS Grid** e **Flexbox**.
    * Variáveis CSS (`:root`) para consistência de design system.
    * Funções modernas como `color-mix()` e `clamp()` para tipografia fluida.
    * Animações de alta performance (`transform`, `opacity`).
* **Vanilla JavaScript (ES6+):**
    * `IntersectionObserver API` para mudança de temas e animações de scroll.
    * Lógica de "Drag-to-scroll" personalizada.
    * Manipulação de DOM leve e eficiente.

## ✨ Destaques de Funcionalidades

### 1. Immersive Theme Switching
O site alterna automaticamente entre **Light Mode** e **Dark Mode** dependendo da seção que o usuário está visualizando. Isso é controlado via `data-attributes` no HTML e monitorado por um `IntersectionObserver` no JS, criando uma atmosfera imersiva para cada tipo de conteúdo.

### 2. Menu de Navegação Circular
Uma abordagem única para o menu mobile/desktop. Ao clicar no toggle central, o menu se expande em anéis concêntricos animados, utilizando matemática de rotação e delay de transição.

### 3. Sticky Stacking Cards
Na seção "What I Do", os cards de habilidades utilizam `position: sticky`. Conforme o usuário rola a página, os cards se empilham no topo, permitindo uma leitura focada sem perder o contexto visual.

### 4. Rodapé Dinâmico
As barras laterais (links sociais e email) possuem uma animação complexa ao chegar no fim da página: elas rotacionam 90 graus e se integram ao layout do rodapé, "fechando" a moldura do site.

## 🎨 Design System

* **Tipografia:**
    * *Montserrat:* Títulos e impacto visual.
    * *Poppins:* Textos de corpo e leitura.
    * *Space Mono:* Dados técnicos, números e detalhes de código.
* **Paleta de Cores:**
    * Dark: `#131313` (Soft Black)
    * Light: `#d0d0cd` (Warm Paper Gray)

## 🚀 Como rodar localmente

Este é um projeto estático, não requer instalação de dependências complexas.

1.  Clone o repositório:
    ```bash
    git clone [https://github.com/weym/seu-repositorio.git](https://github.com/weym/seu-repositorio.git)
    ```
2.  Navegue até a pasta:
    ```bash
    cd seu-repositorio
    ```
3.  Abra o arquivo `index.html` no seu navegador ou use uma extensão como **Live Server** (VS Code) para simular um servidor local.

## 📬 Contato

Estou aberto a oportunidades de trabalho em todo o mundo.

* **Email:** weydsonmarinho@gmail.com
* **LinkedIn:** [Seu LinkedIn]
* **GitHub:** [Seu GitHub]

---
*Designed & Built by Weydson Marinho*
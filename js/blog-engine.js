const REPO_BASE_URL = 'https://raw.githubusercontent.com/Weym/digital-garden/main';
const INDEX_FILE = 'posts.json'; 

const appElement = document.getElementById('app');

// HELPER: Cria elementos DOM (padrão)
function createElement(tag, className, textContent) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (textContent) el.textContent = textContent;
    return el;
}

// HELPER: Cria elementos SVG (Namespace obrigatório para vetores funcionarem)
function createSvgElement(tag, attrs) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    if (attrs) {
        Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
    }
    return el;
}

function createCategoryElements(categoryData) {
    const categories = Array.isArray(categoryData) ? categoryData : [categoryData];
    const fragment = document.createDocumentFragment();
    categories.filter(c => c).forEach(cat => {
        fragment.appendChild(createElement('span', 'blog__tag', cat));
    });
    return fragment;
}

async function init() {
    const params = new URLSearchParams(window.location.search);
    const postSlug = params.get('post');

    try {
        const response = await fetch(`${REPO_BASE_URL}/${INDEX_FILE}`);
        if (!response.ok) throw new Error('Failed to load post list');
        
        const postsData = await response.json();

        if (postSlug) {
            await renderPost(postSlug, postsData);
        } else {
            renderPostList(postsData);
        }
    } catch (error) {
        console.error(error);
        renderError('Something went wrong.', error.message, 'index.html', 'Return Home');
    }
}

function renderError(titleText, msgText, linkUrl, linkText) {
    appElement.replaceChildren();
    const container = createElement('div', 'blog-error');
    const link = createElement('a', 'back-link', linkText);
    link.href = linkUrl;
    link.style.marginTop = '20px';
    container.append(createElement('h2', null, titleText), createElement('p', null, msgText), link);
    appElement.appendChild(container);
}

/**
 * CENA 1: Lista de Posts
 */
function renderPostList(posts) {
    appElement.replaceChildren();
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    const section = createElement('section', 'blog-index-container');
    
    // Header
    const header = createElement('header', 'blog-index-header');
    const h1 = createElement('h1', 'article-title', 'The Garden');
    h1.style.textAlign = 'center';
    const p = createElement('p', 'article-subtitle', 'Notes, thoughts, and little things.');
    p.style.textAlign = 'center';
    header.append(h1, p);

    // Grid
    const grid = createElement('div', 'blog-grid');
    
    posts.forEach(post => {
        const article = createElement('article', 'blog__card');

        // Imagem
        const imgLink = createElement('a', 'blog__image-wrapper');
        imgLink.href = `?post=${post.slug}`;

        if (post.coverImage) {
            const img = document.createElement('img');
            img.src = `${REPO_BASE_URL}/${post.coverImage}`;
            img.className = 'blog__image';
            img.alt = post.title;
            img.loading = 'lazy';
            imgLink.appendChild(img);
        } else {
            const placeholder = document.createElement('div');
            placeholder.style.cssText = 'background-color:var(--color-text-primary); width:100%; height:100%; opacity:0.1;';
            imgLink.appendChild(placeholder);
        }

        // Content
        const contentDiv = createElement('div', 'blog__content');
        
        const dateSpan = createElement('span', 'blog__card-date', post.date);
        dateSpan.style.cssText = 'font-family:var(--font-mono); font-size:0.8rem; opacity:0.6; display:block; margin-bottom:5px;';

        const h2 = createElement('h2', 'blog__card-title');
        const titleLink = createElement('a', 'blog__link', post.title);
        titleLink.href = `?post=${post.slug}`;
        h2.appendChild(titleLink);

        const tagsWrapper = createElement('div', 'blog__tags-wrapper');
        tagsWrapper.appendChild(createCategoryElements(post.category));

        const metaDiv = createElement('div', 'blog__card-meta');
        const timeSpan = createElement('span', 'blog__card-time', `${post.readTime} read`);
        timeSpan.style.cssText = 'font-family:var(--font-mono); font-size:0.8rem; opacity:0.6;';
        metaDiv.appendChild(timeSpan);

        contentDiv.append(dateSpan, h2, tagsWrapper, metaDiv);
        article.append(imgLink, contentDiv);
        grid.appendChild(article);
    });

    section.append(header, grid);
    appElement.appendChild(section);
}

/**
 * CENA 2: Post
 */
async function renderPost(slug, allPosts) {
    const postMeta = allPosts.find(p => p.slug === slug);

    if (!postMeta) {
        renderError('Post not found', '', 'blog.html', 'Back to Blog');
        return;
    }

    try {
        const mdResponse = await fetch(`${REPO_BASE_URL}/${postMeta.path}`);
        if (!mdResponse.ok) throw new Error('Content file not found');
        
        let markdownText = await mdResponse.text();
        
        // Remove Frontmatter e Imagem duplicada (via regex na string crua)
        markdownText = markdownText.replace(/^---[\s\S]*?---[\r\n]*/, '');
        if (postMeta.coverImage) {
            markdownText = markdownText.replace(/!\[.*?\]\(.*?\)/, '');
        }

        // --- Renderização DOM ---
        appElement.replaceChildren();

        const section = createElement('section', 'article-section');
        const container = createElement('div', 'article-container');

        // 1. Header
        const header = createElement('header', 'article-header');
        const metaDiv = createElement('div', 'article-meta');
        metaDiv.append(
            createElement('span', 'article-date', postMeta.date),
            createElement('span', 'article-read-time', `${postMeta.readTime} read`)
        );
        header.append(metaDiv, createElement('h1', 'article-title', postMeta.title));
        if (postMeta.subtitle) header.appendChild(createElement('h2', 'article-subtitle', postMeta.subtitle));
        container.appendChild(header);

        // 2. Hero Image
        if (postMeta.coverImage) {
            const figure = createElement('figure', 'article-hero-image');
            const img = document.createElement('img');
            img.src = `${REPO_BASE_URL}/${postMeta.coverImage}`;
            img.alt = postMeta.title;
            img.loading = 'lazy';
            figure.appendChild(img);
            if (postMeta.imageCaption) figure.appendChild(createElement('figcaption', null, postMeta.imageCaption));
            container.appendChild(figure);
        }

        // 3. Conteúdo (Markdown Parsing para DOM)
        const articleContent = createElement('article', 'article-content');
        // AQUI: Chamamos a nova função que retorna um DocumentFragment, não uma string HTML
        const contentFragment = parseMarkdownToDOM(markdownText);
        articleContent.appendChild(contentFragment);
        container.appendChild(articleContent);

        // 4. Footer com Ícone SVG
        const footer = createElement('div', 'article-footer');
        const backLink = createElement('a', 'back-link', ''); // Texto será adicionado depois
        backLink.href = 'index.html';

        // Construção manual do SVG
        const svgIcon = createSvgElement('svg', {
            width: '24', height: '24', viewBox: '0 0 24 24',
            fill: 'none', stroke: 'currentColor', 'stroke-width': '2',
            'stroke-linecap': 'round', 'stroke-linejoin': 'round',
            class: 'feather feather-arrow-left'
        });
        svgIcon.appendChild(createSvgElement('line', { x1: '19', y1: '12', x2: '5', y2: '12' }));
        svgIcon.appendChild(createSvgElement('polyline', { points: '12 19 5 12 12 5' }));

        backLink.appendChild(svgIcon);
        backLink.appendChild(document.createTextNode(' Back to Blog'));
        
        footer.appendChild(backLink);
        container.appendChild(footer);

        section.appendChild(container);
        appElement.appendChild(section);
        window.scrollTo(0, 0);

    } catch (error) {
        renderError('Error loading post content.', error.message, 'index.html', 'Back to Home');
    }
}


function parseMarkdownToDOM(markdown) {
    const fragment = document.createDocumentFragment();
    const lines = markdown.split('\n');
    
    let listContainer = null; // group <li> inside <ul>

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();

        // skip empty lines
        if (!line) {
            if (listContainer) listContainer = null;
            continue;
        }

        // 1. Headers (###)
        if (line.startsWith('#')) {
            listContainer = null;
            const level = line.match(/^#+/)[0].length;
            const text = line.replace(/^#+\s*/, '');
            // # -> h3, ## -> h4
            const tag = level === 2 ? 'h3' : (level === 3 ? 'h4' : 'h2');
            const h = createElement(tag);
            parseInlineStyles(h, text);
            fragment.appendChild(h);
            continue;
        }

        // 2. Images (![Alt](src))
        if (line.startsWith('![') && line.includes('](')) {
            listContainer = null;
            const match = line.match(/!\[(.*?)\]\((.*?)\)/);
            if (match) {
                const [_, alt, src] = match;
                const finalSrc = src.startsWith('http') ? src : `${REPO_BASE_URL}/${src.replace(/^\.\//, '')}`;
                
                const figure = createElement('figure', 'article-hero-image');
                figure.style.margin = '2rem 0';
                
                const img = document.createElement('img');
                img.src = finalSrc;
                img.alt = alt;
                img.loading = 'lazy';
                
                const figcaption = createElement('figcaption', null, alt);
                
                figure.append(img, figcaption);
                fragment.appendChild(figure);
            }
            continue;
        }

        // 3. Blockquote (> Text)
        if (line.startsWith('> ')) {
            listContainer = null;
            const text = line.replace(/^>\s*/, '');
            const bq = createElement('blockquote');
            parseInlineStyles(bq, text);
            fragment.appendChild(bq);
            continue;
        }

        // 4. List (- Item)
        if (line.startsWith('- ')) {
            if (!listContainer) {
                listContainer = createElement('ul');
                fragment.appendChild(listContainer);
            }
            const text = line.replace(/^-\s*/, '');
            const li = createElement('li');
            parseInlineStyles(li, text);
            listContainer.appendChild(li);
            continue;
        }

        // 5. P
        listContainer = null;
        const p = createElement('p');
        parseInlineStyles(p, line);
        fragment.appendChild(p);
    }

    return fragment;
}

/**
 * Parse Bold, Italic, Link, Code
 */
function parseInlineStyles(parentElement, text) {
    const regex = /\[(.*?)\]\((.*?)\)|(\*\*(.*?)\*\*)|(\*(.*?)\*)|(`(.*?)`)/g;
    
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        // 1. Simple text before match
        if (match.index > lastIndex) {
            parentElement.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
        }

        // 2. Which group & create element
        if (match[1] && match[2]) { 
            // LINK
            const a = createElement('a', null, match[1]);
            a.href = match[2];
            a.target = "_blank";
            a.style.textDecoration = "underline";
            parentElement.appendChild(a);
        } 
        else if (match[4]) { 
            // BOLD
            const strong = createElement('strong', null, match[4]);
            parentElement.appendChild(strong);
        } 
        else if (match[6]) { 
            // ITALIC
            const em = createElement('em', null, match[6]);
            parentElement.appendChild(em);
        }
        else if (match[8]) { 
            // CODE
            const code = createElement('code', 'blog__code-inline', match[8]);
            parentElement.appendChild(code);
        }

        lastIndex = regex.lastIndex;
    }

    // 3. Add text after last match
    if (lastIndex < text.length) {
        parentElement.appendChild(document.createTextNode(text.substring(lastIndex)));
    }
}

// Start Engine
init();
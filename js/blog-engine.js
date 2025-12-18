/**
 * BLOG ENGINE
 * Connects to GitHub, fetches posts.json, and renders content.
 */

// CONFIGURATION
const REPO_BASE_URL = 'https://raw.githubusercontent.com/Weym/digital-garden/main';
const INDEX_FILE = 'posts.json'; 

const appElement = document.getElementById('app');

// HELPER: Generate HTML for Category Tags (Pills)
function generateCategoryHTML(categoryData) {
    const categories = Array.isArray(categoryData) ? categoryData : [categoryData];
    return categories
        .filter(c => c)
        .map(cat => `<span class="blog__tag">${cat}</span>`)
        .join('');
}

// INIT
async function init() {
    const params = new URLSearchParams(window.location.search);
    const postSlug = params.get('post');

    try {
        // 1. Fetch the Database (JSON)
        const response = await fetch(`${REPO_BASE_URL}/${INDEX_FILE}`);
        if (!response.ok) throw new Error('Failed to load post list');
        
        const postsData = await response.json();

        // 2. Route Logic
        if (postSlug) {
            await renderPost(postSlug, postsData);
        } else {
            renderPostList(postsData);
        }
    } catch (error) {
        console.error(error);
        appElement.innerHTML = `
            <div class="blog-error">
                <h2>Something went wrong.</h2>
                <p>${error.message}</p>
                <a href="index.html" class="back-link" style="margin-top:20px">Return Home</a>
            </div>`;
    }
}

/**
 * SCENARIO 1: List View (The Grid)
 */
function renderPostList(posts) {
    // Sort by Date (Newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    let html = `
        <section class="blog-index-container">
            <header class="blog-index-header">
                 <h1 class="article-title" style="text-align:center">The Garden</h1>
                 <p class="article-subtitle" style="text-align:center">Notes, thoughts, and little things.</p>
            </header>
            <div class="blog-grid">
    `;
    
    posts.forEach(post => {
        const categoriesHTML = generateCategoryHTML(post.category);
        
        html += `
            <article class="blog__card">
                <a href="?post=${post.slug}" class="blog__image-wrapper">
                    ${post.coverImage 
                        ? `<img src="${REPO_BASE_URL}/${post.coverImage}" class="blog__image" alt="${post.title}" loading="lazy">` 
                        : `<div style="background-color:var(--color-text-primary); width:100%; height:100%; opacity:0.1;"></div>`
                    }
                </a>
                
                <div class="blog__content">
                    <span class="blog__card-date" style="font-family:var(--font-mono); font-size:0.8rem; opacity:0.6; display:block; margin-bottom:5px;">${post.date}</span>
                    
                    <h2 class="blog__card-title">
                        <a href="?post=${post.slug}" class="blog__link">${post.title}</a>
                    </h2>

                    <div class="blog__tags-wrapper">
                        ${categoriesHTML}
                    </div>

                    <div class="blog__card-meta">
                        <span class="blog__card-time" style="font-family:var(--font-mono); font-size:0.8rem; opacity:0.6;">${post.readTime} read</span>
                    </div>
                </div>
            </article>
        `;
    });

    html += '</div></section>';
    appElement.innerHTML = html;
}

/**
 * SCENARIO 2: Single Post View
 */
async function renderPost(slug, allPosts) {
    const postMeta = allPosts.find(p => p.slug === slug);

    if (!postMeta) {
        appElement.innerHTML = `<div class="blog-error"><h2>Post not found</h2><a href="blog.html" class="back-link">Back to Blog</a></div>`;
        return;
    }

    try {
        const mdResponse = await fetch(`${REPO_BASE_URL}/${postMeta.path}`);
        if (!mdResponse.ok) throw new Error('Content file not found');
        
        let markdownText = await mdResponse.text();
        
        // --- FIX 1: Remove Frontmatter (Metadata block at the top) ---
        // Replaces everything between the first set of '---' and the second '---'
        markdownText = markdownText.replace(/^---[\s\S]*?---[\r\n]*/, '');

        // --- FIX 2: Remove Duplicate Image ---
        // If JSON has a coverImage, remove the FIRST image found in the markdown
        // so it doesn't show up twice (Header + Body).
        if (postMeta.coverImage) {
            // Regex finds the first ![Alt](Src) pattern and replaces it with empty string
            markdownText = markdownText.replace(/!\[.*?\]\(.*?\)/, '');
        }

        // Parse the remaining Markdown
        const htmlContent = parseMarkdown(markdownText);
        
        // Build Header Image HTML (Only if present in JSON)
        const heroImageHTML = postMeta.coverImage 
            ? `
            <figure class="article-hero-image">
                <img src="${REPO_BASE_URL}/${postMeta.coverImage}" alt="${postMeta.title}" loading="lazy">
                ${postMeta.imageCaption ? `<figcaption>${postMeta.imageCaption}</figcaption>` : ''}
            </figure>
            ` 
            : '';

        const subtitleHTML = postMeta.subtitle 
            ? `<h2 class="article-subtitle">${postMeta.subtitle}</h2>` 
            : '';

        // Template Injection
        appElement.innerHTML = `
            <section class="article-section">
                <div class="article-container">

                    <header class="article-header">
                        <div class="article-meta">
                            <span class="article-date">${postMeta.date}</span>
                            <span class="article-read-time">${postMeta.readTime} read</span>
                        </div>
                        <h1 class="article-title">${postMeta.title}</h1>
                        ${subtitleHTML}
                    </header>

                    ${heroImageHTML}

                    <article class="article-content">
                        ${htmlContent}
                    </article>

                    <div class="article-footer">
                        <a href="blog.html" class="back-link">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                            Back to Blog
                        </a>
                    </div>
                </div>
            </section>
        `;
        
        window.scrollTo(0, 0);

    } catch (error) {
        appElement.innerHTML = `<div class="blog-error">Error loading post content.<br>${error.message}</div>`;
    }
}

/**
 * UTILS: Markdown Parser
 */
function parseMarkdown(markdown) {
    let html = markdown.trim(); // Trim whitespace

    // Sanitize
    html = html.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Headers
    html = html.replace(/^## (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^### (.*$)/gim, '<h4>$1</h4>');

    // Images (Remaining images in the body)
    html = html.replace(/!\[(.*?)\]\((.*?)\)/gim, (match, alt, src) => {
        if (src.startsWith('http')) return match;
        
        // Fix relative paths
        const cleanSrc = src.replace(/^(\.\/|\.\.\/)+/, '');
        const finalSrc = `${REPO_BASE_URL}/${cleanSrc}`;
        
        return `
        <figure class="article-hero-image" style="margin: 2rem 0;">
            <img src="${finalSrc}" alt="${alt}" loading="lazy">
            <figcaption>${alt}</figcaption>
        </figure>`;
    });

    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" style="text-decoration:underline;">$1</a>');

    // Formatting
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    html = html.replace(/`(.*?)`/gim, '<code class="blog__code-inline">$1</code>');
    html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

    // Lists
    html = html.replace(/^\s*-\s(.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>');
    html = html.replace(/<\/ul>\s*<ul.*?>/gim, '');

    // Paragraphs
    html = html.replace(/\n\n/g, '<p></p>');
    html = html.replace(/([^\n]+)\n/g, '$1<br>');
    
    // Wrap loose text
    const parts = html.split('<p></p>');
    const wrapped = parts.map(part => {
        const trimmed = part.trim();
        if(!trimmed) return '';
        // Don't wrap tags that are already blocks
        if (trimmed.match(/^<(h3|h4|ul|blockquote|figure)/)) return trimmed;
        return `<p>${trimmed}</p>`;
    });

    return wrapped.join('');
}

// Start Engine
init();
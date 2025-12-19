const REPO_BASE_URL = 'https://raw.githubusercontent.com/Weym/digital-garden/main';
const INDEX_FILE = 'posts.json';

const blogTrack = document.querySelector('.blog__track');

function createElement(tag, className, textContent) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (textContent) el.textContent = textContent;
    return el;
}

async function init() {
    try {
        const response = await fetch(`${REPO_BASE_URL}/${INDEX_FILE}`);
        if (!response.ok) throw new Error('Failed to load posts list');

        const postsData = await response.json();

        renderSliderPosts(postsData);

    } catch (error) {
        console.error("Blog Error:", error);
        if (blogTrack) {
            blogTrack.innerHTML = `<p style="padding: 20px;">Error loading posts: ${error.message}</p>`;
        }
    }
}

/**
 * Renders the posts in Slider/Card format
 */
function renderSliderPosts(posts) {
    if (!blogTrack) return;

    blogTrack.replaceChildren();

    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    posts.forEach(post => {
        const article = createElement('article', 'blog__card');

        const figure = createElement('figure', 'blog__image-wrapper image-overlay');
        const img = document.createElement('img');
        
        img.src = post.coverImage.startsWith('http') ? post.coverImage : `${REPO_BASE_URL}/${post.coverImage}`;
        img.className = 'blog__image';
        img.alt = post.title;
        img.setAttribute('draggable', 'false');
        figure.appendChild(img);

        const contentDiv = createElement('div', 'blog__content');

        const h3 = createElement('h3', 'blog__card-title');
        const titleLink = createElement('a', 'blog__link', post.title);
        
        titleLink.href = `blog.html?post=${post.slug}`;
        titleLink.setAttribute('aria-label', `Read the full article on ${post.title}`);
        h3.appendChild(titleLink);

        const excerpt = createElement('p', 'blog__card-excerpt', post.description || post.subtitle);

        const readMore = createElement('a', 'blog__read-more', 'Read More');
        readMore.href = `blog.html?post=${post.slug}`;
        readMore.setAttribute('aria-label', `Read the full article on ${post.title}`);

        contentDiv.append(h3, excerpt, readMore);
        article.append(figure, contentDiv);

        blogTrack.appendChild(article);
    });
}

init();
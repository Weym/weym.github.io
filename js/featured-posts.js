const REPO_BASE_URL = 'https://raw.githubusercontent.com/Weym/digital-garden/main';
const INDEX_FILE = 'posts.json';

// Select the "track" where the sliding cards are located
const blogTrack = document.querySelector('.blog__track');

// HELPER: Creates DOM elements
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

        // Renders only the posts within the slider track
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

    // Clear current static content
    blogTrack.replaceChildren();

    // Sort by date (most recent first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    posts.forEach(post => {
        // 1. Create the Article (Card)
        const article = createElement('article', 'blog__card');

        // 2. Image Wrapper
        const figure = createElement('figure', 'blog__image-wrapper image-overlay');
        const img = document.createElement('img');
        
        // If the image is not a full link, concatenate it with the repo base URL
        img.src = post.coverImage.startsWith('http') ? post.coverImage : `${REPO_BASE_URL}/${post.coverImage}`;
        img.className = 'blog__image';
        img.alt = post.title;
        img.setAttribute('draggable', 'false');
        figure.appendChild(img);

        // 3. Post Content
        const contentDiv = createElement('div', 'blog__content');

        // Title
        const h3 = createElement('h3', 'blog__card-title');
        const titleLink = createElement('a', 'blog__link', post.title);
        
        // Adjust the link to where the post will be read (e.g., post page with ?post=slug)
        titleLink.href = `blog.html?post=${post.slug}`;
        titleLink.setAttribute('aria-label', `Read the full article on ${post.title}`);
        h3.appendChild(titleLink);

        // Excerpt/Description
        const excerpt = createElement('p', 'blog__card-excerpt', post.description || post.subtitle);

        // Read More Button
        const readMore = createElement('a', 'blog__read-more', 'Read More');
        readMore.href = `blog.html?post=${post.slug}`;
        readMore.setAttribute('aria-label', `Read the full article on ${post.title}`);

        contentDiv.append(h3, excerpt, readMore);
        article.append(figure, contentDiv);

        blogTrack.appendChild(article);
    });
}

init();
SEO
- Create image to put on `<meta property="og:image" content="...">`

Fix
- sticky content in different resolutions
- section positioning and intro text are mispositioned
- navbar too small on big screens
- When the screen is split horizontally with one content on the top half and another on the bottom half, the design breaks

TODO:
- Make a blog:
    - It will get the content from markdown files, saved in another repository
    - It will parse the files and replace the markdown styling for a HTML equivalent - keeping it basic
    - The blog post list will come from a `posts.json` or even `posts.md` that will list post, slug, short message about the post and an image
        - Use this to categorize the content
    - Have featured posts
        - List featured posts on the main page

Navbar
- When clicking outside the navigation, close it (try to account for a missclick, when the click outside is close to it)
- Make the "Hamburger" menu turn into an "x" once the navbar is open
- Make the text inside the <a> curved, following the lines
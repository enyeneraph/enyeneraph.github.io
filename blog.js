// blog.js
const postsDirectory = 'posts/';
const postsPerPage = 5;
let currentPage = 1;
let allPosts = [];

// Function to format date
function formatDate(dateString) {
     const options = { year: 'numeric', month: 'long', day: 'numeric' };
     return new Date(dateString).toLocaleDateString(undefined, options);
}

// Function to load and parse a single post
async function loadPost(filename) {
     try {
          const response = await fetch(`${postsDirectory}${filename}`);
          if (!response.ok) throw new Error('Post not found');

          const markdown = await response.text();
          const html = marked.parse(markdown);

          const area = document.getElementById('area');
          area.innerHTML = `
            <div class="content">
                <a class="back" href=""><img class="fa arrow-left" src="images/arrow-left-solid.svg" alt="">Back to My Notes</a>
                <div class="full-post">
                    ${html}
                </div>
            </div>
        `;

          window.scrollTo(0, 0);
     } catch (error) {
          console.error('Error loading post:', error);
          alert('Sorry, the post could not be loaded.');
     }
}

// Function to display posts list
function displayPosts() {
     const notesSection = document.querySelector('.notes');
     const blogContainer = notesSection.querySelector('.blog');

     // Clear existing posts
     notesSection.innerHTML = '<h2>My Notes</h2>';

     const startIndex = (currentPage - 1) * postsPerPage;
     const endIndex = startIndex + postsPerPage;
     const currentPosts = posts.slice(startIndex, endIndex);

     if (currentPosts.length === 0) {
          // Display fallback content if no posts are available
          const fallbackDiv = document.createElement('div');
          fallbackDiv.classList.add('no-posts');

          fallbackDiv.innerHTML = `
              <div class="placeholder">
                  <img src="images/laptop.png" alt="Placeholder">
                  <p>No notes available at the moment. Please check back later!</p>
              </div>
          `;

          notesSection.appendChild(fallbackDiv);
     } else {

          // Create blog posts
          currentPosts.forEach((post, index) => {
               const blogPost = document.createElement('div');
               blogPost.classList.add('blog');
               if (index === currentPosts.length - 1) {
                    blogPost.classList.add('last');
               }

               blogPost.innerHTML = `
            <h3><a href="#" class="post-link" data-file="${post.file}">${post.title}</a></h3>
            <p>${formatDate(post.date)}</p>
        `;

               notesSection.appendChild(blogPost);
          });

          // Add event listeners to post links
          document.querySelectorAll('.post-link').forEach(link => {
               link.addEventListener('click', (e) => {
                    e.preventDefault();
                    loadPost(e.target.dataset.file);
               });
          });

          // Updated pagination logic
          const paginationContainer = document.createElement('div');
          paginationContainer.classList.add('pagination');

          const isFirstPage = currentPage === 1;
          const isLastPage = endIndex >= posts.length;

          // Only show Previous button if not on first page
          if (!isFirstPage) {
               const previousSpan = document.createElement('span');
               previousSpan.id = 'previous';
               previousSpan.innerHTML = '<img class="fa arrow-left" src="images/arrow-left-solid.svg" alt="">Previous';
               previousSpan.addEventListener('click', () => {
                    currentPage--;
                    displayPosts();
               });
               paginationContainer.appendChild(previousSpan);
          }

          // Only show Next button if not on last page
          if (!isLastPage) {
               const nextSpan = document.createElement('span');
               nextSpan.id = 'next';
               nextSpan.innerHTML = 'Next<img class="fa arrow-right" src="images/arrow-right-solid.svg" alt="">';
               nextSpan.addEventListener('click', () => {
                    currentPage++;
                    displayPosts();
               });
               paginationContainer.appendChild(nextSpan);
          }

          notesSection.appendChild(paginationContainer);
     }
}

// Initialize the blog
document.addEventListener('DOMContentLoaded', () => {
     // Configure marked.js for Markdown parsing
     marked.setOptions({
          breaks: true,
          gfm: true
     });

     // Display initial posts
     displayPosts();
});
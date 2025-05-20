// Initital test button
function sayHello() {
    alert('You clicked the button! Welcome to your first site.');
  }
// toggle dark mode
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
  
  const button = document.getElementById("toggle-theme");

  if (button) {
    button.addEventListener("click", () => {
      document.body.classList.toggle("dark");
  
      if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
      } else {
        localStorage.setItem("theme", "light");
      }
    });
  }
 //Message char count
  const messageInput = document.getElementById("message");
  const charCount = document.getElementById("char-count");

  if (messageInput && charCount) {
    messageInput.addEventListener("input", () => {
      const remaining = 250 - messageInput.value.length;
      charCount.textContent = `characters left: ${remaining}`;
    })
  }

  
  const blogPosts = JSON.parse(localStorage.getItem("blogPosts")) || [];

  function renderPosts() {
  const container = document.getElementById("blog-posts");
  if (!container) return;

  container.innerHTML = ""; // Clear existing content

  blogPosts.forEach((post, index) => {
    const article = document.createElement("article");
    article.className = "blog-post";

    article.innerHTML = `
      <h2>${post.title}</h2>
      <p><small>Posted on ${post.date}</small></p>
      <p>${post.summary}</p>
      <a href="post.html?id=${index}">Read More</a>
    `;

    container.appendChild(article);
  });
}

const form = document.getElementById("post-form");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("post-title").value;
    const date = document.getElementById("post-date").value;
    const summary = document.getElementById("post-summary").value;
    const link = document.getElementById("post-link").value;

    blogPosts.unshift({ title, date, summary, link }); // Add to beginning
    saveAndRenderPosts();

    form.reset();
  });
}

function saveAndRenderPosts() {
  localStorage.setItem("blogPosts", JSON.stringify(blogPosts));
  renderPosts();
}

  renderPosts();

  function loadSinglePost () {
    const container = document.getElementById("post-content");
    if (!container) return 

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    
    if (id === null) {
      container.innerHTML = "<p>Post not foind.</p>";
      return;

    }

    const posts = JSON.parse(localStorage.getItem("blogPosts")) || [];

    const post = posts[id];
    if (!post) {
      container.innerHTML = "<p>Post not found.</p>";
      return
    }

    container.innerHTML = `
      <article class="blog-post">
        <h2>${post.title}</h2>
        <p><small>Posted on ${post.date}</small></p>
        <p>${post.summary}</p>
        <a href="blog.html">Back to blog</a>
      </article>
  `;
  }

  loadSinglePost ();
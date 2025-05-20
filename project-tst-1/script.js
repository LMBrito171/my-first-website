// Initital test button
function sayHello() {
    alert('You clicked the button! Welcome to your first site.');
  }
// toggle dark mode
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
  
  const button = document.getElementById("toggle-theme");
  
  button.addEventListener("click", () => {
    // Toggle the dark class
    document.body.classList.toggle("dark");
  
    // Save the current theme to localStorage
    if (document.body.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  });
 //Message char count
  const messageInput = document.getElementById("message");
  const charCount = document.getElementById("char-count");

  if (messageInput && charCount) {
    messageInput.addEventListener("input", () => {
      const remaining = 250 - messageInput.value.length;
      charCount.textContent = `characters left: ${remaining}`;
    })
  }

  
    const blogPosts = [{
      title: "How I built my first Website",
      date: "May 20th, 2025",
      summary: "this is a short summary of the article(...)",
      link: "#"
    },
    {
      title: "Dark Mode with JS",
      date: "May 19th, 2025",
      summary: "Dark mode isn’t just cool — it’s a great practice for accessibility and user comfort. Here's how I made it work persistently.",
      link: "#"

    }
  ];
  function renderBlogPosts () {
    const container = document.getElementById("blog-posts");
    if (!container) return;

    blogPosts.forEach(post => {
      const article = document.createElement("article");
      article.className = "blog-post";

      article.innerHTML= `
        <h2>${post.title}</h2>
        <p><small>Posted on ${post.date}</small></p>
        <p>${post.summary}</p>
        <a href="${post.link}">Read More</a>
      `;

      container.appendChild(article);
    });
  }

  renderBlogPosts();
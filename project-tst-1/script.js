 // Firebase Integration
 import { 
  initializeApp 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
 
 import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

 const firebaseConfig = {
   apiKey: "AIzaSyAtycJr3pfVBq7FjNLq8aY6vjh2hNgUoYk",
   authDomain: "caos-midia.firebaseapp.com",
   projectId: "caos-midia",
   storageBucket: "caos-midia.appspot.com",
   messagingSenderId: "92503656162",
   appId: "1:92503656162:web:07ee9aef53fefdeb94c0bb"
 };



 const app = initializeApp(firebaseConfig);
 const db = getFirestore(app);
 const auth = getAuth(app);
 const provider = new GoogleAuthProvider ();
 window.firebase = { db, collection, getDocs, addDoc };
 window.firebase.auth = auth;
 window.firebase.provider = provider; 

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

  async function renderPosts() {
    const container = document.getElementById("blog-posts");
    if (!container) return;
  
    container.innerHTML = ""; // Clear existing posts
  
    try {
      const querySnapshot = await getDocs(collection(firebase.db, "posts"));
  
      querySnapshot.forEach((doc) => {
        const post = doc.data();
  
        const article = document.createElement("article");
        article.className = "blog-post";
  
        article.innerHTML = `
          <h2>${post.title}</h2>
          <p><small>Posted on ${post.date}</small></p>
          <p>${post.summary}</p>
          <a href="post.html?id=${doc.id}">Read More</a>
        `;
  
        container.appendChild(article);
      });
    } catch (error) {
      console.error("Error getting posts: ", error);
      container.innerHTML = "<p>Failed to load posts.</p>";
    }
  }

const form = document.getElementById("post-form");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("post-title").value;
    const date = document.getElementById("post-date").value;
    const summary = document.getElementById("post-summary").value;
    const content = document.getElementById("post-content").value;
    const link = document.getElementById("post-link").value;

    try {
      await addDoc(collection(firebase.db, "posts"), {
        title,
        date,
        summary,
        content,
        link
      });

      form.reset();
      renderPosts(); // Re-fetch and display updated posts
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  });
}



  renderPosts();

  async function loadSinglePost () {
    const container = document.getElementById("post-content");
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    
    if (!id) {
      container.innerHTML = `<p>Post not found.</p>`;
      return; 

    }

    try {
      const docRef = doc(firebase.db, "posts", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const post = docSnap.data();

        container.innerHTML = `
        <article class="blog-post">
          <h2>${post.title}</h2>
          <p><small>Posted on ${post.date}</small></p>
          <p>${post.summary}</p>
          <p>${post.content}</p>
          <a href="blog.html">Back to blog</a>
        </article>`;
      } else {
        container.innerHTML = `<p>Post not found.<p>`;
      }
    } catch (error) {
      console.error("error loading post:", error);
      container.innerHTML = `<p>Failed to load post.<p>`;
    }

  }
  loadSinglePost ();

  const ADMIN_EMAILS = ["batataplaygames@gmail.com"];

  const loginGoogle = document.getElementById("login-google");
  const loginEmail  = document.getElementById("login-email");
  const logoutBtn = document.getElementById("logout");
  const formWrapper = document.getElementById("post-form");
  const registerBtn = document.getElementById("register-email")
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  
  if (loginGoogle) {
    loginGoogle.addEventListener("click", () =>{
      signInWithPopup(auth, provider).catch(console.error);
    });
  }

  if (loginEmail) {
    loginEmail.addEventListener("click", () => {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      signInWithEmailAndPassword(auth, email, password).catch(console.error)
    });
  };

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      signOut(auth).catch(console.error);
    });
  }

  
  if (registerBtn) {
    registerBtn.addEventListener("click", () => {
      const email = document.getElementById("reg-email").value;
      const password = document.getElementById("reg-password").value;
  
      if (!email || !password) {
        alert("Please enter email and password.");
        return;
      }
  
      createUserWithEmailAndPassword(firebase.auth, email, password)
        .then((userCredential) => {
          console.log("Registered and logged in:", userCredential.user.email);
          alert("Registration successful!");
        })
        .catch((error) => {
          console.error("Registration error:", error);
          alert(error.message);
        });
    });
  }

  onAuthStateChanged(firebase.auth, (user) => {
    if (user) {
      console.log("Logged in as:", user.email);
  
      // Toggle visibility
      loginGoogle?.classList.add("hidden");
      loginEmail?.classList.add("hidden");
      emailInput?.classList.add("hidden");
      passwordInput?.classList.add("hidden");
      logoutBtn?.classList.remove("hidden");
  
      // Show form only for admins
      if (ADMIN_EMAILS.includes(user.email)) {
        formWrapper?.classList.remove("hidden");
      } else {
        formWrapper?.classList.add("hidden");
      }
    } else {
      // Show login again
      loginGoogle?.classList.remove("hidden");
      loginEmail?.classList.remove("hidden");
      emailInput?.classList.remove("hidden");
      passwordInput?.classList.remove("hidden");
      logoutBtn?.classList.add("hidden");
      formWrapper?.classList.add("hidden");
    }
  });

  const userGreeting = document.getElementById("user-greeting");

  if (userGreeting) {
    userGreeting.textContent = user ? `welcome, ${user.email}`: ""; 
  }
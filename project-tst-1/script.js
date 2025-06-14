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
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  startAfter,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
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

let lastVisiblePost = null;

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider ();
const POSTS_PER_PAGE = 5;
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

  //Blog posts

  async function renderPosts(user, isLoadMore = false) {
    const container = document.getElementById("blog-posts");
    const loadMoreBtn = document.getElementById("load-more");
    //const user = firebase.auth.currentUser;
    if (!container) return;
    const isAdmin = user && ADMIN_EMAILS.includes(user.email);
    const postRef = collection(firebase.db, "posts");
    
  let postsQuery;

  if (isLoadMore && lastVisiblePost) {
    postsQuery = query(
      postRef,
      orderBy("createdAt", "desc"),
      startAfter(lastVisiblePost),
      limit(POSTS_PER_PAGE)
    );
  } else {
    postsQuery = query(
      postRef,
      orderBy("createdAt", "desc"),
      limit(POSTS_PER_PAGE)
    );
    container.innerHTML = ""; // Clear only if not loading more
  }

  try {
    const querySnapshot = await getDocs(postsQuery);
    if (!querySnapshot.empty) {
      lastVisiblePost = querySnapshot.docs[querySnapshot.docs.length - 1];
    }

    querySnapshot.forEach((docSnap) => {
      const post = docSnap.data();
      if (post.status !== "published") return;
      const docId = docSnap.id;

      const timestamp = post.createdAt;
      const formattedDate = timestamp?.toDate?.().toLocaleDateString("pt-BR") || "unknown";
      const author = post.author || "Anonymous";

      const article = document.createElement("article");
      article.className = "blog-post";

      article.innerHTML = `
        <h2>${post.title}</h2>
        <p><small>Posted on ${formattedDate} by ${author}</small></p>
        <p>${post.summary}</p>
        <a href="post.html?id=${docId}">Read More</a><br><br>
        ${isAdmin ? `
          <button><a href="edit-post.html?id=${docId}">Edit</a></button>
          <button class="delete-post" data-id="${docId}">Delete</button>` : ""}
      `;

      container.appendChild(article);
    });

    // Show or hide the Load More button
    if (querySnapshot.size < POSTS_PER_PAGE) {
      loadMoreBtn.style.display = "none";
    } else {
      loadMoreBtn.style.display = "inline-block";
    }
  } catch (error) {
    console.error("Error loading posts:", error);
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
        link,
        createdAt:serverTimestamp(),
        author: firebase.auth.currentUser.displayName,
        
      });

      form.reset();
      window.location.href = "blog.html";
      renderPosts(); // Re-fetch and display updated posts
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  });
}



  // renderPosts();

  document.addEventListener("click", async (e) => {
    //Delete post
    if (e.target.classList.contains("delete-post")) {
      const id = e.target.dataset.id;
      if (!id) return alert ("Missing Post ID!");

      if(confirm("Are you sure you want to delete this post?")) {
        try {

          await deleteDoc(doc(firebase.db, "posts", id));
          renderPosts(firebase.auth.currentUser);
        } catch (error) {
          console.error("Delete Failed:", error);
        }
      }
    }

    //Edit post
    if (e.target.classList.contains("edit-post")) {
      const id = e.target.dataset.id;
      if (!id) return alert("Missing post ID!");

      try {

        const postRef = doc(firebase.db, "posts", id);
        const postSnap = await getDoc(postRef);
        
        if (postSnap.exists()) {
          const post = postSnap.data();
          
          const newTitle = prompt("Edit Title:", post.title);
          const newContent = prompt("Edit content:", post.content);
          const newSummary = prompt("Edit summary:", post.summary);
          
          if (newTitle && newContent) {
            await updateDoc(postRef, {
              title: newTitle,
              content: newContent,
              summary: newSummary
            });
            renderPosts(firebase.auth.currentUser);
          }
        }
      } catch (error) {
        console.error("Edit Failed:", error);
      }
    }
  });

  async function loadSinglePost () {
    const container = document.getElementById("post-content");
    if (!container) return;
  
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
  
    if (!id) {
      container.innerHTML = `<p>Post not found.</p>`;
      return;
    }
  
    console.log("Loading post ID:", id);
  
    try {
      const docRef = doc(firebase.db, "posts", id);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const post = docSnap.data();
        const createdAt = post.createdAt?.toDate?.();
        const editedAt = post.editedAt?.toDate?.()
        const author = post.author || "Anonymous";
        
        //<p>${post.summary}</p>
  
        container.innerHTML = `
          <article class="blog-post">
            <h2>${post.title}</h2>
            <p><small>Posted on ${createdAt?.toLocaleDateString("pt-BR") || "Unknown"} by ${author}</small></p>
            <p>${post.content}</p>
            ${editedAt? `<p><small><em>Last edited on ${editedAt.toLocaleDateString("pt-BR")}</em></small></p>` : ""}
            <a href="blog.html">Back to blog</a>
          </article>
        `;
      } else {
        console.warn("Post not found for ID:", id);
        container.innerHTML = `<p>Post not found.</p>`;
      }
    } catch (error) {
      console.error("Error loading post:", error);
      container.innerHTML = `<p>Failed to load post.</p>`;
    }
  }
  loadSinglePost ();

  //admin logic
  const ADMIN_EMAILS = ["batataplaygames@gmail.com", "test@test.com"];

  const loginGoogle = document.getElementById("login-google");
  const loginEmail  = document.getElementById("login-email");
  const logoutBtn = document.getElementById("logout");
  const formWrapper = document.getElementById("post-form");
  const registerBtn = document.getElementById("register-email")
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  
  //Login and register
  if (loginGoogle) {
    loginGoogle.addEventListener("click", () =>{
      signInWithPopup(auth, provider).catch(console.error);
    });
  }

  if (loginEmail) {
    loginEmail.addEventListener("click", () => {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log("logged in as:", userCredential.user.email);
          window.location.reload();
        })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessageElement = document.getElementById("login-error");
    
        let message = "Login failed. Please try again.";
    
        if (errorCode === "auth/user-not-found") {
          message = "No account found with this email.";
        } else if (errorCode === "auth/wrong-password") {
          message = "Incorrect password. Please try again.";
        } else if (errorCode === "auth/invalid-email") {
          message = "Please enter a valid email address.";
        } else if (errorCode === "auth/too-many-requests") {
          message = "Too many failed attempts. Try again later.";
        }
    
        if (errorMessageElement) {
          errorMessageElement.textContent = message;
          errorMessageElement.style.display = "block";
        } else {
          alert(message); // fallback
        }
    
        console.warn("Login error:", errorCode);
      });
      

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
 //visibility admin/non admin
  onAuthStateChanged(firebase.auth, (user) => {

    const editorContainer = document.getElementById("editor");
    const publishBtn  = document.getElementById("publish-post");
    const saveDraftBtn = document.getElementById("save-draft");

    if (editorContainer&& saveDraftBtn) {

      saveDraftBtn.addEventListener("click", async () => {
        const title = prompt("Title:");
        const content = quill.root.innerHTML;
        const summary = quill.getText().substring(0,300) + "...";

        await addDoc(collection(firebase.db, "posts"), {
          title, 
          content, 
          summary, 
          createdAt: serverTimestamp(), 
          author: firebase.auth.currentUser?.display || "Anonymous", 
          status: "draft"
        })
      })

    }
    if(editorContainer && publishBtn) {
      const quill = new Quill('#editor', {
        theme: 'snow'
      });

      publishBtn.addEventListener("click", async () => {
        const title = prompt("Title:");
        const content = quill.root.innerHTML;
        const summary = quill.getText().substring(0, 300) + "...";

        await addDoc(collection(firebase.db, "posts"), {
          title,
          content,
          summary,
          createdAt: serverTimestamp(),
          author: firebase.auth.currentUser.displayName,
          status: "published"
        });
        alert("Post published!");
      });
    }


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
      renderPosts(user);
    } else {
      // Show login again
      loginGoogle?.classList.remove("hidden");
      loginEmail?.classList.remove("hidden");
      emailInput?.classList.remove("hidden");
      passwordInput?.classList.remove("hidden");
      logoutBtn?.classList.add("hidden");
      formWrapper?.classList.add("hidden");
      renderPosts(null)
    }

    if (window.location.pathname.includes("new-post.html")) {
      if (!user || !ADMIN_EMAILS.includes(user.email)) {
        alert("Only admins can create posts!");
        window.location.href = "blog.html";
        return;
      }
    }

    const newPostLink = document.querySelector('a[href="new-post.html"]');
    if (newPostLink && (!user || !ADMIN_EMAILS.includes(user.email))) {
      newPostLink.remove();
    }

    const userGreeting = document.getElementById("user-greeting");
    if (userGreeting) {
      userGreeting.textContent = user ? `welcome, ${user.email}`: ""; 
      
    }
    console.log("Auth check, user:", user?.email);
  });

  const loadMoreBtn = document.getElementById("load-more");
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      renderPosts(firebase.auth.currentUser, true);
    })
  }

  

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
   
   const app = initializeApp(firebaseConfig);
   const db = getFirestore(app);
   const auth = getAuth(app);

   //Role cheking block
   
   const ADMIN_EMAILS = ["batataplaygames@gmail.com", "test@test.com"]
   
   
   
   document.addEventListener("DOMContentLoaded", () => {

    const loginGoogle = document.getElementById("login-google");
    const loginEmail = document.getElementById("login-email");
    const logoutBtn = document.getElementById("logout");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
   
       const titleInput = document.getElementById("edit-title");
       const summaryInput = document.getElementById("edit-summary");
       const saveBtn = document.getElementById("save-edit");
       const cancelBtn = document.getElementById("cancel-edit");
       const quill = new Quill("#editor", { theme: "snow" });
       
       const urlParams = new URLSearchParams(window.location.search);
       const id = urlParams.get("id");
       const postRef = doc(db, "posts", id);
       
       async function loadPost() {
           const postSnap = await getDoc(postRef);
           if (postSnap.exists()) {
               const post = postSnap.data();
               if (titleInput) titleInput.value = post.title || "";
               if (summaryInput) summaryInput.value = post.summary || "";
               quill.root.innerHTML = post.content || "";
           } else {
           alert("Post not found.");
           window.location.href = "blog.html";
         }
       }
     
       //Editing logic
    
       
       if (saveBtn) {
           saveBtn.addEventListener("click", async () => {
             const newTitle = titleInput.value.trim();
             const plainText = quill.getText().trim()
             const newSummary = plainText.substring(0,300) + "...";
             const newContent = quill.root.innerHTML;
             
             if (!newTitle || !newContent) {
                 alert("Title and content are required.");
                 return;
               }
               
               await updateDoc(postRef, {
                   title: newTitle,
                   summary: newSummary,
                   content: newContent,
                   editedAt: serverTimestamp()
               });
               
               alert("Post updated!");
               window.location.href = "blog.html";
           });
       }
       onAuthStateChanged(auth, (user) => {
           if (!user || !ADMIN_EMAILS.includes(user.email)) {
               alert("only admins can edit posts.");
               window.location.href = "blog.html";
               return;
           }

           loginGoogle?.classList.add("hidden");
           loginEmail?.classList.add("hidden");
           emailInput?.classList.add("hidden");
           passwordInput?.classList.add("hidden");
           logoutBtn?.classList.remove("hidden");
       
           loadPost();
       
           
       
           const cancelBtn = document.getElementById("cancel-edit");
         if (cancelBtn) {
             cancelBtn.addEventListener("click", () => {
                 if (confirm("Discard changes and return to blog?")) {
                     window.location.href = "blog.html";
                 }
             });
         }
     });

     const userGreeting = document.getElementById("user-greeting");

    onAuthStateChanged(auth, (user) => {
      if (userGreeting) {
        userGreeting.textContent = user ? `Welcome, ${user.email}` : "";
      }
    });

   });



   
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








/*if (saveBtn) {
    
saveBtn.addEventListener("click", async () => {
    const newTitle = titleInput.value.trim();
    const newSummary = summaryInput.value.trim();
    const newContent = quill.root.innerHTML;
    
    if (!newTitle || !newContent) {
        alert("Title and content are required.");
        return;
        }
        
        await updateDoc(postRef, {
            title: newTitle,
            summary: newSummary,
            content: newContent,
            editedAt: serverTimestamp()
            });
            } 
            
            /*
            const postRef = doc(db, "posts", id);
            await updateDoc(postRef, {
                title: newTitle,
                summary: newSummary,
                content: newContent,
                
                });
                
                alert("Post updated!");
        window.location.href = "blog.html";
      });*/

        
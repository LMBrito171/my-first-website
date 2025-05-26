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
   const provider = new GoogleAuthProvider ();
   window.firebase = { db, collection, getDocs, addDoc };
   window.firebase.auth = auth;
   window.firebase.provider = provider; 
  
   const ADMIN_EMAILS = ["batataplaygames@gmail.com", "test@test.com"];
const container = document.getElementById("drafts-container");

onAuthStateChanged(auth, async (user) => {
  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    container.innerHTML = "<p>You don't have access to view drafts.</p>";
    return;
  }
  const draftsQuery = query(collection(db, "posts"), where("isDraft", "==", true));
  const querySnapshot = await getDocs(draftsQuery);

  if (querySnapshot) {
    container.innerHTML = `<p>No drafts available.</p>`;
    return;
  }
  querySnapshot.forEach((docSnap) => {
    const draft = docSnap.data();
    const docId = docSnap.id;

    const draftDiv = document.createElement("div");
    draftDiv.classList.add("draft-preview");

    draftDiv.innerHTML = `
    <h3>${draft.title || "(Untitled Draft"}</h3>
    <p>${draft.summary || "No summary provided."}</p>
    <p><small>Last edited: ${draft.editedAt?.todate?.().toLocaleDateString("pt-BR") || "N/A"}</small></p>
    <a href="edit-post.html?id${docId}">Cotinue Editing</a>
    <button data-id="${docId}" class="delete-draft">Delete</button>
    <hr>
    `;
    container.appendChild(draftDiv);
  })
  
  document.addEventListener("click", async (e) => {
      if (e.target.classList.contains("delete-draft")) {
          const id = e.target.database.id;
          if (confirm("Are you sure you want to delete this draft?")) {
              await deleteDoc(doc(db, "posts", id));
              location.reload();
          }
      }
  });
});
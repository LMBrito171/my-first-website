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
  
//inject dropdown

const container = document.createElement("div");
container.id = "auth-dropdown";
container.innerHTML = `
  <div id="user-menu">
    <button id="user-toggle">👤</button>
    <div id="user-dropdown">
      <div id="auth-logged-in" style="display: none;">
        <p id="user-info">Logged in</p>
        <button id="logout-btn">Logout</button>
      </div>
      <div id="auth-logged-out" style="display: none;">
        <input type="email" id="dropdown-email" placeholder="Email" />
        <input type="password" id="dropdown-password" placeholder="Password" />
        <button id="login-email-btn">Login with Email</button>
        <button id="login-google-btn">Login with Google</button>
      </div>
    </div>
  </div>
`;
document.body.appendChild(container);

//toggle Dropdown

document.addEventListener("click", (e) => {
    if (e.target.id === "user-toggle") {
        const dropdown = document.getElementById("user-dropdown");
        dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
    } else {
        const dropdown = document.getElementById("user-dropdoen");
        if (dropdown && !document.getElementById("user-menu").contains(e.target)) {
            dropdown.style.display = "none";
        }
    }
});

onAuthStateChanged(auth, (user) => {
    const loggedInSection = document.getElementById("auth-logged-in");
    const loggedOutSection = document.getElementById("auth-logged-out");
    const info = document.getElementById("user-info");
    const logoutBtn = document.getElementById("logout-btn");
    
    if (user) {
        loggedInSection.style.display = "block";
        loggedOutSection.style.display = "none";
        info.textContent = `Logged in as ${user.email}`;
        logoutBtn.onclick = () => signOut(auth);
    } else {
        loggedInSection.style.display = "none";
        loggedOutSection.style.display = "block";
        info.textContent = "Not logged in";
        logoutBtn.style.display = "none";
    }
    
        if (logoutBtn) {
            logoutBtn.addEventListener("click", () =>{
                signOut(auth)
                    .then(() => {
                        console.log("User signed out.");
                        window.location.reload();
                    })
                    .catch((error) => {
                        console.error("Sign out Error:", error);
                    })
            })
        }
});

document.getElementById("login-google-btn").addEventListener("click", () => {
    signInWithPopup(auth, new GoogleAuthProvider()).catch(console.error);
});

  document.getElementById("login-email-btn").addEventListener("click", () => {
    const email = document.getElementById("dropdown-email").value;
    const password = document.getElementById("dropdown-password").value;
    signInWithEmailAndPassword(auth, email, password).catch(console.error)
  });

  document.getElementById("logout-btn").addEventListener("click", () => {
    signOut(auth).catch(console.error);
  });
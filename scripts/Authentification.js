import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQtabUkoAwVD1GQDQUkRrRLktGUbwylgo",
  authDomain: "practice-12763.firebaseapp.com",
  projectId: "practice-12763",
  storageBucket: "practice-12763.appspot.com",
  messagingSenderId: "115593710037",
  appId: "1:115593710037:web:d980b820ae814337fe555c"
};

export function authentication() {
  document.addEventListener("DOMContentLoaded", () => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    // Sign-In Form
    const signInForm = document.querySelector('.signInForm');
    if (signInForm) {
      signInForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("signInEmail").value;
        const password = document.getElementById("signInPassword").value;

        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            console.log("User signed in successfully:", user);
          
            window.location.href = "dashboard.html";
          })
          .catch((error) => {
            console.error("Error signing in:", error.message);
           
          });
      });
    }

    // Sign-Up Form
    const signUpForm = document.querySelector('.signUpForm');
    if (signUpForm) {
      signUpForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("signUpEmail").value;
        const password = document.getElementById("signUpPassword").value;
        const rePassword = document.getElementById("rePassword").value;
        const names = document.getElementById("signUpName").value;  // Capture names

        if (password !== rePassword) {
          alert("Passwords do not match!");
          return;
        }

        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            console.log("User registered successfully:", user);
            document.querySelector('.user')
            // Redirect to dashboard or store user info if needed
          })
          .catch((error) => {
            console.error("Error signing up:", error.message);
           
          });
      });
    }

    // Google Sign-In
    const googleIcon = document.querySelector('.google-icon');
    const provider = new GoogleAuthProvider();

    if (googleIcon) {
      googleIcon.addEventListener("click", () => {
        signInWithPopup(auth, provider)
          .then((result) => {
            const user = result.user;
            console.log("User signed in with Google:", user);
           
            window.location.href = "dashboard.html";
          })
          .catch((error) => {
            console.error("Error with Google Sign-In:", error.message);
            
          });
      });
    }

    // Auth State Listener
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const email = user.email; 

        const displayUser =  document.querySelector('.user');

       
        displayUser.innerHTML=` welcome ${email}`;
      } else {
        console.log("No user is signed in");
      }
    });
    
    document.addEventListener("DOMContentLoaded", () => {
      const signOutButton = document.querySelector('.signOutButton');
      if (signOutButton) {
        signOutButton.addEventListener("click", () => {
          signOut(auth)
            .then(() => {
              console.log("User signed out successfully.");
              window.location.href = "index.html"; // Redirect after signing out
            })
            .catch((error) => {
              console.error("Error signing out:", error);
            });
        });
      } else {
        console.error('Sign-out button not found');
      }
      
      // Additional code for handling sign-in/sign-up forms, Google sign-in, etc.
    });
    
    
  });
}


authentication();

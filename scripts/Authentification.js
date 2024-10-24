import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Firebase configuration
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
        const db = getFirestore(app);
        const provider = new GoogleAuthProvider();

        // Google Sign-In with Popup
        const googleIcon = document.querySelector('.google-icon');
        if (googleIcon) {
            googleIcon.addEventListener("click", () => {
                signInWithPopup(auth, provider)
                    .then(async (result) => {
                        const user = result.user;
                        console.log("User signed in with Google:", user);

                        // Check if the user already exists in Firestore
                        const userDoc = await getDoc(doc(db, "users", user.uid));
                        if (!userDoc.exists()) {
                            // Save user info to Firestore if it doesn't exist
                            await setDoc(doc(db, "users", user.uid), {
                                uid: user.uid,
                                email: user.email,
                            });
                        }

                        // Redirect to the dashboard
                        window.location.href = "dashboard.html";
                    })
                    .catch((error) => {
                        console.error("Error with Google Sign-In:", error.message);
                    });
            });
        }

        // Manual Sign-Up
        const signUpForm = document.querySelector('.signUpForm');
        if (signUpForm) {
            signUpForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const signUpEmail = document.getElementById('signUpEmail').value;
                const signUpPassword = document.getElementById('signUpPassword').value;

                createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
                    .then((userCredential) => {
                        const user = userCredential.user;

                        // Store the user info in Firestore and redirect to dashboard
                        setDoc(doc(db, "users", user.uid), {
                            uid: user.uid,
                            email: user.email,
                        }).then(() => {
                            console.log("User registered and data saved.");
                            window.location.href = "dashboard.html"; // Redirect to dashboard
                        }).catch((error) => {
                            console.error("Error saving user data:", error);
                        });
                    })
                    .catch((error) => {
                        console.error("Error with Sign-Up:", error.message);
                    });
            });
        }

        // Manual Sign-In
        const signInForm = document.querySelector('.signInForm');
        if (signInForm) {
            signInForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const signInEmail = document.getElementById('signInEmail').value;
                const signInPassword = document.getElementById('signInPassword').value;

                signInWithEmailAndPassword(auth, signInEmail, signInPassword)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        console.log("User signed in:", user);
                        window.location.href = "dashboard.html"; // Redirect to dashboard
                    })
                    .catch((error) => {
                        console.error("Error with Sign-In:", error.message);
                    });
            });
        }
     
        document.addEventListener("DOMContentLoaded",()=>{
                // Auth State Listener (For greeting and checking user state)
        onAuthStateChanged(auth, (user) => {
            const displayUser = document.querySelector('.user');
            if (user) {
                displayUser.innerHTML = `Welcome ${user.displayName || user.email.split('@')[0]}`; 
                console.log(user.displayName);
                
            } else {
                console.log("No user is signed in");
            }
        });
        })
   
        

        // Sign-Out button handler
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
        }
    });
}

authentication();

import { images } from "./profile.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDQtabUkoAwVD1GQDQUkRrRLktGUbwylgo",
    authDomain: "practice-12763.firebaseapp.com",
    projectId: "practice-12763",
    storageBucket: "practice-12763.appspot.com",
    messagingSenderId: "115593710037",
    appId: "1:115593710037:web:d980b820ae814337fe555c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Function to render activity in the DOM
function renderActivity(activity, id) {
    const activitiesContainer = document.querySelector('.activities');
  
    const activityHTML = `
        <div class="activity-container" data-id="${id}">
            <div class="activity-img">
                <img src="${activity.image}" alt="Activity Image">
            </div>
            <div class="activity">
                <h3 class="activity-header">${activity.title}</h3>
                <p class="description">${activity.description}</p>
            </div>
            <div class="activity-date"> 
                <p class="date">Start: ${activity.startDate}</p>
                <p class="date">End: ${activity.endDate}</p>
            </div>
           
            <button class="btn-delete">Delete</button>
        </div>
    `;
    activitiesContainer.insertAdjacentHTML('beforeend', activityHTML);
}

// Function to add study topics
export function addStudyTopic() {
    document.addEventListener("DOMContentLoaded", async () => {
       
        const description = document.querySelector('.description');
        const startDate = document.querySelector('.start-date');
        const endDate = document.querySelector('.end-date');
        const btnAdd = document.querySelector('.btn-add');
        const displayInputs = document.querySelector('.topi-add');
        let imageIndex = 0; // Track current image index

        const title = document.querySelector('.title');

        if (title) {
            title.addEventListener("click", () => {
                displayInputs.style.display = "block";
            });
        }
      
        // Fetch existing study topics when the user is authenticated
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userTopicsRef = collection(db, "users", user.uid, "topics");
                const querySnapshot = await getDocs(userTopicsRef);
                
                // Clear current contents before rendering fetched data
                document.querySelector('.activities').innerHTML = '';

                querySnapshot.forEach((doc) => {
                    const activityData = doc.data();
                    renderActivity(activityData, doc.id); // Pass the document ID
                });

                // Ensure the event listener is not added multiple times
                if (btnAdd && !btnAdd.hasAttribute('data-listener-added')) {
                    btnAdd.addEventListener("click", async () => {
                        const selectedImage = images[imageIndex].image;

                        // Create the new study topic
                        const newActivity = {
                            title: title.value,
                            description: description.value,
                            startDate: startDate.value,
                            endDate: endDate.value,
                            image: selectedImage
                        };

                        try {
                            await addDoc(userTopicsRef, newActivity);
                            console.log("New study topic added to Firestore for user:", user.uid);
                        } catch (error) {
                            console.error("Error adding document to Firestore:", error);
                        }

                        // Render the new activity in the DOM
                        renderActivity(newActivity, null);

                        // Clear input fields
                        title.value = "";
                        description.value = "";
                        startDate.value = "";
                        endDate.value = "";

                        // Increment the imageIndex
                        imageIndex = (imageIndex + 1) % images.length;
                    });

                    // Event delegation for Edit and Delete buttons
                    const activitiesContainer = document.querySelector('.activities');
                    activitiesContainer.addEventListener("click", async (event) => {
                        const target = event.target;
                        const activityContainer = target.closest('.activity-container');
                        const activityId = activityContainer.getAttribute('data-id');

                        if (target.classList.contains('btn-delete')) {
                            try {
                                await deleteDoc(doc(db, "users", user.uid, "topics", activityId));
                                console.log("Activity deleted successfully!");

                                // Remove the activity from the DOM
                                activitiesContainer.removeChild(activityContainer);
                            } catch (error) {
                                console.error("Error deleting document:", error);
                            }
                        }
                    });

                    btnAdd.setAttribute('data-listener-added', 'true');
                }
            } else {
                console.log("No user is signed in.");
            }
        });
    });
}

// Call the function to initialize
addStudyTopic();

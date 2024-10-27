import { images } from "./profile.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
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

// Function to render activities in the DOM
function renderActivity(activity, id, container) {
    const activityHTML = `
        <div class="activity-container ${activity.completed ? 'completed' : ''}" data-id="${id}">
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
            <button class="btn-complete">
                ${activity.completed ? 'Completed' : 'Complete'}
            </button>
            <button class="btn-delete">Delete</button>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', activityHTML);
}

// Function to filter activities based on status
function filterActivities(filter) {
    const activitiesContainer = document.querySelector('.activities');
    const allActivities = activitiesContainer.querySelectorAll('.activity-container');

    allActivities.forEach(activity => {
        const isCompleted = activity.classList.contains('completed');
        const activityStartDate = new Date(activity.querySelector('.activity-date .date').textContent.split(': ')[1]);
        const currentDate = new Date();

        switch (filter) {
            case 'All':
                activity.style.display = 'block';
                break;
            case 'Active':
                activity.style.display = isCompleted ? 'none' : 'block';
                break;
            case 'Upcoming':
                activity.style.display = activityStartDate > currentDate ? 'block' : 'none';
                break;
            case 'Completed':
                activity.style.display = isCompleted ? 'block' : 'none';
                break;
        }
    });
}

// Function to add study topics
export function addStudyTopic() {
    document.addEventListener("DOMContentLoaded", async () => {
        const description = document.querySelector('.description');
        const startDate = document.querySelector('.start-date');
        const endDate = document.querySelector('.end-date');
        const btnAdd = document.querySelector('.btn-add');
        const displayInputs = document.querySelector('.topi-add');
        let imageIndex = 0;
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
                const activitiesContainer = document.querySelector('.activities');
                activitiesContainer.innerHTML = '';

                querySnapshot.forEach((doc) => {
                    const activityData = doc.data();
                    renderActivity(activityData, doc.id, activitiesContainer);
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
                            image: selectedImage,
                            completed: false // Initialize as not completed
                        };

                        try {
                            await addDoc(userTopicsRef, newActivity);
                            console.log("New study topic added to Firestore for user:", user.uid);
                        } catch (error) {
                            console.error("Error adding document to Firestore:", error);
                        }

                        // Render the new activity in the DOM
                        renderActivity(newActivity, null, activitiesContainer);

                        // Clear input fields
                        title.value = "";
                        description.value = "";
                        startDate.value = "";
                        endDate.value = "";

                        // Increment the imageIndex
                        imageIndex = (imageIndex + 1) % images.length;
                    });

                    // Event delegation for Complete and Delete buttons
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
                          let btnComplete = document.querySelector('.btn-complete');
                        if (btnComplete) {
                            // Mark activity as completed
                            try {
                                await updateDoc(doc(db, "users", user.uid, "topics", activityId), { completed: true });
                                console.log("Activity marked as completed!");

                                // Update the UI
                               btnComplete.textContent = "Completed"
                             
                            } catch (error) {
                                console.error("Error updating document:", error);
                            }
                        }
                    });

                    // Event listener for filter buttons
                    const filterButtons = document.querySelectorAll('.activity-list button[data-filter]');
                    filterButtons.forEach(button => {
                        button.addEventListener('click', (e) => {
                            const filter = e.target.getAttribute('data-filter');
                            filterActivities(filter);
                        });
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

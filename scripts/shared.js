import { images } from "./profile.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

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
        </div>
    `;
    activitiesContainer.insertAdjacentHTML('beforeend', activityHTML);
}

// Function to fetch and display study topics
export function fetchAndDisplayStudyTopics() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userTopicsRef = collection(db, "users", user.uid, "topics");
            const querySnapshot = await getDocs(userTopicsRef);
            
            document.querySelector('.activities').innerHTML = ''; // Clear previous activities
            
            querySnapshot.forEach((doc) => {
                const activityData = doc.data();
                renderActivity(activityData, doc.id); // Pass document ID
            });
        } else {
            console.log("No user is signed in.");
        }
    });
}

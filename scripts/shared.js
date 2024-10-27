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

// Function to render only the day and title of activities in the DOM
function renderSchedule(activity, id) {
    const schedulesContainer = document.querySelector('.schedules');
    if (!schedulesContainer) return;

    const startDate = new Date(activity.startDate);
    const day = startDate.toLocaleDateString('en-US', { weekday: 'long' });
    const isCoursesPage = window.location.pathname.includes('courses.html');

    const activityHTML = `
        <div class="schedule-container" data-id="${id}">
            <div class="schedule-date">
                <p class="day">${day}</p> 
            </div>
            <div class="activity">
                <h1 class="title-header">${activity.title}</h1>
            </div>
            ${isCoursesPage ? `<button class="btn-delete">Delete</button>` : ''}
        </div>
    `;

    schedulesContainer.insertAdjacentHTML('beforeend', activityHTML);
}

// Function to render activities in the DOM
function renderActivity(activity, id) {
    const activitiesContainer = document.querySelector('.activities');
    if (!activitiesContainer) return;

    const isCoursesPage = window.location.pathname.includes('courses.html');

    const activityHTML = `
        <div class="activity-container ${activity.completed ? 'completed' : ''}" data-id="${id}">
            <div class="activity-img">
                <img src="${activity.image || 'default.jpg'}" alt="Activity Image">
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
            ${isCoursesPage ? `<button class="btn-delete">Delete</button>` : ''}
        </div>
    `;

    activitiesContainer.insertAdjacentHTML('beforeend', activityHTML);
}

function addActivityEventListeners(user) {
    const activitiesContainer = document.querySelector('.activities');
    const schedulesContainer = document.querySelector('.schedules');

    if (!activitiesContainer) return;

    activitiesContainer.addEventListener("click", async (event) => {
        const target = event.target;
        const activityContainer = target.closest('.activity-container');
        const activityId = activityContainer?.getAttribute('data-id');

        if (!activityId) {
            console.error("No activity ID found for this action.");
            return;
        }

        // Handle deletion
        if (target.classList.contains('btn-delete')) {
            try {
                await deleteDoc(doc(db, "users", user.uid, "topics", activityId));
                activityContainer.remove();

                // Remove from schedules if it exists there
                const scheduleItem = schedulesContainer.querySelector(`.schedule-container[data-id="${activityId}"]`);
                if (scheduleItem) scheduleItem.remove();
            } catch (error) {
                console.error("Error deleting document:", error);
            }
        }

        // Handle completion
        if (target.classList.contains('btn-complete')) {
            const isCompleted = activityContainer.classList.contains('completed');
            const newStatus = !isCompleted;

            try {
                // Update Firebase to mark activity as completed or not
                await updateDoc(doc(db, "users", user.uid, "topics", activityId), { completed: newStatus });
                activityContainer.classList.toggle('completed', newStatus);
                target.textContent = newStatus ? "Completed" : "Complete";

                // Dynamically add or remove from schedules based on completion status
                const scheduleItem = schedulesContainer.querySelector(`.schedule-container[data-id="${activityId}"]`);
                if (newStatus) {
                    // Remove from schedules if completed
                    if (scheduleItem) scheduleItem.remove();
                } else {
                    // Add to schedules if incomplete and doesn't exist already
                    if (!scheduleItem) {
                        const activityData = {
                            title: activityContainer.querySelector('.activity-header').textContent,
                            startDate: activityContainer.querySelector('.activity-date .date').textContent.split(': ')[1]
                        };
                        renderSchedule(activityData, activityId);
                    }
                }
            } catch (error) {
                console.error("Error updating document:", error);
            }
        }
    });
}

// Function to fetch and display study topics from Firestore
export function fetchAndDisplayStudyTopics() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userTopicsRef = collection(db, "users", user.uid, "topics");
            const querySnapshot = await getDocs(userTopicsRef);

            const activitiesContainer = document.querySelector('.activities');
            if (activitiesContainer) activitiesContainer.innerHTML = '';

            const schedulesContainer = document.querySelector('.schedules');
            if (schedulesContainer) schedulesContainer.innerHTML = '';

            querySnapshot.forEach((doc) => {
                const activityData = doc.data();
                if (activitiesContainer) renderActivity(activityData, doc.id);
                
                // Only render in schedules if the activity is not completed
                if (schedulesContainer && !activityData.completed) {
                    renderSchedule(activityData, doc.id);
                }
            });

            addActivityEventListeners(user);
        } else {
            console.log("No user is signed in.");
        }
    });
}

// Function to filter activities based on the selected filter
function filterActivities(filter) {
    const activitiesContainer = document.querySelector('.activities');
    const allActivities = activitiesContainer.querySelectorAll('.activity-container');

    allActivities.forEach(activity => {
        const isCompleted = activity.classList.contains('completed');
        
        if (filter === 'All') {
            activity.style.display = 'flex';
        } else if (filter === 'Active') {
            activity.style.display = isCompleted ? 'none' : 'flex';
        } else if (filter === 'Completed') {
            activity.style.display = isCompleted ? 'flex' : 'none';
        }
    });
}

// Function to add event listeners for filter buttons
function addFilterListeners() {
    const filterButtons = document.querySelectorAll('.activity-list button[data-filter]');
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const filter = e.target.getAttribute('data-filter');
            filterActivities(filter);
        });
    });
}

// Initialize fetching and displaying topics, and adding filter listeners
document.addEventListener("DOMContentLoaded", () => {
    fetchAndDisplayStudyTopics();
    addFilterListeners();
});

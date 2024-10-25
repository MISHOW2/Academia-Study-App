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

// Function to render a schedule item (this will display under the 'Schedule' section)
function renderScheduleItem(topic) {
    const scheduleContainer = document.querySelector('.schedules');
    
    const scheduleItem = document.createElement('div');
    scheduleItem.classList.add('schedule-container');
    
    scheduleItem.innerHTML = `
        <div class="schedule-date">
            <p>${topic.date}</p>
        </div>
        <p>${topic.title}</p>
        
    `;
    
    scheduleContainer.appendChild(scheduleItem);
}

// Fetch and display study topics from Firestore
export function fetchAndDisplayStudyTopics() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userTopicsRef = collection(db, "users", user.uid, "topics");
            const querySnapshot = await getDocs(userTopicsRef);
            
            // Clear previous activities and schedules
            document.querySelector('.activities').innerHTML = ''; 
            document.querySelector('.schedules').innerHTML = ''; 
            
            querySnapshot.forEach((doc) => {
                const activityData = doc.data();
                
                // Render activity in 'My Courses' section
                renderActivity(activityData, doc.id);
                
                // Render schedule item in 'Schedule' section
                renderScheduleItem({
                    date: activityData.startDate.split('-')[2], // Example: extracting day from 'YYYY-MM-DD'
                    title: activityData.title,
                    time: `${activityData.startTime} - ${activityData.endTime}` // Assuming you store start and end times
                });
            });
        } else {
            console.log("No user is signed in.");
        }
    });
}

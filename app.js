// Import Firebase functions
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
// Import loglevel for logging
import log from 'loglevel';

// Initialize logger with "info" level
log.setLevel("info");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6zz1DchR_DbXfj_N5o0nlFA7Sczc_UI4",
  authDomain: "checklist-b02aa.firebaseapp.com",
  projectId: "checklist-b02aa",
  storageBucket: "checklist-b02aa.firebasestorage.app",
  messagingSenderId: "235681550518",
  appId: "1:235681550518:web:e4f45ea0b8295c51c0d617"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Register service worker
const sw = new URL('service-worker.js', import.meta.url);
if ('serviceWorker' in navigator) {
    const s = navigator.serviceWorker;
    s.register(sw.href, {
        scope: '/RUTH-RESPOSITORY/'  // Change this to match your repo name
    })
    .then(_ => log.info('Service Worker Registered for scope:', sw.href, 'with', import.meta.url))
    .catch(err => log.error('Service Worker Error:', err));
}

// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

// Add Task Event Listener
addTaskBtn.addEventListener('click', async () => {
    const task = taskInput.value.trim(); // Trim whitespace from the input
    if (task) {
        const taskText = sanitizeInput(task); // Sanitize the task text before saving
        log.info(`Attempting to add task: ${taskText}`);  // Log the user action
        await addTaskToFirestore(taskText); // Add sanitized task to Firestore
        taskInput.value = ''; // Clear the input field
    } else {
        alert("Please enter a task!"); // Show an error if the task is empty or whitespace
    }
});

// Sanitize Input to Prevent Harmful Data (like scripts)
function sanitizeInput(input) {
    const div = document.createElement("div");
    div.textContent = input; // This automatically escapes any HTML content
    return div.innerHTML; // Returns the sanitized text
}

// Add task to Firestore with error handling
async function addTaskToFirestore(taskText) {
    try {
        await addDoc(collection(db, "todos"), {
            text: taskText,
            completed: false,
        });
        log.info("Task added successfully!");  // Log success
    } catch (error) {
        log.error("Error adding task:", error);  // Log error
        alert("Failed to add task. Please try again.");
    }
}

// Delete task from Firestore
async function deleteTaskFromFirestore(taskId) {
    try {
        await deleteDoc(doc(db, "todos", taskId));
        log.info(`Task with ID: ${taskId} deleted successfully!`);  // Log success
    } catch (error) {
        log.error("Error deleting task:", error);  // Log error
        alert("Failed to delete task. Please try again.");
    }
}

// Add real-time updates for task rendering
function listenToTaskUpdates() {
    const todosRef = collection(db, "todos");
    onSnapshot(todosRef, (snapshot) => {
        taskList.innerHTML = ""; // Clear existing tasks
        if (snapshot.empty) {
            taskList.textContent = "No tasks found.";
        }
        snapshot.forEach((doc) => {
            const task = doc.data();
            const taskItem = document.createElement("li");
            taskItem.id = doc.id; // Use Firestore document ID
            taskItem.textContent = task.text;
            taskItem.tabIndex = 0; // Make task item focusable via keyboard
            taskList.appendChild(taskItem);
        });
    });
}

// Initialize real-time updates
listenToTaskUpdates();

// Remove task on click with Firestore deletion
taskList.addEventListener("click", async (e) => {
    if (e.target.tagName === "LI") {
        const taskId = e.target.id;
        log.info(`Attempting to delete task with ID: ${taskId}`);  // Log user action
        await deleteTaskFromFirestore(taskId);
    }
});

// Fetch tasks from Firestore (if not using real-time updates)
async function renderTasks() {
    var tasks = await getTasksFromFirestore();
    taskList.innerHTML = ""; // Clear existing tasks

    tasks.forEach((task) => {
        if (!task.data().completed) {
            const taskItem = document.createElement("li");
            taskItem.id = task.id;
            taskItem.textContent = task.data().text;
            taskItem.tabIndex = 0; // Make task item focusable via keyboard
            taskList.appendChild(taskItem);
        }
    });
}

// Fetch tasks from Firestore (with error handling)
async function getTasksFromFirestore() {
    try {
        const data = await getDocs(collection(db, "todos"));
        let userData = [];
        data.forEach((doc) => {
            userData.push(doc);
        });
        return userData;
    } catch (error) {
        log.error("Error fetching tasks:", error);  // Log error
        alert("Failed to load tasks. Please try again.");
        return [];
    }
}

// Global error logging
window.addEventListener('error', function (event) {
    log.error('Error occurred: ', event.message);  // Log unhandled errors
});

// Fetch and render tasks when the app loads (if not using real-time updates)
window.onload = () => {
    renderTasks(); // Fetch and display tasks
};

// New Event Listener for Enter key to add task when in the input field
taskInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addTaskBtn.click();
    }
});

// Event Listener to mark task as completed on "Enter" key press
taskList.addEventListener("keypress", async function(e) {
    if (e.target.tagName === 'LI' && e.key === "Enter") {
        // Mark the task as completed in Firestore
        await updateDoc(doc(db, "todos", e.target.id), {
            completed: true
        });
        log.info(`Task with ID: ${e.target.id} marked as completed.`);  // Log completion action
    }
    // Re-render the tasks to reflect the change
    renderTasks();
});










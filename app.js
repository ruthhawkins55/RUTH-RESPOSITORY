// Import Firebase functions
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

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
    .then(_ => console.log('Service Worker Registered for scope:', sw.href, 'with', import.meta.url))
    .catch(err => console.error('Service Worker Error:', err));
}

// Add Task functionality
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

// Add Task Event Listener
addTaskBtn.addEventListener('click', async () => {
    const task = taskInput.value.trim();
    if (task) {
        const taskText = sanitizeInput(task); // Sanitize the task text before saving
        await addTaskToFirestore(taskText); // Add sanitized task to Firestore
        renderTasks(); // Render tasks
        taskInput.value = ''; // Clear the input field
    }
});

// Sanitize Input to Prevent Harmful Data (like scripts)
function sanitizeInput(input) {
    const div = document.createElement("div");
    div.textContent = input; // This automatically escapes any HTML content
    return div.innerHTML; // Returns the sanitized text
}

// Add task to Firestore
async function addTaskToFirestore(taskText) {
    await addDoc(collection(db, "todos"), {
        text: taskText,
        completed: false
    });
}

// Fetch tasks from Firestore and render them
async function renderTasks() {
    var tasks = await getTasksFromFirestore();
    taskList.innerHTML = ""; // Clear existing tasks

    tasks.forEach((task) => {
        if (!task.data().completed) {
            const taskItem = document.createElement("li");
            taskItem.id = task.id;
            taskItem.textContent = task.data().text;
            taskList.appendChild(taskItem);
        }
    });
}

// Fetch tasks from Firestore
async function getTasksFromFirestore() {
    const data = await getDocs(collection(db, "todos"));
    let userData = [];
    data.forEach((doc) => {
        userData.push(doc);
    });
    return userData;
}

// Remove Task on Click
taskList.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        e.target.remove();
    }
});

// Global error logging
window.addEventListener('error', function (event) {
    console.error('Error occurred: ', event.message);
});

// Fetch and render tasks when the app loads
window.onload = () => {
    renderTasks(); // Fetch and display tasks
};





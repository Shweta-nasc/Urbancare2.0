// dashboard.js

// --- CONFIGURATION ---
const API_BASE_URL = 'http://your-backend-server.com/api'; 
const MAP_CENTER = [28.6139, 77.2090]; // New Delhi, India

// --- 1. System Status & Time ---
function updateLocalTime() {
    const timeElement = document.getElementById('local-time');
    if (timeElement) {
        timeElement.textContent = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
}
setInterval(updateLocalTime, 1000); // Update every second

// --- 2. Initialize Map ---
const map = L.map('mapid').setView(MAP_CENTER, 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// --- 3. Function to Handle Button Actions ---
function handleIssueAction(event) {
    const button = event.target;
    const card = button.closest('.issue-card');
    const issueId = card ? card.getAttribute('data-issue-id') : null; 
    
    if (!issueId) return console.error('Issue ID not found.');

    if (button.classList.contains('resolve-btn')) {
        alert(`API CALL: Marking issue ${issueId} as resolved.`);
        // In production: fetch(`${API_BASE_URL}/issues/${issueId}/resolve`, { method: 'PUT' });
    } else if (button.classList.contains('view-details')) {
        window.location.href = `pending_issues.html?issueId=${issueId}`;
    } else if (button.classList.contains('tool-button')) {
        if (button.textContent === 'Send Alert') alert('API CALL: Sending emergency dispatch alert.');
        if (button.textContent === 'Generate Today') alert('API CALL: Generating today\'s summary report.');
    }
}

// --- 4. Function to Fetch and Populate Statistics ---
async function loadDashboardStats() {
    // Placeholder Data 
    const data = { pending: 250, resolved: 1200, locations: 45 }; 
    document.getElementById('pending-count').textContent = data.pending;
    document.getElementById('resolved-count').textContent = data.resolved;
    document.getElementById('active-locations-count').textContent = data.locations;
}

// --- 5. Function to Fetch and Populate Recent Issues ---
async function loadRecentIssues() {
    const issueListContainer = document.getElementById('recent-activity-list');
    issueListContainer.innerHTML = ''; 

    // Placeholder data array
    const issues = [
        { id: 'I001', title: 'Pothole on Main Street', location: 'Downtown', status: 'pending', reportedAgo: '2 days ago', lat: 28.62, lng: 77.21, actionText: 'Mark as Resolved' },
        { id: 'I002', title: 'Broken Streetlight - Elm Ave', location: 'North Side', status: 'resolved', reportedAgo: '3 days ago', lat: 28.6, lng: 77.19, actionText: 'View Details' }
    ];

    issues.forEach(issue => {
        const actionClass = issue.status === 'pending' ? 'resolve-btn' : 'view-details';
        const cardHtml = `
            <div class="issue-card ${issue.status} animate-on-scroll delay-4" data-issue-id="${issue.id}">
                <h3>${issue.title}</h3>
                <p><strong>Location:</strong> ${issue.location}</p>
                <p><strong>Status:</strong> ${issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}</p>
                <button class="btn ${actionClass}">${issue.actionText}</button>
            </div>
        `;
        issueListContainer.innerHTML += cardHtml;
        
        L.marker([issue.lat, issue.lng]).addTo(map)
            .bindPopup(`<b>${issue.title}</b><br>Status: ${issue.status}`);
    });
    
    // Attach event listeners after loading content
    document.querySelectorAll('.issue-card button, .tool-card button').forEach(button => {
        button.addEventListener('click', handleIssueAction);
    });
}

// --- 6. Scroll Animation Logic (Intersection Observer) ---
const observerOptions = {
    root: null, threshold: 0.15 
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-in-view');
            observer.unobserve(entry.target); 
        }
    });
}, observerOptions);

function initializeScrollAnimation() {
    const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll, .motion-panel .motion-item');
    animateOnScrollElements.forEach(element => {
        observer.observe(element);
    });
}

// EXECUTION
document.addEventListener('DOMContentLoaded', () => {
    updateLocalTime(); // Initial time display
    loadDashboardStats();
    loadRecentIssues();
    initializeScrollAnimation(); 
});

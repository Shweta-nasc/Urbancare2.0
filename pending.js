// pending.js

// --- CONFIGURATION ---
const API_BASE_URL = 'http://your-backend-server.com/api'; 
const MAP_CENTER = [28.6139, 77.2090]; // New Delhi

let currentIssueId = null; 

// --- 1. Map Initialization ---
const detailMap = L.map('detail-map').setView(MAP_CENTER, 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(detailMap);
let currentMarker = L.marker(MAP_CENTER).addTo(detailMap).bindPopup("Map Initialized").openPopup();


// --- 2. Mock Data (Matches HTML placeholders) ---
const MOCK_ISSUES = [
    { id: 'I001', title: 'Critical Water Pipeline Burst - Connaught Place', location: 'Radial Road 2, New Delhi', reportedAgo: '2h ago', votes: 1250, priority: 'High', status: 'pending', lat: 28.6139, lng: 77.2090, description: 'A major water pipeline burst near the Outer Circle is flooding the road and causing major traffic disruption. The area needs immediate blockage and repair.', comments: [{user:'Delhi Jal Board', text:'Initial assessment complete.'}, {user:'Resident (Ravi S.)', text:'The water is knee-deep...'}] },
    { id: 'I002', title: 'Broken Traffic Signal - Bandra Kurla Complex (BKC)', location: 'Near Jio World Centre, Mumbai', reportedAgo: '1 day ago', votes: 480, priority: 'Medium', status: 'pending', lat: 19.0760, lng: 72.8777, description: 'Signal malfunctioning, causing chaos.', comments: [{user:'Admin', text:'Assigned to Electrical Dept.'}] },
    { id: 'I003', title: 'Illegal Dumping near Lalbagh Garden', location: 'Sudhama Nagar, Bangalore', reportedAgo: '5 days ago', votes: 85, priority: 'Low', status: 'pending', lat: 12.9716, lng: 77.5946, description: 'Illegal dumping ground is expanding.', comments: [] }
];

// --- 3. CORE LOGIC FUNCTIONS ---

// Function to generate the HTML for comments
function generateCommentsHtml(comments) {
    let commentsHtml = `<h5>💬 Comments (${comments.length})</h5>`;
    comments.forEach(c => {
        const adminClass = c.user.includes('Dept') || c.user.includes('Board') ? '' : 'user-comment';
        commentsHtml += `
            <div class="comment ${adminClass}">
                <strong>${c.user}:</strong> ${c.text}
            </div>
        `;
    });
    return commentsHtml;
}

// Function to update the right detail panel
function loadIssueDetails(issue) {
    currentIssueId = issue.id;
    
    // Update Map
    detailMap.setView([issue.lat, issue.lng], 15); 
    currentMarker.remove();
    currentMarker = L.marker([issue.lat, issue.lng]).addTo(detailMap)
        .bindPopup(issue.title).openPopup();
    
    // Render Details Panel
    const detailContent = `
        <h4>${issue.title}</h4>
        <p class="detail-status">Status: ${issue.status.toUpperCase()} | **Priority: ${issue.priority.toUpperCase()}**</p>
        <p>${issue.description}</p>
        
        <div class="comments-section">
            ${generateCommentsHtml(issue.comments)}
        </div>
    `;
    document.getElementById('detail-content-placeholder').innerHTML = detailContent;
    document.getElementById('comment-form').style.display = 'block';
}


// --- 4. EVENT BINDING ---

function bindEventListeners() {
    document.querySelectorAll('.priority-issue-card').forEach(card => {
        const issueId = card.getAttribute('data-issue-id');
        // Find the full issue data from the mock array
        const issue = MOCK_ISSUES.find(i => i.id === issueId); 

        // A) Load details on card area click (excluding buttons)
        card.addEventListener('click', (e) => {
            // Check if the click target or its parent is a button
            if (!e.target.closest('button')) {
                loadIssueDetails(issue); // Load details and map for the issue
            }
        });
        
        // B) Handle button clicks (Assign Task / View Map)
        card.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevents card click event from firing
                const action = button.getAttribute('data-action');
                
                if (action === 'assign') {
                    alert(`API CALL: Assigning task for issue ${issueId} to relevant department.`);
                    // fetch(`${API_BASE_URL}/issues/${issueId}/assign`, { method: 'POST' });
                } else if (action === 'map') {
                    loadIssueDetails(issue); // Load details and center map
                }
            });
        });
    });
}

// Handler for the comment submission form
document.getElementById('comment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentIssueId) return alert("Please select an issue first.");
    
    const commentText = document.getElementById('comment-text').value;
    if (commentText.trim() === '') return;

    alert(`API CALL: Posting comment for Issue ${currentIssueId} and updating status with: "${commentText}"`);
    
    // API Call placeholder
    // fetch(`${API_BASE_URL}/issues/${currentIssueId}/comment`, { method: 'POST', body: JSON.stringify({ comment: commentText }) });
    
    document.getElementById('comment-text').value = '';
    // After successful POST, ideally you would reload the details panel: loadIssueDetails(currentIssueId); 
});


// INITIALIZE
document.addEventListener('DOMContentLoaded', () => {
    bindEventListeners();
    
    // Load the details of the very first card upon page load for initial view
    if (MOCK_ISSUES.length > 0) {
        loadIssueDetails(MOCK_ISSUES[0]);
    }
    
    // The sort filter functionality
    document.getElementById('sort-filter').addEventListener('change', (e) => {
        alert(`API CALL: Requesting issues sorted by: ${e.target.value}`);
    });
});

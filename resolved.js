// resolved.js

// --- CONFIGURATION ---
// IMPORTANT: Replace this with your actual backend server URL!
const API_BASE_URL = 'http://your-backend-server.com/api'; 

// --- 1. Announcement Form Logic ---

// Show/hide fine details based on selection
document.getElementById('announcement-type').addEventListener('change', (e) => {
    const fineDetails = document.querySelector('.fine-details');
    // Display the fine inputs only if "Fine/Violation Notice" is selected
    fineDetails.style.display = (e.target.value === 'fine') ? 'flex' : 'none';
});

document.getElementById('announcement-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const type = document.getElementById('announcement-type').value;
    const title = document.getElementById('announcement-title').value;
    const body = document.getElementById('announcement-body').value;
    
    // Construct the data payload
    let postData = { type, title, body, postedBy: 'Admin Name' };

    if (type === 'fine') {
        postData = { 
            ...postData, 
            fineAmount: document.getElementById('fine-amount').value, 
            fineCode: document.getElementById('fine-code').value 
        };
        // Basic validation for fine
        if (!postData.fineAmount || !postData.fineCode) {
            return alert("Fine Amount and Code are required for violation notices.");
        }
    }
    
    // 1. API CALL PLACEHOLDER: Post Announcement
    alert(`API CALL: Posting new ${type.toUpperCase()} notice to public feed.`);
    
    /*
    // Uncomment this block in production:
    try {
        const response = await fetch(`${API_BASE_URL}/announcements/post`, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(postData)
        });
        if (!response.ok) throw new Error('Failed to post announcement.');
    */
    
    // 2. UI Update (Always run for immediate user feedback)
    document.getElementById('announcement-form').reset();
    document.querySelector('.fine-details').style.display = 'none';

    // Set icon based on type
    let icon = '📢';
    if (type === 'warning') icon = '⚠️';
    if (type === 'fine') icon = '🚫';
    if (type === 'rule') icon = '📋';

    const newAnnouncementHtml = `
        <div class="announcement ${type}">
            <h4>${icon} ${postData.title}</h4>
            <p>${postData.body}</p>
            ${type === 'fine' ? `<p><strong>Fine: ₹${postData.fineAmount}</strong> (Code: ${postData.fineCode})</p>` : ''}
            <span class="post-meta">Posted: Just now</span>
        </div>
    `;
    
    // Insert the new announcement at the top of the list
    document.getElementById('posted-announcements').insertAdjacentHTML('afterbegin', newAnnouncementHtml);
    
    // } catch (error) { console.error('Error posting announcement:', error); }
});

// --- 2. Resolved Issues Logic ---

// Function to handle the actions within resolved cards
function handleResolvedCardActions() {
    document.querySelectorAll('.resolved-issue-card button').forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.resolved-issue-card');
            // Assuming the issue ID is correctly stored on the card
            const issueId = card.getAttribute('data-issue-id'); 
            const action = e.target.getAttribute('data-action');

            if (action === 'report') {
                alert(`API CALL: Generating and downloading full report for Issue ${issueId}.`);
                // fetch(`${API_BASE_URL}/reports/generate/${issueId}`);
            } else if (action === 'share') {
                alert(`API CALL: Pushing success story for Issue ${issueId} to public feed.`);
                // fetch(`${API_BASE_URL}/public/share/success`, { method: 'POST', body: JSON.stringify({ issueId }) });
            }
        });
    });
}

// Function to fetch and display resolved issues
async function loadResolvedIssues() {
    // This function would fetch data from `${API_BASE_URL}/issues/resolved`
    // and dynamically populate the #resolved-issue-list container.
    console.log("Loading resolved issues dynamically from API...");
    
    // After content is loaded (or mocked):
    handleResolvedCardActions();
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    loadResolvedIssues();
});

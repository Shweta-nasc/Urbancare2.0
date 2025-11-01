// locations.js

// --- CONFIGURATION ---
const API_BASE_URL = 'http://your-backend-server.com/api'; 
const INDIA_CENTER = [28.6139, 77.2090]; // New Delhi

// --- MAP INITIALIZATION ---
const fullMap = L.map('full-map-container').setView(INDIA_CENTER, 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(fullMap);

const markerGroup = L.layerGroup().addTo(fullMap);

// --- FUNCTION TO LOAD MARKERS ---
async function loadMarkers(filterType = 'all') {
    markerGroup.clearLayers();

    // Placeholder data (simulating different location data from API)
    const locations = [
        { lat: 28.62, lng: 77.21, title: 'Pipeline Burst (CP)', status: 'pending' },
        { lat: 19.07, lng: 72.88, title: 'Traffic Signal Fix (Mumbai)', status: 'resolved' },
        { lat: 12.97, lng: 77.59, title: 'Illegal Dumping (Bangalore)', status: 'pending' }
    ];

    locations.forEach(loc => {
        if (filterType === 'all' || loc.status === filterType) {
            // NOTE: Custom icons would be used in a production app for better distinction
            L.marker([loc.lat, loc.lng])
                .bindPopup(`<b>${loc.title}</b><br>Status: ${loc.status}`)
                .addTo(markerGroup);
        }
    });
    
    // try { const response = await fetch(`${API_BASE_URL}/issues/locations?filter=${filterType}`); /* ... */ } catch (e) {}
}

// --- EVENT LISTENERS ---
document.getElementById('map-filter').addEventListener('change', (e) => {
    loadMarkers(e.target.value);
});

document.getElementById('recenter-map').addEventListener('click', () => {
    fullMap.setView(INDIA_CENTER, 5); 
});

// INITIAL LOAD
document.addEventListener('DOMContentLoaded', () => {
    loadMarkers('all');
});

/**
 * Gadarwara AutoSathi - Share Auto Directory & Fare Calculator Script
 * Rapido Ride Booking Simulation Mode
 */

// 1. Gadarwara Locations Map Database
const LOCATIONS = {
    'station': { name: 'Railway Station (रेलवे स्टेशन)', lat: 22.9288, lng: 78.7842 },
    'jawaharganj': { name: 'Jawahar Ganj (जवाहर गंज बाजार)', lat: 22.9234, lng: 78.7865 },
    'busstand': { name: 'New Bus Stand (नया बस स्टैंड)', lat: 22.9212, lng: 78.7811 },
    'mandi': { name: 'Krishi Upaj Mandi (कृषि मंडी)', lat: 22.9150, lng: 78.7830 },
    'hospital': { name: 'Civil Hospital (सिविल अस्पताल)', lat: 22.9255, lng: 78.7750 },
    'anandvihar': { name: 'Anand Vihar Colony (आनंद विहार कॉलोनी)', lat: 22.9270, lng: 78.7900 },
    'ashokvihar': { name: 'Ashok Vihar Colony (अशोक विहार कॉलोनी)', lat: 22.9210, lng: 78.7920 },
    'shaktinagar': { name: 'Shakti Nagar (शक्ति नगर)', lat: 22.9160, lng: 78.7880 },
    'trivedicolony': { name: 'Trivedi Colony (त्रिवेदी कॉलोनी)', lat: 22.9240, lng: 78.7720 },
    'gandhiward': { name: 'Gandhi Ward (गांधी वार्ड)', lat: 22.9220, lng: 78.7840 },
    'patelward': { name: 'Patel Ward (पटेल वार्ड)', lat: 22.9190, lng: 78.7860 },
    'jhandachowk': { name: 'Jhanda Chowk (झंडा चौक)', lat: 22.9225, lng: 78.7848 },
    'shakkarbridge': { name: 'Shakkar Bridge (शक्कर नदी पुल)', lat: 22.9320, lng: 78.7750 },
    'aamgaonnaka': { name: 'Aamgaon Naka (आमगांव नाका)', lat: 22.9180, lng: 78.7780 },
    'pipariyanaka': { name: 'Pipariya Naka (पिपरिया नाका)', lat: 22.9230, lng: 78.7650 },
    'gotegaonnaka': { name: 'Gotegaon Naka (गोटेगांव नाका)', lat: 22.9190, lng: 78.7950 },
    'bodariroad': { name: 'Bodari Road (बोदरी रोड / नाका)', lat: 22.9310, lng: 78.7890 }
};

// Available pre-defined routes
const ROUTES = {
    'station-jawaharganj': { id: 'station-jawaharganj', name: 'Station ⇆ Jawahar Ganj', start: 'station', end: 'jawaharganj' },
    'station-busstand': { id: 'station-busstand', name: 'Station ⇆ Bus Stand', start: 'station', end: 'busstand' },
    'anandvihar-station': { id: 'anandvihar-station', name: 'Anand Vihar ⇆ Station', start: 'anandvihar', end: 'station' },
    'ashokvihar-jawaharganj': { id: 'ashokvihar-jawaharganj', name: 'Ashok Vihar ⇆ Jawahar Ganj', start: 'ashokvihar', end: 'jawaharganj' },
    'trivedicolony-hospital': { id: 'trivedicolony-hospital', name: 'Trivedi Colony ⇆ Hospital', start: 'trivedicolony', end: 'hospital' },
    'shaktinagar-mandi': { id: 'shaktinagar-mandi', name: 'Shakti Nagar ⇆ Mandi', start: 'shaktinagar', end: 'mandi' },
    'busstand-jhandachowk': { id: 'busstand-jhandachowk', name: 'Bus Stand ⇆ Jhanda Chowk', start: 'busstand', end: 'jhandachowk' },
    'jhandachowk-mandi': { id: 'jhandachowk-mandi', name: 'Jhanda Chowk ⇆ Mandi', start: 'jhandachowk', end: 'mandi' },
    'station-hospital': { id: 'station-hospital', name: 'Station ⇆ Civil Hospital', start: 'station', end: 'hospital' },
    'gandhiward-station': { id: 'gandhiward-station', name: 'Gandhi Ward ⇆ Station', start: 'gandhiward', end: 'station' },
    'patelward-busstand': { id: 'patelward-busstand', name: 'Patel Ward ⇆ Bus Stand', start: 'patelward', end: 'busstand' },
    'jawaharganj-shakkarbridge': { id: 'jawaharganj-shakkarbridge', name: 'Jawahar Ganj ⇆ Shakkar Bridge', start: 'jawaharganj', end: 'shakkarbridge' },
    'station-pipariyanaka': { id: 'station-pipariyanaka', name: 'Station ⇆ Pipariya Naka', start: 'station', end: 'pipariyanaka' },
    'jawaharganj-gotegaonnaka': { id: 'jawaharganj-gotegaonnaka', name: 'Jawahar Ganj ⇆ Gotegaon Naka', start: 'jawaharganj', end: 'gotegaonnaka' },
    'bodariroad-station': { id: 'bodariroad-station', name: 'Bodari Road ⇆ Station', start: 'bodariroad', end: 'station' }
};

// 2. Default Initial Drivers Database
const DEFAULT_DRIVERS = [
    {
        id: 'driver-1',
        name: 'Rajesh Kushwaha (राजेश)',
        contact: '9876543210',
        autoNumber: 'MP-49-R-1234',
        routeId: 'station-jawaharganj',
        currentHub: 'station',
        seatFare: 15,
        reserveRate: 12,
        desc: 'समय पर पहुंचना और सुरक्षित यात्रा मेरी प्राथमिकता है। स्टेशन से बाजार व आनंद विहार कॉलोनी तक।',
        status: 'active',
        markerColor: 'yellow',
        avatar: '👨🏽',
        progress: 0.1,
        direction: 1
    },
    {
        id: 'driver-2',
        name: 'Sunil Vishwakarma (सुनील)',
        contact: '9823456789',
        autoNumber: 'MP-49-R-5678',
        routeId: 'anandvihar-station',
        currentHub: 'anandvihar',
        seatFare: 15,
        reserveRate: 12,
        desc: 'आनंद विहार कॉलोनी से रेलवे स्टेशन मार्ग पर शेयर सवारी के लिए संपर्क करें।',
        status: 'active',
        markerColor: 'orange',
        avatar: '👨🏻',
        progress: 0.6,
        direction: -1
    },
    {
        id: 'driver-3',
        name: 'Manoj Lodhi (मनोज)',
        contact: '9112345678',
        autoNumber: 'MP-49-R-9012',
        routeId: 'ashokvihar-jawaharganj',
        currentHub: 'ashokvihar',
        seatFare: 20,
        reserveRate: 12,
        desc: 'अशोक विहार कॉलोनी से जवाहर गंज बाजार तक उपलब्ध। रीजनेबल किराया।',
        status: 'active',
        markerColor: 'blue',
        avatar: '🧑🏽',
        progress: 0.3,
        direction: 1
    },
    {
        id: 'driver-4',
        name: 'Vijay Patel (विजय)',
        contact: '9345678901',
        autoNumber: 'MP-49-R-3456',
        routeId: 'trivedicolony-hospital',
        currentHub: 'trivedicolony',
        seatFare: 20,
        reserveRate: 14,
        desc: 'त्रिवेदी कॉलोनी और सिविल अस्पताल मार्ग पर नियमित सेवा।',
        status: 'busy',
        markerColor: 'orange',
        avatar: '👨🏽',
        progress: 0.9,
        direction: -1
    },
    {
        id: 'driver-5',
        name: 'Dinesh Sharma (दिनेश)',
        contact: '9456789012',
        autoNumber: 'MP-49-R-7890',
        routeId: 'shaktinagar-mandi',
        currentHub: 'shaktinagar',
        seatFare: 15,
        reserveRate: 12,
        desc: 'शक्ति नगर से कृषि मंडी तक सफर करें। सुरक्षित और आरामदायक।',
        status: 'active',
        markerColor: 'green',
        avatar: '👨🏼',
        progress: 0.05,
        direction: 1
    },
    {
        id: 'driver-6',
        name: 'Ramesh Patel (रमेश)',
        contact: '9877665544',
        autoNumber: 'MP-49-R-4433',
        routeId: 'gandhiward-station',
        currentHub: 'gandhiward',
        seatFare: 15,
        reserveRate: 12,
        desc: 'गांधी वार्ड से स्टेशन मार्ग का नियमित चालक।',
        status: 'offline',
        markerColor: 'red',
        avatar: '🧑🏼',
        progress: 0.0,
        direction: 1
    },
    {
        id: 'driver-7',
        name: 'Hari Shankar (हरि)',
        contact: '9654123890',
        autoNumber: 'MP-49-R-8899',
        routeId: 'patelward-busstand',
        currentHub: 'patelward',
        seatFare: 20,
        reserveRate: 12,
        desc: 'पटेल वार्ड से नया बस स्टैंड मार्ग। त्वरित सेवा।',
        status: 'active',
        markerColor: 'yellow',
        avatar: '👨🏻',
        progress: 0.75,
        direction: -1
    }
];

// 3. Application State
let drivers = [];
let activeRouteFilter = 'all';
let searchKeyword = '';
let map = null;
let mapMarkers = {}; // Keep track of driver Leaflet markers
let locationMarkers = {}; // Keep track of hub Leaflet markers

// Rapido Booking State variables
let selectedRideType = 'share'; // 'share' or 'reserve'
let bookedDriver = null;
let bookingProgressInterval = null;
let bookingStartLatLng = null; // Storing the coordinates of the driver when booking occurred

// DOM Elements
const driversGrid = document.getElementById('driversGrid');
const resultsCount = document.getElementById('resultsCount');
const searchInput = document.getElementById('searchInput');
const routeFilters = document.getElementById('routeFilters');
const emptyState = document.getElementById('emptyState');
const resetSearchBtn = document.getElementById('resetSearchBtn');

// Rapido Booking Panel DOM Elements
const startLocationSelect = document.getElementById('startLocation');
const endLocationSelect = document.getElementById('endLocation');
const bookingInputsArea = document.getElementById('bookingInputsArea');
const rideTypeSelector = document.getElementById('rideTypeSelector');

const optionShare = document.getElementById('optionShare');
const optionReserve = document.getElementById('optionReserve');
const sharePriceText = document.getElementById('sharePriceText');
const reservePriceText = document.getElementById('reservePriceText');
const routeDistanceInfo = document.getElementById('routeDistanceInfo');
const routeTimeInfo = document.getElementById('routeTimeInfo');

const bookRideBtn = document.getElementById('bookRideBtn');
const searchingState = document.getElementById('searchingState');
const progressBarFill = document.getElementById('progressBarFill');
const searchStatusText = document.getElementById('searchStatusText');
const cancelSearchBtn = document.getElementById('cancelSearchBtn');

const assignedState = document.getElementById('assignedState');
const arrivalETAText = document.getElementById('arrivalETAText');
const assignedDriverBox = document.getElementById('assignedDriverBox');
const cancelBookingBtn = document.getElementById('cancelBookingBtn');

// Modals Elements
const addDriverBtn = document.getElementById('addDriverBtn');
const registerModalOverlay = document.getElementById('registerModalOverlay');
const closeRegisterBtn = document.getElementById('closeRegisterBtn');
const cancelRegisterBtn = document.getElementById('cancelRegisterBtn');
const registerDriverForm = document.getElementById('registerDriverForm');

const detailsModalOverlay = document.getElementById('detailsModalOverlay');
const closeDetailsBtn = document.getElementById('closeDetailsBtn');
const detailsModalBody = document.getElementById('detailsModalBody');

// 4. Distance Calculation (Haversine formula)
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d * 1.25; // 1.25 factor for actual road tortuosity
}

// 5. Update Fares based on Pick/Drop selection
function updateFares() {
    const startKey = startLocationSelect.value;
    const endKey = endLocationSelect.value;

    if (!startKey || !endKey) return;

    if (startKey === endKey) {
        alert('पिकअप और ड्रॉप लोकेशन अलग-अलग होनी चाहिए।');
        endLocationSelect.value = '';
        rideTypeSelector.classList.add('hidden');
        return;
    }

    const startLoc = LOCATIONS[startKey];
    const endLoc = LOCATIONS[endKey];

    const dist = getDistance(startLoc.lat, startLoc.lng, endLoc.lat, endLoc.lng);
    const estTime = Math.ceil(dist * 2.5); // Estimate time based on speed

    // Share fare: Base ₹10, +₹3 per extra km, rounded to nearest 5
    let sharePrice = 10 + Math.max(0, dist - 2) * 3;
    sharePrice = Math.max(10, Math.round(sharePrice / 5) * 5);

    // Reserve fare: Base ₹50, +₹12 per extra km
    let reservePrice = 50 + dist * 12;
    reservePrice = Math.max(50, Math.round(reservePrice / 10) * 10);

    // Update texts
    sharePriceText.innerText = `₹ ${sharePrice}`;
    reservePriceText.innerText = `₹ ${reservePrice}`;
    routeDistanceInfo.innerText = `दूरी: ${dist.toFixed(1)} km`;
    routeTimeInfo.innerText = `समय: ${estTime} मिनट`;

    // Show selector
    rideTypeSelector.classList.remove('hidden');
}

// 6. Handle Ride Option Selection
optionShare.addEventListener('click', () => {
    optionShare.classList.add('active');
    optionReserve.classList.remove('active');
    selectedRideType = 'share';
});

optionReserve.addEventListener('click', () => {
    optionReserve.classList.add('active');
    optionShare.classList.remove('active');
    selectedRideType = 'reserve';
});

// 7. Simulating Live Booking
bookRideBtn.addEventListener('click', () => {
    const startKey = startLocationSelect.value;
    if (!startKey) return;

    // Transition UI to searching
    bookingInputsArea.classList.add('hidden');
    searchingState.classList.remove('hidden');
    
    let progress = 0;
    progressBarFill.style.width = '0%';
    searchStatusText.innerText = 'आसपास के चालकों को खोजा जा रहा है...';

    // Simulated status messages
    const statuses = [
        { limit: 25, msg: 'जीपीएस लोकेशन ट्रैक की जा रही है...' },
        { limit: 55, msg: 'किराया सुनिश्चित किया जा रहा है...' },
        { limit: 80, msg: 'नजदीकी चालकों से संपर्क किया जा रहा है...' },
        { limit: 95, msg: 'सवारी बुक की जा रही है...' }
    ];

    bookingProgressInterval = setInterval(() => {
        progress += 2;
        progressBarFill.style.width = `${progress}%`;

        // Update search status message
        const currentStatus = statuses.find(s => progress <= s.limit);
        if (currentStatus) {
            searchStatusText.innerText = currentStatus.msg;
        }

        // Search Complete
        if (progress >= 100) {
            clearInterval(bookingProgressInterval);
            assignDriver();
        }
    }, 50);
});

// 8. Assign Driver and transition to Confirmed state
function assignDriver() {
    const startKey = startLocationSelect.value;
    const endKey = endLocationSelect.value;

    // Filter available active/busy drivers
    let available = drivers.filter(d => d.status === 'active');
    
    // Fallback if no active drivers
    if (available.length === 0) {
        available = drivers.filter(d => d.status !== 'offline');
    }

    if (available.length === 0) {
        // No driver available
        searchingState.classList.add('hidden');
        bookingInputsArea.classList.remove('hidden');
        alert('क्षमा करें, अभी कोई ऑटो उपलब्ध नहीं है। कृपया थोड़ी देर बाद प्रयास करें।');
        return;
    }

    // Try to match driver whose route contains the pickup point
    let matched = available.filter(d => {
        const r = ROUTES[d.routeId];
        return r && (r.start === startKey || r.end === startKey);
    });

    // If no route matches, pick closest available driver
    if (matched.length === 0) {
        matched = available;
    }

    // Assign a driver randomly from matches
    bookedDriver = matched[Math.floor(Math.random() * matched.length)];
    bookedDriver.status = 'busy';
    
    // Save coordinate where the driver was booked to simulate pickup travel
    bookingStartLatLng = { lat: bookedDriver.lat, lng: bookedDriver.lng };
    bookedDriver.progress = 0.0; // Start pickup travel

    // Transition UI to assigned
    searchingState.classList.add('hidden');
    assignedState.classList.remove('hidden');

    // Update arrival ETA
    arrivalETAText.innerText = `ऑटो आपके पिकअप पॉइंट (${LOCATIONS[startKey].name.split(' (')[0]}) की ओर आ रहा है...`;

    // Fill Assigned Driver Card
    const priceLabel = selectedRideType === 'share' ? 'शेयर सीट' : 'रिजर्व बुकिंग';
    const finalFare = selectedRideType === 'share' ? sharePriceText.innerText : reservePriceText.innerText;

    assignedDriverBox.innerHTML = `
        <div class="card-header-main" style="margin-bottom: 12px;">
            <div class="driver-avatar" style="font-size: 2.2rem; width: 55px; height: 55px;">
                ${bookedDriver.avatar}
            </div>
            <div class="driver-identity">
                <h3 style="font-size: 1.1rem; color: var(--color-text-main);">${bookedDriver.name}</h3>
                <span class="auto-plate">${bookedDriver.autoNumber}</span>
            </div>
        </div>
        
        <div class="card-details" style="font-size: 0.88rem; gap: 6px;">
            <div>📍 पिकअप मार्ग: <strong>${LOCATIONS[bookedDriver.currentHub]?.name.split(' (')[0] || 'रास्ते में'} ➔ ${LOCATIONS[startKey].name.split(' (')[0]}</strong></div>
            <div>💳 किराया (${priceLabel}): <strong style="color:var(--color-primary); font-size:1.1rem;">${finalFare}</strong></div>
            <div>📞 फोन नंबर: <strong>${bookedDriver.contact}</strong></div>
        </div>

        <div class="card-actions" style="margin-top: 15px; gap: 10px;">
            <a href="tel:${bookedDriver.contact}" class="btn btn-primary action-btn" style="padding: 10px 0; justify-content: center;">
                📞 कॉल करें
            </a>
            <a href="https://wa.me/91${bookedDriver.contact}?text=नमस्ते%20${encodeURIComponent(bookedDriver.name)},%20मैने%20CHALOGE%20पर%20आपका%20ऑटो%20बुक%20किया%20है।%20कृपया%20पिकअप%20लोकेशन%20पर%20आएं।" target="_blank" class="btn btn-whatsapp action-btn" style="padding: 10px 0; justify-content: center; text-decoration:none;">
                💬 व्हाट्सएप
            </a>
        </div>
    `;

    // Open driver popup on Map and focus
    if (map && mapMarkers[bookedDriver.id]) {
        map.setView([bookedDriver.lat, bookedDriver.lng], 14);
        mapMarkers[bookedDriver.id].openPopup();
    }

    renderDrivers();
}

// 9. Cancel Booking flow
function cancelBooking() {
    if (bookedDriver) {
        bookedDriver.status = 'active';
        bookedDriver = null;
    }
    
    // Clear interval if searching
    if (bookingProgressInterval) {
        clearInterval(bookingProgressInterval);
    }

    // Reset UI
    assignedState.classList.add('hidden');
    searchingState.classList.add('hidden');
    bookingInputsArea.classList.remove('hidden');
    
    startLocationSelect.value = '';
    endLocationSelect.value = '';
    rideTypeSelector.classList.add('hidden');

    renderDrivers();
    updateMapMarkers();
}

cancelSearchBtn.addEventListener('click', cancelBooking);
cancelBookingBtn.addEventListener('click', cancelBooking);

// 10. Initialize Map
function initMap() {
    const centerCoords = [22.9213, 78.7842];
    
    if (typeof L === 'undefined') {
        console.error('Leaflet map library not loaded');
        return;
    }

    map = L.map('map', {
        center: centerCoords,
        zoom: 13,
        zoomControl: true
    });

    const googleRoadmap = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: '&copy; Google Maps'
    });

    const googleSatellite = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: '&copy; Google Maps'
    });

    const darkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO & OpenStreetMap',
        maxZoom: 20
    });

    // Default map layer
    googleRoadmap.addTo(map);

    const baseMaps = {
        "Google Maps (Road)": googleRoadmap,
        "Google Satellite (सैटेलाइट)": googleSatellite,
        "Dark Theme (डार्क मोड)": darkMatter
    };

    // Add layer switch controls on map
    L.control.layers(baseMaps, null, { position: 'topright' }).addTo(map);

    // Draw Hub Markers
    Object.keys(LOCATIONS).forEach(key => {
        const loc = LOCATIONS[key];
        const hubIcon = L.divIcon({
            className: 'custom-hub-marker',
            html: `<div style="background: rgba(0, 242, 254, 0.2); border: 2px solid #00f2fe; width: 14px; height: 14px; border-radius: 50%; box-shadow: 0 0 10px #00f2fe;"></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7]
        });

        locationMarkers[key] = L.marker([loc.lat, loc.lng], { icon: hubIcon })
            .addTo(map)
            .bindPopup(`<strong>📍 ${loc.name}</strong><br>ऑटो ठहराव केंद्र (Hub Stop)`);
    });
}

// 11. Update Map Markers
function updateMapMarkers() {
    if (!map) return;

    drivers.forEach(driver => {
        let lat, lng;

        if (driver === bookedDriver && bookingStartLatLng) {
            // Driver is booked! Interpolate position from booking start to pickup location
            const pickupKey = startLocationSelect.value;
            const pickupLoc = LOCATIONS[pickupKey];
            
            lat = bookingStartLatLng.lat + (pickupLoc.lat - bookingStartLatLng.lat) * driver.progress;
            lng = bookingStartLatLng.lng + (pickupLoc.lng - bookingStartLatLng.lng) * driver.progress;
        } else {
            // Normal route interpolation
            const route = ROUTES[driver.routeId];
            if (!route) return;

            const startLoc = LOCATIONS[route.start];
            const endLoc = LOCATIONS[route.end];

            lat = startLoc.lat + (endLoc.lat - startLoc.lat) * driver.progress;
            lng = startLoc.lng + (endLoc.lng - startLoc.lng) * driver.progress;
        }

        driver.lat = lat;
        driver.lng = lng;

        const statusClass = `status-${driver.status}`;
        const glowClass = driver.status === 'active' ? 'glow-active' : (driver.status === 'busy' ? 'glow-busy' : '');
        
        const autoIcon = L.divIcon({
            className: 'custom-auto-marker',
            html: `
                <div class="marker-wrapper ${statusClass} ${glowClass}">
                    <span>🛺</span>
                    <div class="pulse-ring"></div>
                </div>
            `,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
            popupAnchor: [0, -18]
        });

        const popupContent = driver === bookedDriver ? 
            `<strong>🛺 ${driver.name} (BOOKED)</strong><br>वाहन: ${driver.autoNumber}<br><span style="color:#10b981; font-weight:bold;">🚀 आपकी ओर आ रहा है...</span>` :
            `<strong>🛺 ${driver.name}</strong><br>वाहन: ${driver.autoNumber}<br>रूट: <strong>${ROUTES[driver.routeId]?.name}</strong><br>स्थिति: <span class="info-val ${driver.status}">${driver.status.toUpperCase()}</span>`;

        if (mapMarkers[driver.id]) {
            mapMarkers[driver.id].setLatLng([lat, lng]);
            mapMarkers[driver.id].setIcon(autoIcon);
            mapMarkers[driver.id].setPopupContent(popupContent);
            mapMarkers[driver.id].setOpacity(driver.status === 'offline' ? 0.4 : 1.0);
        } else {
            const marker = L.marker([lat, lng], { icon: autoIcon })
                .addTo(map)
                .bindPopup(popupContent);

            if (driver.status === 'offline') marker.setOpacity(0.4);
            mapMarkers[driver.id] = marker;
        }
    });
}

// 12. Simulate Live GPS Movement
function simulateDriverMovement() {
    drivers.forEach(driver => {
        if (driver.status === 'offline') {
            driver.progress = 0.0;
            return;
        }

        if (driver === bookedDriver) {
            // Booked driver moving to pickup location
            if (driver.progress < 1.0) {
                driver.progress += 0.04; // Moves to pickup
                if (driver.progress >= 1.0) {
                    driver.progress = 1.0;
                    arrivalETAText.innerText = '✨ आपका ऑटो पिकअप पॉइंट पर पहुँच गया है! (Arrived)';
                    if (mapMarkers[driver.id]) {
                        mapMarkers[driver.id].setPopupContent(`<strong>🛺 ${driver.name} ARRIVED</strong><br>आपके पिकअप स्थान पर पहुँच चुके हैं!`);
                        mapMarkers[driver.id].openPopup();
                    }
                }
            }
            return;
        }

        // Standard movement
        const speed = driver.status === 'busy' ? 0.005 : 0.01;
        driver.progress += driver.direction * speed;

        if (driver.progress >= 1.0) {
            driver.progress = 1.0;
            driver.direction = -1;
        } else if (driver.progress <= 0.0) {
            driver.progress = 0.0;
            driver.direction = 1;
        }
    });

    updateMapMarkers();
}

// 13. Render Drivers Directory List
function renderDrivers() {
    driversGrid.innerHTML = '';
    
    const filteredDrivers = drivers.filter(driver => {
        const route = ROUTES[driver.routeId];
        if (!route) return false;

        const matchesSearch = 
            driver.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            driver.autoNumber.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            route.name.toLowerCase().includes(searchKeyword.toLowerCase());

        let matchesRoute = false;
        if (activeRouteFilter === 'all') {
            matchesRoute = true;
        } else {
            matchesRoute = route.start === activeRouteFilter || route.end === activeRouteFilter;
        }

        return matchesSearch && matchesRoute;
    });

    resultsCount.innerText = `कुल ${filteredDrivers.length} ऑटो चालक मिले`;

    if (filteredDrivers.length === 0) {
        emptyState.classList.remove('hidden');
        driversGrid.classList.add('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    driversGrid.classList.remove('hidden');

    filteredDrivers.forEach(driver => {
        const route = ROUTES[driver.routeId];
        const startHubName = LOCATIONS[route.start].name.split(' (')[0];
        const endHubName = LOCATIONS[route.end].name.split(' (')[0];
        
        const card = document.createElement('div');
        card.className = `driver-card ${driver.status === 'offline' ? 'card-offline' : ''}`;
        card.setAttribute('data-id', driver.id);

        card.innerHTML = `
            <div class="card-header-main">
                <div class="driver-avatar-wrapper">
                    <div class="driver-avatar">${driver.avatar || '🛺'}</div>
                    <span class="status-indicator ${driver.status}"></span>
                </div>
                <div class="driver-identity">
                    <h3>${driver.name}</h3>
                    <span class="auto-plate">${driver.autoNumber}</span>
                </div>
            </div>
            
            <div class="card-details">
                <div class="detail-item">
                    <span class="detail-icon">🛣️</span>
                    <span>रूट: <strong>${startHubName} ⇆ ${endHubName}</strong></span>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">📍</span>
                    <span>लोकेशन: <strong class="loc-text">${LOCATIONS[driver.currentHub]?.name.split(' (')[0] || 'मार्ग पर'}</strong></span>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">📞</span>
                    <span>फोन: <strong>${driver.contact}</strong></span>
                </div>
            </div>

            <div class="card-pricing">
                <div class="price-box">
                    <span class="price-title">शेयर किराया</span>
                    <span class="price-value share">₹${driver.seatFare}</span>
                </div>
                <div class="price-box">
                    <span class="price-title">रिजर्व बुकिंग</span>
                    <span class="price-value reserve">₹${driver.reserveRate}/km</span>
                </div>
            </div>

            <div class="card-actions">
                <a href="tel:${driver.contact}" class="btn btn-primary action-btn">
                    📞 कॉल करें
                </a>
                <button class="btn btn-detail action-btn btn-view-details">
                    ℹ️ जानकारी
                </button>
            </div>
        `;

        card.querySelector('.btn-view-details').addEventListener('click', () => {
            showDriverDetails(driver);
        });

        card.addEventListener('mouseenter', () => {
            if (map && mapMarkers[driver.id]) {
                mapMarkers[driver.id].openPopup();
                map.panTo(mapMarkers[driver.id].getLatLng());
            }
        });

        driversGrid.appendChild(card);
    });
}

// 14. Driver details popup handler
function showDriverDetails(driver) {
    const route = ROUTES[driver.routeId];
    const statusLabels = {
        'active': 'Active (सवारी के लिए उपलब्ध 🟢)',
        'busy': 'Busy (ऑटो भरा हुआ है / बुक है 🟡)',
        'offline': 'Offline (ड्यूटी बंद है 🔴)'
    };

    detailsModalBody.innerHTML = `
        <div class="detail-header">
            <div class="detail-avatar-large">${driver.avatar || '🛺'}</div>
            <h2>${driver.name}</h2>
            <div class="detail-badge-row">
                <span class="auto-plate">${driver.autoNumber}</span>
            </div>
        </div>

        <div class="detail-info-list">
            <div class="info-row">
                <span class="info-label">ऑटो नंबर:</span>
                <span class="info-val">${driver.autoNumber}</span>
            </div>
            <div class="info-row">
                <span class="info-label">वर्तमान स्थिति:</span>
                <span class="info-val ${driver.status}">${statusLabels[driver.status]}</span>
            </div>
            <div class="info-row">
                <span class="info-label">मुख्य मार्ग (Route):</span>
                <span class="info-val">${LOCATIONS[route.start].name} ⇆ ${LOCATIONS[route.end].name}</span>
            </div>
            <div class="info-row">
                <span class="info-label">शेयर किराया (Per Seat):</span>
                <span class="info-val share" style="color: var(--color-primary); font-weight:700;">₹ ${driver.seatFare}</span>
            </div>
            <div class="info-row">
                <span class="info-label">रिजर्व किराया (Per km):</span>
                <span class="info-val reserve" style="color: var(--color-accent); font-weight:700;">₹ ${driver.reserveRate}/km</span>
            </div>
            <div class="info-row" style="flex-direction: column; gap: 6px;">
                <span class="info-label">चालक का विवरण / संदेश:</span>
                <span class="info-val" style="font-weight: 400; font-size: 0.9rem; font-style: italic;">
                    "${driver.desc || 'सुरक्षित एवं सुखद सफर का भरोसा।'}"
                </span>
            </div>
        </div>

        <div class="detail-actions">
            <a href="tel:${driver.contact}" class="action-btn-large call">
                📞 डायरेक्ट कॉल करें
            </a>
            <a href="https://wa.me/91${driver.contact}?text=नमस्ते%20${encodeURIComponent(driver.name)},%20मैने%20CHALOGE%20Gadarwara%20पर%20आपका%20नंबर%20देखा%20है।%20क्या%20आप%20सवारी%20के%20लिए%20उपलब्ध%20हैं?" target="_blank" class="action-btn-large whatsapp">
                💬 व्हाट्सएप संदेश
            </a>
        </div>
        <button id="focusOnMapBtn" class="btn btn-secondary btn-glow btn-full" style="margin-top: 15px;">
            📍 नक्शे पर देखें (Find on Map)
        </button>
    `;

    detailsModalOverlay.classList.remove('hidden');

    document.getElementById('focusOnMapBtn').addEventListener('click', () => {
        detailsModalOverlay.classList.add('hidden');
        if (map && mapMarkers[driver.id]) {
            map.setView(mapMarkers[driver.id].getLatLng(), 15);
            mapMarkers[driver.id].openPopup();
        }
    });
}

// 15. Load Data & Dropdowns on startup
// 15. Backend API Integration & Load Data
const API_BASE_URL = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
    ? window.location.origin 
    : '';

async function fetchDriversFromAPI() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/drivers`);
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                drivers = data;
                localStorage.setItem('gadarwara_autosathi_drivers', JSON.stringify(drivers));
                renderDrivers();
                updateMapMarkers();
                return;
            }
        }
    } catch (err) {
        console.warn('Backend API connection offline or unavailable, using local storage cache.');
    }

    // Fallback to local storage or defaults
    const DB_VERSION = 'v3_colonies';
    const savedVersion = localStorage.getItem('gadarwara_autosathi_version');
    const savedDrivers = localStorage.getItem('gadarwara_autosathi_drivers');
    
    if (savedDrivers && savedVersion === DB_VERSION) {
        drivers = JSON.parse(savedDrivers);
    } else {
        drivers = DEFAULT_DRIVERS;
        localStorage.setItem('gadarwara_autosathi_drivers', JSON.stringify(drivers));
        localStorage.setItem('gadarwara_autosathi_version', DB_VERSION);
    }
    renderDrivers();
    updateMapMarkers();
}

function initApp() {
    // Populate Start & End Locations for Booking Widget
    Object.keys(LOCATIONS).forEach(key => {
        const option1 = document.createElement('option');
        option1.value = key;
        option1.innerText = LOCATIONS[key].name;
        startLocationSelect.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = key;
        option2.innerText = LOCATIONS[key].name;
        endLocationSelect.appendChild(option2);
    });

    // Populate route selection in Registration Form
    const routeSelect = document.getElementById('driverRoute');
    Object.keys(ROUTES).forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.innerText = ROUTES[key].name;
        routeSelect.appendChild(option);
    });

    const hubSelect = document.getElementById('currentHub');
    Object.keys(LOCATIONS).forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.innerText = LOCATIONS[key].name;
        hubSelect.appendChild(option);
    });

    // Populate Route Filters Bar
    const routeFiltersContainer = document.getElementById('routeFilters');
    Object.keys(LOCATIONS).forEach(key => {
        const btn = document.createElement('button');
        btn.className = 'category-tag';
        btn.setAttribute('data-route', key);
        btn.innerHTML = `<span class="tag-icon">📍</span> ${LOCATIONS[key].name.split(' (')[0]}`;
        routeFiltersContainer.appendChild(btn);

        btn.addEventListener('click', () => {
            document.querySelectorAll('.category-tag').forEach(tag => tag.classList.remove('active'));
            btn.classList.add('active');
            activeRouteFilter = key;
            renderDrivers();
        });
    });

    // Default 'All' filter click
    document.querySelector('.category-tag[data-route="all"]').addEventListener('click', (e) => {
        document.querySelectorAll('.category-tag').forEach(tag => tag.classList.remove('active'));
        e.currentTarget.classList.add('active');
        activeRouteFilter = 'all';
        renderDrivers();
    });

    // Init map and marker loop
    initMap();

    // Start movement simulation loop
    setInterval(simulateDriverMovement, 1500);

    // Initial fetch from backend
    fetchDriversFromAPI();
}

// 16. Event Listeners
// Search inputs
searchInput.addEventListener('input', (e) => {
    searchKeyword = e.target.value;
    renderDrivers();
});

// Reset Search
resetSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchKeyword = '';
    activeRouteFilter = 'all';
    document.querySelectorAll('.category-tag').forEach(tag => tag.classList.remove('active'));
    document.querySelector('.category-tag[data-route="all"]').classList.add('active');
    renderDrivers();
});

// Location Dropdown selection change
startLocationSelect.addEventListener('change', updateFares);
endLocationSelect.addEventListener('change', updateFares);

// Registration Form triggers
addDriverBtn.addEventListener('click', () => {
    registerModalOverlay.classList.remove('hidden');
});

const closeRegisterModal = () => {
    registerModalOverlay.classList.add('hidden');
    registerDriverForm.reset();
};
closeRegisterBtn.addEventListener('click', closeRegisterModal);
cancelRegisterBtn.addEventListener('click', closeRegisterModal);

closeDetailsBtn.addEventListener('click', () => {
    detailsModalOverlay.classList.add('hidden');
});

// About Us Modal triggers
const aboutUsLink = document.getElementById('aboutUsLink');
const aboutModalOverlay = document.getElementById('aboutModalOverlay');
const closeAboutBtn = document.getElementById('closeAboutBtn');

if (aboutUsLink && aboutModalOverlay) {
    aboutUsLink.addEventListener('click', (e) => {
        e.preventDefault();
        aboutModalOverlay.classList.remove('hidden');
    });
}
if (closeAboutBtn && aboutModalOverlay) {
    closeAboutBtn.addEventListener('click', () => {
        aboutModalOverlay.classList.add('hidden');
    });
}

// Safety Modal triggers
const safetyLink = document.getElementById('safetyLink');
const safetyModalOverlay = document.getElementById('safetyModalOverlay');
const closeSafetyBtn = document.getElementById('closeSafetyBtn');

if (safetyLink && safetyModalOverlay) {
    safetyLink.addEventListener('click', (e) => {
        e.preventDefault();
        safetyModalOverlay.classList.remove('hidden');
    });
}
if (closeSafetyBtn && safetyModalOverlay) {
    closeSafetyBtn.addEventListener('click', () => {
        safetyModalOverlay.classList.add('hidden');
    });
}

registerDriverForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('driverName').value;
    const contact = document.getElementById('driverContact').value;
    const autoNumber = document.getElementById('autoNumber').value;
    const status = document.getElementById('driverStatus').value;
    const routeId = document.getElementById('driverRoute').value;
    const currentHub = document.getElementById('currentHub').value;
    const seatFare = parseInt(document.getElementById('seatFare').value);
    const reserveRate = parseInt(document.getElementById('reserveRate').value);
    const desc = document.getElementById('driverDesc').value;
    const markerColor = document.getElementById('markerColor').value;

    const avatars = ['👨🏽', '👨🏻', '🧑🏽', '👨🏼', '🧑🏼', '🛺'];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    const newDriverData = {
        name: `${name}`,
        contact,
        autoNumber,
        routeId,
        currentHub,
        seatFare,
        reserveRate,
        desc: desc || 'सुरक्षित एवं सुखद सफर का भरोसा।',
        status,
        markerColor,
        avatar: randomAvatar
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/drivers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newDriverData)
        });

        if (response.ok) {
            await fetchDriversFromAPI();
            closeRegisterModal();
            alert('पंजीकरण सफल! backend database में डेटा सेव हो गया है।');
            return;
        }
    } catch (err) {
        console.warn('Backend offline, saving driver locally.');
    }

    // Fallback to local storage save if backend unavailable
    const newDriver = {
        ...newDriverData,
        id: `driver-${Date.now()}`,
        progress: 0.0,
        direction: 1
    };
    drivers.push(newDriver);
    localStorage.setItem('gadarwara_autosathi_drivers', JSON.stringify(drivers));

    renderDrivers();
    updateMapMarkers();
    closeRegisterModal();

    alert('पंजीकरण सफल! CHALOGE गडरवारा में आपका स्वागत है।');
});

window.addEventListener('DOMContentLoaded', initApp);


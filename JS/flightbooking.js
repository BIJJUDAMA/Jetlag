document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("bookingForm");
    const fromInput = document.getElementById("from");
    const toInput = document.getElementById("to");
    
    // Initialize the map
    let map = null;
    let routeLayer = null;
    const airportCoordinates = {
        // Major international airports with their coordinates
        "New York": [40.6413, -73.7781],
        "London": [51.4700, -0.4543],
        "Paris": [49.0097, 2.5479],
        "Tokyo": [35.7720, 140.3929],
        "Sydney": [-33.9399, 151.1753],
        "Dubai": [25.2532, 55.3657],
        "Singapore": [1.3644, 103.9915],
        "Los Angeles": [33.9416, -118.4085],
        "Beijing": [40.0799, 116.6031],
        "Delhi": [28.5562, 77.1000],
        "Mumbai": [19.0896, 72.8656],
        "Frankfurt": [50.0379, 8.5622],
        "Hong Kong": [22.3080, 113.9185],
        "Bangkok": [13.6900, 100.7501],
        "Toronto": [43.6777, -79.6248],
        "San Francisco": [37.6213, -122.3790],
        "Amsterdam": [52.3105, 4.7683],
        "Madrid": [40.4983, -3.5676],
        "Rome": [41.8003, 12.2389],
        "Istanbul": [41.2608, 28.7424]
    };

    // Initialize the map when the page loads
    initMap();

    // Function to initialize the map
    function initMap() {
        // Check if the map container exists
        const mapContainer = document.getElementById("flightMap");
        if (!mapContainer) return;

        // Create the map if it doesn't exist yet
        if (!map) {
            // Load Leaflet CSS dynamically
            if (!document.getElementById('leaflet-css')) {
                const leafletCSS = document.createElement('link');
                leafletCSS.id = 'leaflet-css';
                leafletCSS.rel = 'stylesheet';
                leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                leafletCSS.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
                leafletCSS.crossOrigin = '';
                document.head.appendChild(leafletCSS);
            }

            // Load Leaflet JS dynamically
            if (!window.L) {
                const leafletScript = document.createElement('script');
                leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                leafletScript.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
                leafletScript.crossOrigin = '';
                document.head.appendChild(leafletScript);
                
                leafletScript.onload = () => {
                    createMap();
                };
            } else {
                createMap();
            }
        }
    }

    // Function to create the map with Leaflet
    function createMap() {
        const mapContainer = document.getElementById("flightMap");
        
        // Create the map centered on the world
        map = L.map('flightMap', {
            center: [20, 0],
            zoom: 2,
            minZoom: 2,
            maxZoom: 10
        });

        // Add the tile layer (map background)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Add a welcome message to the map
        const mapInfo = document.querySelector('.map-info');
        if (mapInfo) {
            mapInfo.textContent = 'Select origin and destination to see your flight route.';
        }
    }

    // Function to update the flight route on the map
    function updateFlightRoute() {
        if (!map || !window.L) return;
        
        const from = fromInput.value.trim();
        const to = toInput.value.trim();
        
        // Clear previous route if it exists
        if (routeLayer) {
            map.removeLayer(routeLayer);
            routeLayer = null;
        }
        
        // Check if both from and to values are in our coordinates list
        if (airportCoordinates[from] && airportCoordinates[to]) {
            const fromCoords = airportCoordinates[from];
            const toCoords = airportCoordinates[to];
            
            // Create a curved line between the two points
            const latlngs = [
                fromCoords,
                [fromCoords[0] + (toCoords[0] - fromCoords[0])/2, 
                 fromCoords[1] + (toCoords[1] - fromCoords[1])/2 + 
                 20 * Math.sin(Math.PI * (toCoords[1] - fromCoords[1]) / 180)],
                toCoords
            ];
            
            // Create the route line
            routeLayer = L.polyline(latlngs, {
                color: '#1a73e8',
                weight: 3,
                opacity: 0.8,
                dashArray: '5, 10'
            }).addTo(map);
            
            // Add markers for departure and arrival
            L.marker(fromCoords, {
                icon: L.divIcon({
                    html: '<i class="fas fa-plane-departure" style="color:#1a73e8;font-size:24px;"></i>',
                    className: 'map-icon',
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                })
            }).addTo(map).bindPopup(`<b>From:</b> ${from}`);
            
            L.marker(toCoords, {
                icon: L.divIcon({
                    html: '<i class="fas fa-plane-arrival" style="color:#ff6d00;font-size:24px;"></i>',
                    className: 'map-icon',
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                })
            }).addTo(map).bindPopup(`<b>To:</b> ${to}`);
            
            // Fit the map to show the entire route
            map.fitBounds(L.latLngBounds([fromCoords, toCoords]).pad(0.3));
            
            // Update the map info text
            const mapInfo = document.querySelector('.map-info');
            if (mapInfo) {
                const distance = calculateDistance(fromCoords[0], fromCoords[1], toCoords[0], toCoords[1]);
                mapInfo.innerHTML = `<strong>Flight route:</strong> ${from} to ${to}<br><strong>Distance:</strong> ~${distance.toFixed(0)} km`;
            }
        } else {
            // If coordinates aren't found, show a message
            const mapInfo = document.querySelector('.map-info');
            if (mapInfo) {
                if (from && to) {
                    mapInfo.textContent = 'Sorry, we don\'t have map data for one or both of these locations.';
                } else {
                    mapInfo.textContent = 'Select origin and destination to see your flight route.';
                }
            }
        }
    }
    
    // Function to calculate distance between two points using the Haversine formula
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the Earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c; // Distance in km
    }

    // Add autocomplete functionality to the from and to inputs
    function setupAutocomplete(input) {
        const datalist = document.createElement('datalist');
        datalist.id = input.id + 'List';
        
        // Add options from our airport coordinates
        Object.keys(airportCoordinates).forEach(airport => {
            const option = document.createElement('option');
            option.value = airport;
            datalist.appendChild(option);
        });
        
        // Add the datalist to the document
        document.body.appendChild(datalist);
        
        // Connect the input to the datalist
        input.setAttribute('list', datalist.id);
    }

    // Setup autocomplete for both inputs
    setupAutocomplete(fromInput);
    setupAutocomplete(toInput);

    // Add event listeners for input changes to update the map
    fromInput.addEventListener('change', updateFlightRoute);
    toInput.addEventListener('change', updateFlightRoute);

    // Form submission handler
    form.addEventListener("submit", (event) => {
        // Validate the form first
        const from = fromInput.value;
        const to = toInput.value;
        const date = document.getElementById("date").value;
        const classType = document.getElementById("class").value;
        const passengers = document.getElementById("passengers").value;
        
        if (!from || !to || !date || !classType || !passengers) {
            event.preventDefault();
            alert("Please fill in all fields");
            return false;
        }
        
        // Form is valid, will submit naturally to searchresult.html via the action attribute
        console.log("Form submitted successfully");
    });
    
    // Set minimum date to today
    const dateInput = document.getElementById("date");
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute("min", today);
});
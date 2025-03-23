document.addEventListener("DOMContentLoaded", getQueryParams);

function getQueryParams() {
    const params = new URLSearchParams(window.location.search);

    const searchDetails = {
        from: params.get('from'),
        to: params.get('to'),
        date: params.get('date'),
        classType: params.get('class'),
        passengers: params.get('passengers')
    };

    // ✅ Save search details to localStorage
    localStorage.setItem("searchDetails", JSON.stringify(searchDetails));

    document.getElementById('from').textContent = searchDetails.from;
    document.getElementById('to').textContent = searchDetails.to;
    document.getElementById('date').textContent = searchDetails.date;
    document.getElementById('class').textContent = searchDetails.classType;
    document.getElementById('passengers').textContent = searchDetails.passengers;

    generateRandomFlights();
}

function generateRandomFlights() {
    const flightContainer = document.getElementById('flight-options');
    flightContainer.innerHTML = ""; 

    const airlines = ["AeroVista", "Nimbus Jet", "Skyborne Airlines", "SwiftSky Jet", "AeroGlide", "SkyJet", "AirWing", "CloudWing", "SkyVoyage", "AeroCloud"];
    const amenities = ["🥤", "🍽️", "💺", "📶"];
    const numFlights = 6; 

    let flights = [];

    for (let i = 0; i < numFlights; i++) {
        const airline = airlines[Math.floor(Math.random() * airlines.length)];
        const departureTime = generateRandomTime();
        const arrivalTime = generateRandomTime();
        const price = (Math.floor(Math.random() * 500) + 100).toFixed(2);
        const duration = generateRandomDuration();
        const stopover = Math.random() > 0.7 ? "1 Stop" : "Non-stop";
        const selectedAmenities = amenities.sort(() => 0.5 - Math.random()).slice(0, 3).join(" ");

        const flightData = {
            airline,
            departureTime,
            arrivalTime,
            price,
            duration,
            stopover,
            amenities: selectedAmenities
        };

        flights.push(flightData); // ✅ Store the flight in the array

        const flightCard = document.createElement("div");
        flightCard.classList.add("flight-card");
        flightCard.innerHTML = `
            <div class="flight-summary">
                <p><strong>Airline:</strong> ${airline}</p>
                <p><strong>Departure:</strong> <span class="departure">${departureTime}</span></p>
                <p><strong>Arrival:</strong> <span class="arrival">${arrivalTime}</span></p>
                <p><strong>Price:</strong> $<span class="price">${price}</span></p>
                <button class="details-btn" onclick="toggleDetails(this)">View Details</button>
            </div>
            <div class="flight-details">
                <p><strong>Duration:</strong> <span class="duration">${duration}</span></p>
                <p><strong>Stops:</strong> ${stopover}</p>
                <p><strong>Amenities:</strong> ${selectedAmenities}</p>
                <button class="book-btn" onclick="bookFlight('${airline}', '${departureTime}', '${arrivalTime}', '${price}')">Book Now</button>
            </div>
        `;
        flightContainer.appendChild(flightCard);
    }

    // ✅ Save flights array to localStorage
    localStorage.setItem("availableFlights", JSON.stringify(flights));
}

function bookFlight(airline, departure, arrival, price) {
    const flightDetails = JSON.parse(localStorage.getItem("searchDetails"));

    const selectedFlight = {
        airline,
        departure,
        arrival,
        price,
        from: flightDetails.from,
        to: flightDetails.to,
        date: flightDetails.date,
        classType: flightDetails.classType,
        passengers: flightDetails.passengers
    };
    
    // ✅ Save all details to localStorage
    localStorage.setItem("selectedFlight", JSON.stringify(selectedFlight));

    const url = `payment.html?airline=${encodeURIComponent(airline)}&departure=${encodeURIComponent(departure)}&arrival=${encodeURIComponent(arrival)}&price=${encodeURIComponent(price)}`;
    window.location.href = url;
}

function generateRandomTime() {
    let hour = Math.floor(Math.random() * 12) + 1;
    let minutes = Math.floor(Math.random() * 60).toString().padStart(2, "0");
    let period = Math.random() > 0.5 ? "AM" : "PM";
    return `${hour}:${minutes} ${period}`;
}

function generateRandomDuration() {
    let hours = Math.floor(Math.random() * 10) + 1;
    let minutes = Math.floor(Math.random() * 60);
    return `${hours}h ${minutes}m`;
}

function parseTime(timeStr) {
    let [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return new Date(2000, 0, 1, hours, minutes);
}

function toggleDetails(button) {
    const flightCard = button.parentElement.parentElement;
    flightCard.classList.toggle("active");
}

function sortFlights(criteria) {
    const flightContainer = document.getElementById('flight-options');
    let flightCards = Array.from(flightContainer.getElementsByClassName('flight-card'));

    flightCards.sort((a, b) => {
        const getText = (card, selector) => card.querySelector(selector).textContent;

        if (criteria === "price") {
            return parseFloat(getText(a, ".price")) - parseFloat(getText(b, ".price"));
        } else if (criteria === "time") {
            return parseTime(getText(a, ".departure")) - parseTime(getText(b, ".departure"));
        } else if (criteria === "duration") {
            let [hoursA, minutesA] = getText(a, ".duration").split(" ").map(num => parseInt(num));
            let [hoursB, minutesB] = getText(b, ".duration").split(" ").map(num => parseInt(num));
            return (hoursA * 60 + minutesA) - (hoursB * 60 + minutesB);
        } else if (criteria === "airline") {
            return getText(a, ".flight-summary p:nth-child(1)").localeCompare(getText(b, ".flight-summary p:nth-child(1)"));
        }
    });

    flightContainer.innerHTML = "";
    flightCards.forEach(card => flightContainer.appendChild(card));
}

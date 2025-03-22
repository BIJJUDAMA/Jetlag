function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    document.getElementById('from').textContent = params.get('from');
    document.getElementById('to').textContent = params.get('to');
    document.getElementById('date').textContent = params.get('date');
    document.getElementById('class').textContent = params.get('class');
    document.getElementById('passengers').textContent = params.get('passengers');

    generateRandomFlights();
}

function generateRandomFlights() {
    const flightContainer = document.getElementById('flight-options');
    flightContainer.innerHTML = ""; // Clear previous data

    const airlines = ["Air India", "IndiGo", "Emirates", "Qatar Airways", "Lufthansa"];
    const amenities = ["🥤", "🍽️", "🎧", "💺", "📶"];
    const numFlights = 5; // Generate 5 random flights

    for (let i = 0; i < numFlights; i++) {
        const airline = airlines[Math.floor(Math.random() * airlines.length)];
        const departureTime = `${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, "0")} ${Math.random() > 0.5 ? "AM" : "PM"}`;
        const arrivalTime = `${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, "0")} ${Math.random() > 0.5 ? "AM" : "PM"}`;
        const price = (Math.floor(Math.random() * 500) + 100).toFixed(2);
        const duration = `${Math.floor(Math.random() * 10) + 1}h ${Math.floor(Math.random() * 59)}m`;
        const stopover = Math.random() > 0.7 ? "1 Stop" : "Non-stop";
        const selectedAmenities = amenities.sort(() => 0.5 - Math.random()).slice(0, 3).join(" ");

        const flightCard = document.createElement("div");
        flightCard.classList.add("flight-card");
        flightCard.innerHTML = `
            <div class="flight-summary">
                <p><strong>Airline:</strong> ${airline}</p>
                <p><strong>Departure:</strong> ${departureTime}</p>
                <p><strong>Arrival:</strong> ${arrivalTime}</p>
                <p><strong>Price:</strong> $<span class="price">${price}</span></p>
                <button class="details-btn" onclick="toggleDetails(this)">View Details</button>
            </div>
            <div class="flight-details">
                <p><strong>Duration:</strong> ${duration}</p>
                <p><strong>Stops:</strong> ${stopover}</p>
                <p><strong>Amenities:</strong> ${selectedAmenities}</p>
            </div>
        `;
        flightContainer.appendChild(flightCard);
    }
}

// Toggle flight details visibility
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
            let priceA = parseFloat(getText(a, ".price"));
            let priceB = parseFloat(getText(b, ".price"));
            return priceA - priceB;
        } else if (criteria === "time") {
            let timeA = new Date("01/01/2000 " + getText(a, ".flight-summary p:nth-child(2)").split(": ")[1]);
            let timeB = new Date("01/01/2000 " + getText(b, ".flight-summary p:nth-child(2)").split(": ")[1]);
            return timeA - timeB;
        } else if (criteria === "duration") {
            let durationA = parseInt(getText(a, ".flight-details p:nth-child(1)").split(" ")[1]);
            let durationB = parseInt(getText(b, ".flight-details p:nth-child(1)").split(" ")[1]);
            return durationA - durationB;
        } else if (criteria === "airline") {
            return getText(a, ".flight-summary p:nth-child(1)").localeCompare(getText(b, ".flight-summary p:nth-child(1)"));
        }
    });

    // Reorder sorted flights in the DOM
    flightContainer.innerHTML = "";
    flightCards.forEach(card => flightContainer.appendChild(card));
}

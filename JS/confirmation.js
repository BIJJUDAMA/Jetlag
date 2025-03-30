document.addEventListener("DOMContentLoaded", function () {
    retrieveConfirmationDetails();
});

function retrieveConfirmationDetails() {
    const flightDetails = JSON.parse(localStorage.getItem("selectedFlight"));
    const searchDetails = JSON.parse(localStorage.getItem("searchDetails"));
    const paymentDetails = JSON.parse(localStorage.getItem("paymentDetails"));

    if (flightDetails) {
        document.getElementById("airline").textContent = flightDetails.airline;
        document.getElementById("departure").textContent = flightDetails.departure;
        document.getElementById("arrival").textContent = flightDetails.arrival;
        document.getElementById("price").textContent = `$${flightDetails.price}`;
    } else {
        document.querySelector(".flight-details").innerHTML = "<p>No flight details found.</p>";
    }

    if (searchDetails) {
        document.getElementById("from").textContent = searchDetails.from;
        document.getElementById("to").textContent = searchDetails.to;
        document.getElementById("date").textContent = searchDetails.date;
        document.getElementById("class").textContent = searchDetails.classType;
        document.getElementById("passengers").textContent = searchDetails.passengers;
    } else {
        document.querySelector(".search-details").innerHTML = "<p>No search details found.</p>";
    }

    // Generate and display a random 8-digit confirmation number
    let confirmationNumber = localStorage.getItem("confirmationNumber");

    if (!confirmationNumber) {
        confirmationNumber = Math.floor(10000000 + Math.random() * 90000000);
        localStorage.setItem("confirmationNumber", confirmationNumber);
    }

    document.getElementById("confirmation-number").textContent = confirmationNumber;
}

function goHome() {
    localStorage.clear();
    window.location.href = "../index.html";
}

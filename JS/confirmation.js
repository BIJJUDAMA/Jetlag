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
}


function goHome() {
    localStorage.clear();
    window.location.href = "../index.html";
}

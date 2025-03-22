document.addEventListener("DOMContentLoaded", function() {
    const flightDetails = JSON.parse(localStorage.getItem("selectedFlight"));

    if (flightDetails) {
        document.getElementById("airline").textContent = flightDetails.airline;
        document.getElementById("departure").textContent = flightDetails.departure;
        document.getElementById("arrival").textContent = flightDetails.arrival;
        document.getElementById("price").textContent = `$${flightDetails.price}`;
    } else {
        document.getElementById("flight-summary").innerHTML = "<p>No flight selected.</p>";
    }

    document.getElementById("payButton").addEventListener("click", function(event) {
        event.preventDefault();

        const cardName = document.getElementById("card-name").value.trim();
        const cardNumber = document.getElementById("card-number").value.trim();
        const expiryDate = document.getElementById("expiry-date").value.trim();
        const cvv = document.getElementById("cvv").value.trim();

        if (cardName === "" || cardNumber.length !== 16 || expiryDate === "" || cvv.length !== 3) {
            document.getElementById("payment-status").textContent = "Invalid payment details!";
            document.getElementById("payment-status").style.color = "red";
            return;
        }

        alert("Payment Successful! Your flight has been booked.");
        localStorage.removeItem("selectedFlight"); // Clear data after payment
        window.location.href = "confirmation.html"; // Redirect to confirmation page
    });

    // Live update of card details
    document.getElementById("card-number").addEventListener("input", function() {
        document.querySelector(".cardNumber").textContent = this.value || "**** **** **** ****";
    });

    document.getElementById("card-name").addEventListener("input", function() {
        document.querySelector(".cardName").textContent = this.value || "Your Name";
    });

    document.getElementById("expiry-date").addEventListener("input", function() {
        let value = this.value.split("/");
        document.querySelector(".month").textContent = value[0] || "MM";
        document.querySelector(".year").textContent = value[1] || "YY";
    });
});

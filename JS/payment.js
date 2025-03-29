document.addEventListener("DOMContentLoaded", function () {

    function getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            airline: params.get("airline"),
            departure: decodeURIComponent(params.get("departure")),
            arrival: decodeURIComponent(params.get("arrival")),
            price: params.get("price")
        };
    }

    const flightDetails = getQueryParams();

    if (flightDetails.airline) {
        document.getElementById("airline").textContent = flightDetails.airline;
        document.getElementById("departure").textContent = flightDetails.departure;
        document.getElementById("arrival").textContent = flightDetails.arrival;
        document.getElementById("price").textContent = `$${flightDetails.price}`;

       
        localStorage.setItem("flightDetails", JSON.stringify(flightDetails));
    } else {
        document.getElementById("flight-summary").innerHTML = "<p>No flight selected.</p>";
    }

    document.getElementById("payButton").addEventListener("click", function (event) {
        event.preventDefault();

        const cardName = document.getElementById("card-name").value.trim();
        const cardNumber = document.getElementById("card-number").value.trim().replace(/\s+/g, "");
        const expiryDate = document.getElementById("expiry-date").value.trim();
        const cvv = document.getElementById("cvv").value.trim();

        if (cardName === "" || cardNumber.length !== 16 || expiryDate === "" || cvv.length !== 3) {
            document.getElementById("payment-status").textContent = "Invalid payment details!";
            document.getElementById("payment-status").style.color = "red";
            return;
        }

        window.location.href = "confirmation.html"; 
    });

    // Live update of card details
    document.getElementById("card-number").addEventListener("input", function () {
        let inputValue = this.value.replace(/\D/g, ""); 
        let formattedValue = inputValue.replace(/(\d{4})/g, "$1 ").trim(); 
        this.value = formattedValue;

        document.querySelector(".cardNumber").textContent = formattedValue || "**** **** **** ****";
    });

    document.getElementById("card-name").addEventListener("input", function () {
        document.querySelector(".cardName").textContent = this.value || "Your Name";
    });

    document.getElementById("expiry-date").addEventListener("input", function () {
        let value = this.value.replace(/\D/g, "");
        if (value.length > 2) {
            value = value.slice(0, 2) + "/" + value.slice(2, 4); // Format MM/YY
        }
        this.value = value;

        let splitValue = value.split("/");
        document.querySelector(".month").textContent = splitValue[0] || "MM";
        document.querySelector(".year").textContent = splitValue[1] || "YY";
    });
});

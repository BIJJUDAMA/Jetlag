document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("bookingForm");

    form.addEventListener("submit", (event) => {
        event.preventDefault(); 

        const flightData = {
            from: document.getElementById("from").value,
            to: document.getElementById("to").value,
            date: document.getElementById("date").value,
            class: document.getElementById("class").value,
            passengers: document.getElementById("passengers").value,
        };

       
        window.electronAPI.saveFlightDetails(flightData);
        alert("Flight details saved!");
    });
});
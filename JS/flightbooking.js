document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("bookingForm");

    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent page refresh

        const flightData = {
            from: document.getElementById("from").value,
            to: document.getElementById("to").value,
            date: document.getElementById("date").value,
            class: document.getElementById("class").value,
            passengers: document.getElementById("passengers").value,
        };

        // Send data to Electron's main process
        window.electronAPI.saveFlightDetails(flightData);
        alert("Flight details saved!");
    });
});
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    document.getElementById('from').textContent = params.get('from');
    document.getElementById('to').textContent = params.get('to');
    document.getElementById('date').textContent = params.get('date');
    document.getElementById('class').textContent = params.get('class');
    document.getElementById('passengers').textContent = params.get('passengers');
}
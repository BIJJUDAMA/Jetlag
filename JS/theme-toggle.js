const themeSwitch = document.getElementById('theme-switch');
const themeLabel = document.getElementById('theme-label');

// Load stored theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeSwitch.checked = true;
    themeLabel.textContent = "Light Mode";
}

themeSwitch.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeLabel.textContent = "Light Mode";
    } else {
        localStorage.setItem('theme', 'light');
        themeLabel.textContent = "Dark Mode";
    }
});

/**
 * Jetlag - Common JavaScript Utilities
 * This file contains shared functionality for the Jetlag website
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all common components
    initNavigation();
    initFooter();
    initAnimations();
    setupThemeToggle();
    setupNotifications();
    
    // Check if user is logged in
    checkAuthStatus();
});

/**
 * Initialize responsive navigation
 */
function initNavigation() {
    // Get current page URL to highlight active nav item
    const currentPage = window.location.pathname.split('/').pop();
    
    // Convert existing navigation to enhanced version
    const navElement = document.querySelector('nav');
    if (navElement) {
        // Add classes for styling
        navElement.classList.add('main-nav');
        
        // Find all navigation links
        const navLinks = navElement.querySelectorAll('a');
        navLinks.forEach(link => {
            // Highlight active link
            const linkPage = link.getAttribute('href').split('/').pop();
            if (linkPage === currentPage) {
                link.classList.add('active');
            }
            
            // Add transition effects
            link.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s ease';
            });
        });
        
        // Create mobile menu toggle for responsive design
        const navUl = navElement.querySelector('ul');
        if (navUl) {
            const menuToggle = document.createElement('button');
            menuToggle.classList.add('menu-toggle');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
            
            menuToggle.addEventListener('click', function() {
                navUl.classList.toggle('show');
                this.setAttribute('aria-expanded', navUl.classList.contains('show'));
            });
            
            // Add toggle button before the navigation list
            navElement.insertBefore(menuToggle, navUl);
        }
    }
}

/**
 * Create or enhance footer across all pages
 */
function initFooter() {
    // Check if footer exists, if not create one
    let footer = document.querySelector('footer');
    
    if (!footer) {
        footer = document.createElement('footer');
        footer.classList.add('site-footer');
        document.body.appendChild(footer);
    } else {
        footer.classList.add('site-footer');
    }
    
    // Only populate footer if it's empty
    if (footer.children.length === 0) {
        footer.innerHTML = `
            <div class="footer-content">
                <div class="footer-section">
                    <h3>About Jetlag</h3>
                    <p>Jetlag is a modern flight booking platform designed to make your travel planning seamless and enjoyable.</p>
                    <div class="social-icons">
                        <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                        <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                        <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                    </div>
                </div>
                <div class="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="HTML/flightbooking.html">Book a Flight</a></li>
                        <li><a href="HTML/flightstatus.html">Flight Status</a></li>
                        <li><a href="HTML/managebookings.html">Manage Booking</a></li>
                        <li><a href="HTML/aboutus.html">About Us</a></li>
                        <li><a href="HTML/contactus.html">Contact Us</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>Contact Us</h3>
                    <p><i class="fas fa-map-marker-alt"></i> 123 Airport Road, Skyville</p>
                    <p><i class="fas fa-phone"></i> +1 (555) 123-4567</p>
                    <p><i class="fas fa-envelope"></i> info@jetlag.com</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; ${new Date().getFullYear()} Jetlag. All rights reserved.</p>
            </div>
        `;
    }
}

/**
 * Initialize animations for page elements
 */
function initAnimations() {
    // Add fade-in animations to key elements
    const animateElements = document.querySelectorAll('.card, .form-group, .btn');
    
    if (animateElements.length > 0) {
        animateElements.forEach((element, index) => {
            element.classList.add('animate-fadeIn');
            element.style.animationDelay = `${index * 0.1}s`;
        });
    }
    
    // Add scroll animations
    window.addEventListener('scroll', function() {
        const scrollElements = document.querySelectorAll('.scroll-animate');
        
        scrollElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    });
}

/**
 * Setup theme toggle (light/dark mode)
 */
function setupThemeToggle() {
    // Create theme toggle button if it doesn't exist
    if (!document.querySelector('.theme-toggle')) {
        const themeToggle = document.createElement('button');
        themeToggle.classList.add('theme-toggle');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.setAttribute('aria-label', 'Toggle dark mode');
        themeToggle.setAttribute('title', 'Toggle dark mode');
        
        // Check for saved theme preference or respect OS preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.body.classList.add('dark-theme');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
        
        // Toggle theme on click
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            
            if (document.body.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark');
                this.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                localStorage.setItem('theme', 'light');
                this.innerHTML = '<i class="fas fa-moon"></i>';
            }
        });
        
        // Add to the page - typically in header or nav
        const header = document.querySelector('header') || document.querySelector('nav');
        if (header) {
            header.appendChild(themeToggle);
        }
    }
}

/**
 * Setup notification system
 */
function setupNotifications() {
    // Create notification container if it doesn't exist
    if (!document.querySelector('.notification-container')) {
        const notificationContainer = document.createElement('div');
        notificationContainer.classList.add('notification-container');
        document.body.appendChild(notificationContainer);
    }
}

/**
 * Show a notification message
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, warning, info)
 * @param {number} duration - How long to show the notification in ms
 */
function showNotification(message, type = 'info', duration = 3000) {
    const container = document.querySelector('.notification-container');
    
    if (container) {
        const notification = document.createElement('div');
        notification.classList.add('notification', `notification-${type}`);
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${getIconForType(type)}"></i>
            </div>
            <div class="notification-content">
                <p>${message}</p>
            </div>
            <button class="notification-close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to container
        container.appendChild(notification);
        
        // Show with animation
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Setup close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto remove after duration
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
    }
}

/**
 * Get appropriate icon for notification type
 * @param {string} type - Notification type
 * @returns {string} - Font Awesome icon class
 */
function getIconForType(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        case 'info':
        default: return 'fa-info-circle';
    }
}

/**
 * Check user authentication status
 */
function checkAuthStatus() {
    // Check if user is logged in (using localStorage in this example)
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    
    // Update UI based on auth status
    updateAuthUI(isLoggedIn, userInfo);
}

/**
 * Update UI elements based on authentication status
 * @param {boolean} isLoggedIn - Whether user is logged in
 * @param {object} userInfo - User information
 */
function updateAuthUI(isLoggedIn, userInfo) {
    // Find auth-related elements
    const authLinks = document.querySelectorAll('[data-auth-link]');
    
    if (authLinks.length > 0) {
        authLinks.forEach(link => {
            const linkType = link.getAttribute('data-auth-link');
            
            // Show/hide based on auth status
            if ((linkType === 'logged-in' && isLoggedIn) || 
                (linkType === 'logged-out' && !isLoggedIn)) {
                link.style.display = '';
            } else {
                link.style.display = 'none';
            }
        });
    }
    
    // Update user profile elements if they exist
    const userNameElements = document.querySelectorAll('[data-user-name]');
    if (userNameElements.length > 0 && isLoggedIn && userInfo.name) {
        userNameElements.forEach(element => {
            element.textContent = userInfo.name;
        });
    }
}

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - Resolves with user info or rejects with error
 */
function loginUser(email, password) {
    return new Promise((resolve, reject) => {
        // This is a mock implementation - in a real app, this would call an API
        setTimeout(() => {
            // Simple validation
            if (!email || !password) {
                reject('Email and password are required');
                return;
            }
            
            // Mock authentication - in a real app, this would verify credentials with a server
            if (email === 'demo@jetlag.com' && password === 'password') {
                const userInfo = {
                    id: '123456',
                    name: 'Demo User',
                    email: 'demo@jetlag.com'
                };
                
                // Store auth state
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                
                // Update UI
                updateAuthUI(true, userInfo);
                
                resolve(userInfo);
            } else {
                reject('Invalid email or password');
            }
        }, 1000); // Simulate network delay
    });
}

/**
 * Logout user
 */
function logoutUser() {
    // Clear auth state
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userInfo');
    
    // Update UI
    updateAuthUI(false, {});
    
    // Redirect to home page if needed
    // window.location.href = '/';
}

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} - Formatted currency string
 */
function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

/**
 * Format date in user-friendly format
 * @param {string|Date} date - Date to format
 * @param {string} format - Format style ('short', 'medium', 'long')
 * @returns {string} - Formatted date string
 */
function formatDate(date, format = 'medium') {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    const options = {
        short: { month: 'numeric', day: 'numeric', year: '2-digit' },
        medium: { month: 'short', day: 'numeric', year: 'numeric' },
        long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
    };
    
    return new Intl.DateTimeFormat('en-US', options[format]).format(dateObj);
}

/**
 * Validate form inputs
 * @param {HTMLFormElement} form - Form element to validate
 * @returns {boolean} - Whether form is valid
 */
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Reset previous validation state
        input.classList.remove('is-invalid');
        const errorElement = input.parentElement.querySelector('.error-message');
        if (errorElement) errorElement.remove();
        
        // Check required fields
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            markInvalid(input, 'This field is required');
        }
        
        // Check email format
        if (input.type === 'email' && input.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value.trim())) {
                isValid = false;
                markInvalid(input, 'Please enter a valid email address');
            }
        }
        
        // Check password length
        if (input.type === 'password' && input.value.trim() && 
            input.hasAttribute('minlength')) {
            const minLength = parseInt(input.getAttribute('minlength'));
            if (input.value.length < minLength) {
                isValid = false;
                markInvalid(input, `Password must be at least ${minLength} characters`);
            }
        }
    });
    
    return isValid;
}

/**
 * Mark form input as invalid with error message
 * @param {HTMLElement} input - Input element
 * @param {string} message - Error message
 */
function markInvalid(input, message) {
    input.classList.add('is-invalid');
    
    const errorElement = document.createElement('div');
    errorElement.classList.add('error-message');
    errorElement.textContent = message;
    
    input.parentElement.appendChild(errorElement);
}

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait = 300) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Add a flight map to the specified container
 * @param {string} containerId - ID of container element
 * @param {object} flightData - Flight data with origin and destination coordinates
 */
function initFlightMap(containerId, flightData) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Check if Leaflet is available
    if (typeof L === 'undefined') {
        // Load Leaflet CSS and JS if not already loaded
        if (!document.getElementById('leaflet-css')) {
            const leafletCSS = document.createElement('link');
            leafletCSS.id = 'leaflet-css';
            leafletCSS.rel = 'stylesheet';
            leafletCSS.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
            document.head.appendChild(leafletCSS);
        }
        
        const leafletScript = document.createElement('script');
        leafletScript.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
        leafletScript.onload = () => initMap();
        document.head.appendChild(leafletScript);
    } else {
        initMap();
    }
    
    function initMap() {
        // Default coordinates if not provided
        const defaultData = {
            origin: { lat: 40.7128, lng: -74.0060, name: 'New York' },
            destination: { lat: 34.0522, lng: -118.2437, name: 'Los Angeles' }
        };
        
        const mapData = flightData || defaultData;
        
        // Create map
        const map = L.map(containerId).setView([
            (mapData.origin.lat + mapData.destination.lat) / 2,
            (mapData.origin.lng + mapData.destination.lng) / 2
        ], 4);
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Add markers for origin and destination
        L.marker([mapData.origin.lat, mapData.origin.lng])
            .addTo(map)
            .bindPopup(`<b>Origin:</b> ${mapData.origin.name}`);
            
        L.marker([mapData.destination.lat, mapData.destination.lng])
            .addTo(map)
            .bindPopup(`<b>Destination:</b> ${mapData.destination.name}`);
        
        // Draw flight path
        const flightPath = L.polyline([
            [mapData.origin.lat, mapData.origin.lng],
            [mapData.destination.lat, mapData.destination.lng]
        ], {
            color: 'blue',
            weight: 3,
            opacity: 0.7,
            dashArray: '5, 10'
        }).addTo(map);
        
        // Fit map to show both points
        map.fitBounds(flightPath.getBounds(), { padding: [50, 50] });
    }
}

// Export functions for use in other scripts
window.JetlagUtils = {
    showNotification,
    loginUser,
    logoutUser,
    formatCurrency,
    formatDate,
    validateForm,
    initFlightMap
};
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the booking management system
    initBookingSystem();
    
    // Add event listeners to all action buttons
    setupActionButtons();
    
    // Setup search functionality
    setupSearch();
    
    // Setup filter functionality
    setupFilter();
    
    // Setup sidebar navigation
    setupSidebarNavigation();
});

function initBookingSystem() {
    // Simulate loading animation for stats cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Initialize the booking data
    loadBookingData();
}

function setupActionButtons() {
    // View buttons already have onclick handlers in HTML
    
    // Setup cancel buttons
    const cancelButtons = document.querySelectorAll('.action-btn[title="Cancel"]');
    cancelButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const bookingId = row.querySelector('.booking-id').textContent;
            cancelBooking(bookingId, row);
        });
    });
    
    // Setup confirm buttons
    const confirmButtons = document.querySelectorAll('.action-btn[title="Confirm"]');
    confirmButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const bookingId = row.querySelector('.booking-id').textContent;
            confirmBooking(bookingId, row);
        });
    });
    
    // Setup restore buttons
    const restoreButtons = document.querySelectorAll('.action-btn[title="Restore"]');
    restoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const bookingId = row.querySelector('.booking-id').textContent;
            restoreBooking(bookingId, row);
        });
    });
    
    // Setup save changes button in edit modal
    const saveChangesBtn = document.querySelector('#editModal .btn-primary');
    if (saveChangesBtn) {
        saveChangesBtn.addEventListener('click', function() {
            saveBookingChanges();
        });
    }
}

function setupSearch() {
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const tableRows = document.querySelectorAll('.bookings-table tbody tr');
            
            tableRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
}

function setupFilter() {
    const filterBtn = document.querySelector('.filter-btn');
    if (filterBtn) {
        filterBtn.addEventListener('click', function() {
            // Create and show filter modal
            showFilterModal();
        });
    }
}

function setupSidebarNavigation() {
    // Get all navigation items in the sidebar
    const navItems = document.querySelectorAll('.nav-item');
    
    // Add click event listeners to each navigation item
    navItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(navItem => navItem.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Handle different navigation items
            const itemText = this.querySelector('span').textContent;
            
            switch(itemText) {
                case 'Dashboard':
                    filterBookingsBySection('dashboard');
                    break;
                case 'Bookings':
                    filterBookingsBySection('all');
                    break;
                case 'Flights':
                    filterBookingsBySection('flights');
                    break;
                case 'Customers':
                    filterBookingsBySection('customers');
                    break;
                case 'Reports':
                    filterBookingsBySection('reports');
                    break;
                case 'Settings':
                    filterBookingsBySection('settings');
                    break;
                default:
                    filterBookingsBySection('all');
            }
        });
    });
}

function filterBookingsBySection(section) {
    // Get the main content area
    const mainContent = document.querySelector('.main-content');
    const bookingsSection = document.querySelector('.bookings-section');
    const statsGrid = document.querySelector('.stats-grid');
    const header = document.querySelector('.header h1');
    
    // Show/hide elements based on selected section
    switch(section) {
        case 'dashboard':
            header.textContent = 'Dashboard';
            statsGrid.style.display = 'grid';
            bookingsSection.style.display = 'block';
            showNotification('Dashboard view activated', 'success');
            break;
        case 'all':
            header.textContent = 'Manage Bookings';
            statsGrid.style.display = 'grid';
            bookingsSection.style.display = 'block';
            // Show all bookings
            const allRows = document.querySelectorAll('.bookings-table tbody tr');
            allRows.forEach(row => row.style.display = '');
            showNotification('Showing all bookings', 'success');
            break;
        case 'flights':
            header.textContent = 'Flight Management';
            statsGrid.style.display = 'none';
            bookingsSection.style.display = 'block';
            // Filter to show only flight-related information
            filterTableByFlightInfo();
            showNotification('Showing flight information', 'success');
            break;
        case 'customers':
            header.textContent = 'Customer Management';
            statsGrid.style.display = 'none';
            bookingsSection.style.display = 'block';
            // Filter to show customer-focused view
            filterTableByCustomerInfo();
            showNotification('Showing customer information', 'success');
            break;
        case 'reports':
            header.textContent = 'Booking Reports';
            statsGrid.style.display = 'grid';
            bookingsSection.style.display = 'block';
            // Show a reports view
            showReportsView();
            showNotification('Reports view activated', 'success');
            break;
        case 'settings':
            header.textContent = 'Settings';
            statsGrid.style.display = 'none';
            bookingsSection.style.display = 'none';
            // Show settings view
            showSettingsView();
            break;
        default:
            header.textContent = 'Manage Bookings';
            statsGrid.style.display = 'grid';
            bookingsSection.style.display = 'block';
    }
}

function showFilterModal() {
    // Create filter modal if it doesn't exist
    let filterModal = document.getElementById('filterModal');
    
    if (!filterModal) {
        filterModal = document.createElement('div');
        filterModal.id = 'filterModal';
        filterModal.className = 'modal';
        filterModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Filter Bookings</h3>
                    <button class="close-modal" onclick="closeModal('filter')">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Status</label>
                        <select id="statusFilter">
                            <option value="">All Statuses</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="pending">Pending</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Date Range</label>
                        <div style="display: flex; gap: 10px;">
                            <input type="date" id="startDate" placeholder="Start Date">
                            <input type="date" id="endDate" placeholder="End Date">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Destination</label>
                        <select id="destinationFilter">
                            <option value="">All Destinations</option>
                            <option value="LAX">LAX</option>
                            <option value="MIA">MIA</option>
                            <option value="SFO">SFO</option>
                            <option value="SEA">SEA</option>
                            <option value="DEN">DEN</option>
                        </select>
                    </div>
                </div>
                <div class="form-actions">
                    <button class="btn btn-outline" onclick="resetFilters()">Reset</button>
                    <button class="btn btn-primary" onclick="applyFilters()">Apply Filters</button>
                </div>
            </div>
        `;
        document.body.appendChild(filterModal);
    }
    
    // Show the modal
    filterModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function cancelBooking(bookingId, row) {
    if (confirm(`Are you sure you want to cancel booking ${bookingId}?`)) {
        // Update the status badge
        const statusBadge = row.querySelector('.status-badge');
        statusBadge.className = 'status-badge status-cancelled';
        statusBadge.textContent = 'Cancelled';
        
        // Update the actions column
        const actionsCell = row.querySelector('td:last-child');
        actionsCell.innerHTML = `
            <a href="bookingdetails.html?id=${bookingId}" class="action-btn" title="View">
                <i class="fas fa-eye"></i>
            </a>
            <button class="action-btn" title="Restore">
                <i class="fas fa-undo"></i>
            </button>
        `;
        
        // Add event listener to the new restore button
        const restoreButton = actionsCell.querySelector('.action-btn[title="Restore"]');
        restoreButton.addEventListener('click', function() {
            restoreBooking(bookingId, row);
        });
        
        // Show success message
        showNotification('Booking cancelled successfully', 'success');
    }
}

function confirmBooking(bookingId, row) {
    if (confirm(`Are you sure you want to confirm booking ${bookingId}?`)) {
        // Update the status badge
        const statusBadge = row.querySelector('.status-badge');
        statusBadge.className = 'status-badge status-confirmed';
        statusBadge.textContent = 'Confirmed';
        
        // Update the actions column
        const actionsCell = row.querySelector('td:last-child');
        actionsCell.innerHTML = `
            <a href="bookingdetails.html?id=${bookingId}" class="action-btn" title="View">
                <i class="fas fa-eye"></i>
            </a>
            <button class="action-btn" title="Edit" onclick="openModal('edit')">
                <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn" title="Cancel">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add event listener to the new cancel button
        const cancelButton = actionsCell.querySelector('.action-btn[title="Cancel"]');
        cancelButton.addEventListener('click', function() {
            cancelBooking(bookingId, row);
        });
        
        // Show success message
        showNotification('Booking confirmed successfully', 'success');
    }
}

function restoreBooking(bookingId, row) {
    if (confirm(`Are you sure you want to restore booking ${bookingId}?`)) {
        // Update the status badge
        const statusBadge = row.querySelector('.status-badge');
        statusBadge.className = 'status-badge status-confirmed';
        statusBadge.textContent = 'Confirmed';
        
        // Update the actions column
        const actionsCell = row.querySelector('td:last-child');
        actionsCell.innerHTML = `
            <a href="bookingdetails.html?id=${bookingId}" class="action-btn" title="View">
                <i class="fas fa-eye"></i>
            </a>
            <button class="action-btn" title="Edit" onclick="openModal('edit')">
                <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn" title="Cancel">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add event listener to the new cancel button
        const cancelButton = actionsCell.querySelector('.action-btn[title="Cancel"]');
        cancelButton.addEventListener('click', function() {
            cancelBooking(bookingId, row);
        });
        
        // Show success message
        showNotification('Booking restored successfully', 'success');
    }
}

function saveBookingChanges() {
    // Get the booking ID from the edit modal
    const bookingId = document.querySelector('#editModal input[readonly]').value;
    
    // Get the updated values
    const passengerName = document.querySelector('#editModal input[value="Michael Brown"]').value;
    const cabinClass = document.querySelector('#editModal select:nth-of-type(3)').value;
    const status = document.querySelector('#editModal select:nth-of-type(4)').value;
    
    // Update the table row with the new values
    const tableRows = document.querySelectorAll('.bookings-table tbody tr');
    tableRows.forEach(row => {
        const rowBookingId = row.querySelector('.booking-id').textContent;
        if (rowBookingId === bookingId) {
            // Update passenger name
            row.querySelector('td:nth-child(2)').textContent = passengerName;
            
            // Update status badge
            const statusBadge = row.querySelector('.status-badge');
            statusBadge.className = `status-badge status-${status.toLowerCase()}`;
            statusBadge.textContent = status;
            
            // If status changed to cancelled, update action buttons
            if (status.toLowerCase() === 'cancelled') {
                const actionsCell = row.querySelector('td:last-child');
                actionsCell.innerHTML = `
                    <a href="bookingdetails.html?id=${bookingId}" class="action-btn" title="View">
                        <i class="fas fa-eye"></i>
                    </a>
                    <button class="action-btn" title="Restore">
                        <i class="fas fa-undo"></i>
                    </button>
                `;
                
                // Add event listener to the new restore button
                const restoreButton = actionsCell.querySelector('.action-btn[title="Restore"]');
                restoreButton.addEventListener('click', function() {
                    restoreBooking(bookingId, row);
                });
            }
        }
    });
    
    // Close the modal
    closeModal('edit');
    
    // Show success message
    showNotification('Booking updated successfully', 'success');
}

function applyFilters() {
    const statusFilter = document.getElementById('statusFilter').value.toLowerCase();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const destinationFilter = document.getElementById('destinationFilter').value;
    
    const tableRows = document.querySelectorAll('.bookings-table tbody tr');
    
    tableRows.forEach(row => {
        let showRow = true;
        
        // Filter by status
        if (statusFilter) {
            const statusBadge = row.querySelector('.status-badge');
            const rowStatus = statusBadge.textContent.toLowerCase();
            if (rowStatus !== statusFilter) {
                showRow = false;
            }
        }
        
        // Filter by destination
        if (destinationFilter && showRow) {
            const destination = row.querySelector('.flight-route span:last-child').textContent;
            if (destination !== destinationFilter) {
                showRow = false;
            }
        }
        
        // Filter by date range (simplified for demo)
        if ((startDate || endDate) && showRow) {
            const dateText = row.querySelector('td:nth-child(4)').textContent;
            const rowDate = new Date(dateText);
            
            if (startDate && new Date(startDate) > rowDate) {
                showRow = false;
            }
            
            if (endDate && new Date(endDate) < rowDate) {
                showRow = false;
            }
        }
        
        row.style.display = showRow ? '' : 'none';
    });
    
    // Close the filter modal
    closeModal('filter');
}

function resetFilters() {
    // Reset filter form
    document.getElementById('statusFilter').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('destinationFilter').value = '';
    
    // Show all rows
    const tableRows = document.querySelectorAll('.bookings-table tbody tr');
    tableRows.forEach(row => {
        row.style.display = '';
    });
    
    // Close the filter modal
    closeModal('filter');
}

function loadBookingData() {
    // This function would normally fetch booking data from a server
    // For this demo, we're using the hardcoded data in the HTML
    console.log('Booking data loaded');
}

function showNotification(message, type) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '5px';
        notification.style.color = 'white';
        notification.style.fontWeight = '600';
        notification.style.zIndex = '1000';
        notification.style.boxShadow = '0 3px 10px rgba(0,0,0,0.2)';
        notification.style.transition = 'all 0.3s ease';
        document.body.appendChild(notification);
    }
    
    // Set notification style based on type
    if (type === 'success') {
        notification.style.backgroundColor = '#4caf50';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#f44336';
    } else if (type === 'warning') {
        notification.style.backgroundColor = '#ff9800';
    }
    
    // Set message and show notification
    notification.textContent = message;
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
    }, 3000);
}

// Make functions available globally
window.openModal = function(modalType) {
    const modal = document.getElementById(modalType + 'Modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

window.closeModal = function(modalType) {
    document.getElementById(modalType + 'Modal').classList.remove('active');
    document.body.style.overflow = 'auto';
};

window.applyFilters = applyFilters;
window.resetFilters = resetFilters;

// Additional functions for sidebar navigation functionality
function filterTableByFlightInfo() {
    // Get all table rows
    const tableRows = document.querySelectorAll('.bookings-table tbody tr');
    
    // Update table header to focus on flight information
    const tableHeader = document.querySelector('.bookings-table thead tr');
    tableHeader.innerHTML = `
        <th>Flight</th>
        <th>Origin</th>
        <th>Destination</th>
        <th>Date</th>
        <th>Status</th>
        <th>Actions</th>
    `;
    
    // Update table rows to focus on flight information
    tableRows.forEach(row => {
        // Extract flight route information
        const flightRoute = row.querySelector('.flight-route');
        const origin = flightRoute.querySelector('span:first-child').textContent;
        const destination = flightRoute.querySelector('span:last-child').textContent;
        
        // Get other necessary information
        const bookingId = row.querySelector('.booking-id').textContent;
        const date = row.querySelector('td:nth-child(4)').textContent;
        const status = row.querySelector('.status-badge').outerHTML;
        
        // Update row content
        row.innerHTML = `
            <td>${bookingId}</td>
            <td>${origin}</td>
            <td>${destination}</td>
            <td>${date}</td>
            <td>${status}</td>
            <td>
                <a href="bookingdetails.html?id=${bookingId}" class="action-btn" title="View">
                    <i class="fas fa-eye"></i>
                </a>
                <button class="action-btn" title="Track">
                    <i class="fas fa-map-marker-alt"></i>
                </button>
            </td>
        `;
    });
    
    // Add event listeners to the new track buttons
    const trackButtons = document.querySelectorAll('.action-btn[title="Track"]');
    trackButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const flightId = row.querySelector('td:first-child').textContent;
            showNotification(`Tracking flight ${flightId}`, 'success');
        });
    });
}

function filterTableByCustomerInfo() {
    // Get all table rows
    const tableRows = document.querySelectorAll('.bookings-table tbody tr');
    
    // Update table header to focus on customer information
    const tableHeader = document.querySelector('.bookings-table thead tr');
    tableHeader.innerHTML = `
        <th>Customer</th>
        <th>Booking ID</th>
        <th>Flight</th>
        <th>Date</th>
        <th>Status</th>
        <th>Actions</th>
    `;
    
    // Update table rows to focus on customer information
    tableRows.forEach(row => {
        // Extract necessary information
        const bookingId = row.querySelector('.booking-id').textContent;
        const passenger = row.querySelector('td:nth-child(2)').textContent;
        const flightRoute = row.querySelector('.flight-route').innerHTML;
        const date = row.querySelector('td:nth-child(4)').textContent;
        const status = row.querySelector('.status-badge').outerHTML;
        
        // Update row content
        row.innerHTML = `
            <td>${passenger}</td>
            <td>${bookingId}</td>
            <td>
                <div class="flight-route">${flightRoute}</div>
            </td>
            <td>${date}</td>
            <td>${status}</td>
            <td>
                <a href="bookingdetails.html?id=${bookingId}" class="action-btn" title="View">
                    <i class="fas fa-eye"></i>
                </a>
                <button class="action-btn" title="Contact">
                    <i class="fas fa-envelope"></i>
                </button>
                <button class="action-btn" title="History">
                    <i class="fas fa-history"></i>
                </button>
            </td>
        `;
    });
    
    // Add event listeners to the new buttons
    const contactButtons = document.querySelectorAll('.action-btn[title="Contact"]');
    contactButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const customer = row.querySelector('td:first-child').textContent;
            showNotification(`Contacting ${customer}`, 'success');
        });
    });
    
    const historyButtons = document.querySelectorAll('.action-btn[title="History"]');
    historyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const customer = row.querySelector('td:first-child').textContent;
            showNotification(`Viewing booking history for ${customer}`, 'success');
        });
    });
}

function showReportsView() {
    // Get all table rows
    const tableRows = document.querySelectorAll('.bookings-table tbody tr');
    
    // Update section header
    const sectionHeader = document.querySelector('.section-header h2');
    sectionHeader.textContent = 'Booking Reports';
    
    // Update table header for reports view
    const tableHeader = document.querySelector('.bookings-table thead tr');
    tableHeader.innerHTML = `
        <th>Report Type</th>
        <th>Period</th>
        <th>Status</th>
        <th>Date Generated</th>
        <th>Actions</th>
    `;
    
    // Clear existing table rows
    const tableBody = document.querySelector('.bookings-table tbody');
    tableBody.innerHTML = '';
    
    // Add report rows
    const reportTypes = [
        { type: 'Monthly Booking Summary', period: 'Nov 2023', status: 'Complete' },
        { type: 'Customer Activity Report', period: 'Q4 2023', status: 'Complete' },
        { type: 'Revenue Analysis', period: 'Dec 2023', status: 'Pending' },
        { type: 'Flight Occupancy Report', period: 'Dec 2023', status: 'Complete' }
    ];
    
    reportTypes.forEach((report, index) => {
        const row = document.createElement('tr');
        const statusClass = report.status === 'Complete' ? 'status-confirmed' : 'status-pending';
        
        row.innerHTML = `
            <td>${report.type}</td>
            <td>${report.period}</td>
            <td><span class="status-badge ${statusClass}">${report.status}</span></td>
            <td>Dec ${10 + index}, 2023</td>
            <td>
                <button class="action-btn" title="View Report">
                    <i class="fas fa-file-alt"></i>
                </button>
                <button class="action-btn" title="Download">
                    <i class="fas fa-download"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners to the report buttons
    const viewReportButtons = document.querySelectorAll('.action-btn[title="View Report"]');
    viewReportButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const reportType = row.querySelector('td:first-child').textContent;
            showNotification(`Viewing ${reportType}`, 'success');
        });
    });
    
    const downloadButtons = document.querySelectorAll('.action-btn[title="Download"]');
    downloadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const reportType = row.querySelector('td:first-child').textContent;
            showNotification(`Downloading ${reportType}`, 'success');
        });
    });
}

function showSettingsView() {
    // Get the main content area
    const mainContent = document.querySelector('.main-content');
    
    // Create settings content if it doesn't exist
    let settingsContent = document.getElementById('settings-content');
    
    if (!settingsContent) {
        settingsContent = document.createElement('div');
        settingsContent.id = 'settings-content';
        settingsContent.className = 'settings-content';
        settingsContent.style.background = 'white';
        settingsContent.style.borderRadius = '10px';
        settingsContent.style.padding = '1.5rem';
        settingsContent.style.boxShadow = '0 3px 10px rgba(0,0,0,0.05)';
        settingsContent.style.animation = 'fadeInUp 0.5s ease';
        
        settingsContent.innerHTML = `
            <div class="section-header">
                <h2>Account Settings</h2>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                <div class="setting-card" style="background: #f9f9f9; padding: 1.5rem; border-radius: 10px;">
                    <h3 style="margin-bottom: 1rem;">Profile Information</h3>
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" value="Sarah Johnson">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" value="sarah.johnson@example.com">
                    </div>
                    <div class="form-group">
                        <label>Phone</label>
                        <input type="tel" value="+1 (555) 123-4567">
                    </div>
                    <button class="btn btn-primary" style="margin-top: 1rem;" id="save-profile">Save Changes</button>
                </div>
                
                <div class="setting-card" style="background: #f9f9f9; padding: 1.5rem; border-radius: 10px;">
                    <h3 style="margin-bottom: 1rem;">Notification Settings</h3>
                    <div class="form-group" style="display: flex; align-items: center;">
                        <input type="checkbox" id="email-notif" checked style="width: auto; margin-right: 10px;">
                        <label for="email-notif">Email Notifications</label>
                    </div>
                    <div class="form-group" style="display: flex; align-items: center;">
                        <input type="checkbox" id="sms-notif" checked style="width: auto; margin-right: 10px;">
                        <label for="sms-notif">SMS Notifications</label>
                    </div>
                    <div class="form-group" style="display: flex; align-items: center;">
                        <input type="checkbox" id="booking-updates" checked style="width: auto; margin-right: 10px;">
                        <label for="booking-updates">Booking Updates</label>
                    </div>
                    <div class="form-group" style="display: flex; align-items: center;">
                        <input type="checkbox" id="promo-offers" style="width: auto; margin-right: 10px;">
                        <label for="promo-offers">Promotional Offers</label>
                    </div>
                    <button class="btn btn-primary" style="margin-top: 1rem;" id="save-notifications">Save Preferences</button>
                </div>
            </div>
        `;
        
        mainContent.appendChild(settingsContent);
        
        // Add event listeners to the settings buttons
        document.getElementById('save-profile').addEventListener('click', function() {
            showNotification('Profile information updated successfully', 'success');
        });
        
        document.getElementById('save-notifications').addEventListener('click', function() {
            showNotification('Notification preferences updated successfully', 'success');
        });
    } else {
        // If settings content exists, just show it
        settingsContent.style.display = 'block';
    }
    
    // Hide other sections that might be visible
    const bookingsSection = document.querySelector('.bookings-section');
    if (bookingsSection) {
        bookingsSection.style.display = 'none';
    }
}
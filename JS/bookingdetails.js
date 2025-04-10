document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters to load specific booking
    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get('id');
    
    if (bookingId) {
        document.getElementById('bookingIdDisplay').textContent = bookingId;
        // In a real app, you would fetch booking details from server here
        loadBookingDetails(bookingId);
    }
    
    // Setup modal buttons
    document.getElementById('changeSeatBtn').addEventListener('click', function() {
        openModal('changeSeat');
    });
    
    document.getElementById('changeDateBtn').addEventListener('click', function() {
        openModal('changeDate');
    });
    
    document.getElementById('printBtn').addEventListener('click', function() {
        window.print();
    });
    
    document.getElementById('cancelBtn').addEventListener('click', function() {
        openModal('cancelBooking');
    });
    
    // Setup confirmation buttons
    document.getElementById('confirmSeatChange').addEventListener('click', function() {
        const seatSelect = document.getElementById('seatSelect');
        const selectedSeat = seatSelect.value;
        
        if (selectedSeat) {
            // Update the seat in the UI
            const flightSelect = document.getElementById('flightSelect');
            const isOutbound = flightSelect.value === 'outbound';
            
            const seatDisplay = document.querySelector(`.passenger-details .detail-item:nth-child(${isOutbound ? 2 : 3}) .value`);
            seatDisplay.textContent = selectedSeat;
            
            // Show success message
            showNotification('Seat changed successfully!', 'success');
            closeModal('changeSeat');
        } else {
            showNotification('Please select a seat', 'error');
        }
    });
    
    document.getElementById('confirmDateChange').addEventListener('click', function() {
        const newDate = document.getElementById('newDate').value;
        const availableFlights = document.getElementById('availableFlights').value;
        
        if (newDate && availableFlights) {
            // Format the date for display
            const formattedDate = new Date(newDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            
            // Update the date in the UI
            const flightDateSelect = document.getElementById('flightDateSelect');
            const isOutbound = flightDateSelect.value === 'outbound';
            
            const dateDisplay = document.querySelector(`.flight-card:nth-child(${isOutbound ? 1 : 2}) .flight-details .detail-item:first-child .value`);
            dateDisplay.textContent = formattedDate;
            
            // Show success message
            showNotification('Flight date changed successfully!', 'success');
            closeModal('changeDate');
        } else {
            showNotification('Please select a date and flight', 'error');
        }
    });
    
    document.getElementById('confirmCancellation').addEventListener('click', function() {
        const reason = document.getElementById('cancellationReason').value;
        
        if (reason) {
            // Update the status badge
            const statusBadge = document.getElementById('statusBadge');
            statusBadge.className = 'status-badge status-cancelled';
            statusBadge.textContent = 'Cancelled';
            
            // Disable action buttons
            document.getElementById('changeSeatBtn').disabled = true;
            document.getElementById('changeDateBtn').disabled = true;
            document.getElementById('cancelBtn').disabled = true;
            
            // Add a restore button
            const actionButtons = document.querySelector('.action-buttons');
            const restoreBtn = document.createElement('button');
            restoreBtn.className = 'btn btn-outline';
            restoreBtn.innerHTML = '<i class="fas fa-undo"></i> Restore Booking';
            restoreBtn.addEventListener('click', function() {
                restoreBooking();
            });
            actionButtons.insertBefore(restoreBtn, document.getElementById('printBtn'));
            
            // Show success message
            showNotification('Booking cancelled successfully!', 'success');
            closeModal('cancelBooking');
        } else {
            showNotification('Please select a reason for cancellation', 'error');
        }
    });
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target.className === 'modal active') {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
            document.body.style.overflow = 'auto';
        }
    };
});

function loadBookingDetails(bookingId) {
    // In a real app, this would fetch data from a server
    // For demo purposes, we'll just simulate different bookings
    
    // Sample booking data
    const bookings = {
        'SKJ-789456': {
            status: 'Confirmed',
            passenger: 'Michael Brown',
            outbound: {
                from: 'JFK',
                to: 'LAX',
                date: 'Dec 15, 2023',
                flightNumber: 'SJ-1234',
                departure: '13:00',
                arrival: '16:30',
                duration: '6h 30m',
                cabinClass: 'Economy',
                seat: '24B'
            },
            return: {
                from: 'LAX',
                to: 'JFK',
                date: 'Dec 22, 2023',
                flightNumber: 'SJ-1235',
                departure: '14:15',
                arrival: '18:45',
                duration: '7h 30m',
                cabinClass: 'Economy',
                seat: '18A'
            },
            passengerDetails: {
                type: 'Adult',
                meal: 'Vegetarian',
                assistance: 'None'
            }
        },
        'SKJ-123789': {
            status: 'Pending',
            passenger: 'Emily Davis',
            outbound: {
                from: 'ORD',
                to: 'MIA',
                date: 'Dec 18, 2023',
                flightNumber: 'SJ-2345',
                departure: '10:30',
                arrival: '14:45',
                duration: '4h 15m',
                cabinClass: 'Business',
                seat: '5A'
            },
            return: {
                from: 'MIA',
                to: 'ORD',
                date: 'Dec 25, 2023',
                flightNumber: 'SJ-2346',
                departure: '12:00',
                arrival: '16:15',
                duration: '4h 15m',
                cabinClass: 'Business',
                seat: '6C'
            },
            passengerDetails: {
                type: 'Adult',
                meal: 'Regular',
                assistance: 'Wheelchair'
            }
        },
        'SKJ-456123': {
            status: 'Confirmed',
            passenger: 'Robert Wilson',
            outbound: {
                from: 'DFW',
                to: 'SFO',
                date: 'Dec 20, 2023',
                flightNumber: 'SJ-3456',
                departure: '08:45',
                arrival: '11:30',
                duration: '3h 45m',
                cabinClass: 'Premium Economy',
                seat: '12D'
            },
            return: {
                from: 'SFO',
                to: 'DFW',
                date: 'Dec 27, 2023',
                flightNumber: 'SJ-3457',
                departure: '13:20',
                arrival: '16:05',
                duration: '3h 45m',
                cabinClass: 'Premium Economy',
                seat: '14F'
            },
            passengerDetails: {
                type: 'Adult',
                meal: 'Diabetic',
                assistance: 'None'
            }
        }
    };
    
    // Get the booking data
    const booking = bookings[bookingId];
    
    if (booking) {
        // Update status badge
        const statusBadge = document.getElementById('statusBadge');
        statusBadge.className = `status-badge status-${booking.status.toLowerCase()}`;
        statusBadge.textContent = booking.status;
        
        // Update outbound flight details
        const outboundCard = document.querySelector('.flight-card:first-child');
        outboundCard.querySelector('h3').textContent = 'Outbound Flight';
        outboundCard.querySelector('.airport:first-child').textContent = booking.outbound.from;
        outboundCard.querySelector('.airport:last-child').textContent = booking.outbound.to;
        outboundCard.querySelectorAll('.detail-item')[0].querySelector('.value').textContent = booking.outbound.date;
        outboundCard.querySelectorAll('.detail-item')[1].querySelector('.value').textContent = booking.outbound.flightNumber;
        outboundCard.querySelectorAll('.detail-item')[2].querySelector('.value').textContent = booking.outbound.departure;
        outboundCard.querySelectorAll('.detail-item')[3].querySelector('.value').textContent = booking.outbound.arrival;
        outboundCard.querySelectorAll('.detail-item')[4].querySelector('.value').textContent = booking.outbound.duration;
        outboundCard.querySelectorAll('.detail-item')[5].querySelector('.value').textContent = booking.outbound.cabinClass;
        
        // Update return flight details
        const returnCard = document.querySelector('.flight-card:nth-child(2)');
        returnCard.querySelector('h3').textContent = 'Return Flight';
        returnCard.querySelector('.airport:first-child').textContent = booking.return.from;
        returnCard.querySelector('.airport:last-child').textContent = booking.return.to;
        returnCard.querySelectorAll('.detail-item')[0].querySelector('.value').textContent = booking.return.date;
        returnCard.querySelectorAll('.detail-item')[1].querySelector('.value').textContent = booking.return.flightNumber;
        returnCard.querySelectorAll('.detail-item')[2].querySelector('.value').textContent = booking.return.departure;
        returnCard.querySelectorAll('.detail-item')[3].querySelector('.value').textContent = booking.return.arrival;
        returnCard.querySelectorAll('.detail-item')[4].querySelector('.value').textContent = booking.return.duration;
        returnCard.querySelectorAll('.detail-item')[5].querySelector('.value').textContent = booking.return.cabinClass;
        
        // Update passenger details
        const passengerCard = document.querySelector('.passenger-card');
        passengerCard.querySelector('.name').textContent = booking.passenger;
        passengerCard.querySelectorAll('.detail-item')[0].querySelector('.value').textContent = booking.passengerDetails.type;
        passengerCard.querySelectorAll('.detail-item')[1].querySelector('.value').textContent = booking.outbound.seat;
        passengerCard.querySelectorAll('.detail-item')[2].querySelector('.value').textContent = booking.return.seat;
        passengerCard.querySelectorAll('.detail-item')[3].querySelector('.value').textContent = booking.passengerDetails.meal;
        passengerCard.querySelectorAll('.detail-item')[4].querySelector('.value').textContent = booking.passengerDetails.assistance;
        
        // Update modal values
        document.querySelector('#changeSeatModal input[readonly]').value = booking.outbound.seat;
        document.querySelector('#changeDateModal input[readonly]').value = booking.outbound.date;
        document.querySelector('#cancelBookingModal input[readonly]:first-of-type').value = bookingId;
        
        // Disable buttons if booking is cancelled
        if (booking.status.toLowerCase() === 'cancelled') {
            document.getElementById('changeSeatBtn').disabled = true;
            document.getElementById('changeDateBtn').disabled = true;
            document.getElementById('cancelBtn').disabled = true;
            
            // Add a restore button
            const actionButtons = document.querySelector('.action-buttons');
            const restoreBtn = document.createElement('button');
            restoreBtn.className = 'btn btn-outline';
            restoreBtn.innerHTML = '<i class="fas fa-undo"></i> Restore Booking';
            restoreBtn.addEventListener('click', function() {
                restoreBooking();
            });
            actionButtons.insertBefore(restoreBtn, document.getElementById('printBtn'));
        }
    }
}

function restoreBooking() {
    if (confirm('Are you sure you want to restore this booking?')) {
        // Update the status badge
        const statusBadge = document.getElementById('statusBadge');
        statusBadge.className = 'status-badge status-confirmed';
        statusBadge.textContent = 'Confirmed';
        
        // Enable action buttons
        document.getElementById('changeSeatBtn').disabled = false;
        document.getElementById('changeDateBtn').disabled = false;
        document.getElementById('cancelBtn').disabled = false;
        
        // Remove the restore button
        const restoreBtn = document.querySelector('.btn.btn-outline i.fa-undo').parentNode;
        restoreBtn.remove();
        
        // Show success message
        showNotification('Booking restored successfully!', 'success');
    }
}

function openModal(modalType) {
    document.getElementById(modalType + 'Modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalType) {
    document.getElementById(modalType + 'Modal').classList.remove('active');
    document.body.style.overflow = 'auto';
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
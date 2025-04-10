document.addEventListener("DOMContentLoaded", function () {
    // Get flight details from URL parameters
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

    // Populate flight summary
    if (flightDetails.airline) {
        document.getElementById("airline").textContent = flightDetails.airline;
        document.getElementById("departure").textContent = flightDetails.departure;
        document.getElementById("arrival").textContent = flightDetails.arrival;
        document.getElementById("price").textContent = `$${flightDetails.price}`;
        
        // Also populate mobile flight summary
        const mobileSummary = document.getElementById("flight-summary-mobile");
        if (mobileSummary) {
            mobileSummary.innerHTML = `
                <h4>Flight Summary</h4>
                <p><strong>${flightDetails.airline}</strong></p>
                <p>${flightDetails.departure} → ${flightDetails.arrival}</p>
                <p class="highlight-price">$${flightDetails.price}</p>
            `;
        }

        // Set price on buttons
        document.querySelectorAll(".button-price").forEach(el => {
            el.textContent = `$${flightDetails.price}`;
        });

        localStorage.setItem("flightDetails", JSON.stringify(flightDetails));
    } else {
        document.getElementById("flight-summary").innerHTML = "<p>No flight selected.</p>";
        if (document.getElementById("flight-summary-mobile")) {
            document.getElementById("flight-summary-mobile").innerHTML = "<p>No flight selected.</p>";
        }
    }

    // Payment method switching
    const paymentMethods = document.querySelectorAll(".payment-method");
    const paymentForms = document.querySelectorAll(".payment-method-form");
    const cardPreview = document.getElementById("card-preview");

    paymentMethods.forEach(method => {
        method.addEventListener("click", function() {
            // Remove active class from all methods
            paymentMethods.forEach(m => m.classList.remove("active"));
            // Add active class to clicked method
            this.classList.add("active");
            
            // Hide all forms
            paymentForms.forEach(form => form.classList.remove("active"));
            // Show the corresponding form
            const methodType = this.getAttribute("data-method");
            document.querySelector(`.payment-method-form[data-method="${methodType}"]`).classList.add("active");
            
            // Show/hide card preview based on payment method
            if (methodType === "credit-card") {
                cardPreview.style.display = "block";
            } else {
                cardPreview.style.display = "none";
            }
        });
    });

    // Credit card validation and formatting
    const cardNumberInput = document.getElementById("card-number");
    const cardNameInput = document.getElementById("card-name");
    const expiryDateInput = document.getElementById("expiry-date");
    const cvvInput = document.getElementById("cvv");
    
    // Card number formatting and validation
    cardNumberInput.addEventListener("input", function() {
        let inputValue = this.value.replace(/\D/g, ""); // Remove non-digits
        let formattedValue = inputValue.replace(/(\d{4})/g, "$1 ").trim(); // Add space after every 4 digits
        this.value = formattedValue;

        // Update card preview
        document.querySelector(".cardNumber").textContent = formattedValue || "**** **** **** ****";
        
        // Validate card number
        const numberValidation = document.getElementById("number-validation");
        const cardType = document.getElementById("card-type");
        const cardBrandLogo = document.getElementById("card-brand-logo");
        
        // Basic card type detection
        if (inputValue.length > 0) {
            let cardBrand = "";
            let iconClass = "";
            
            // Detect card type based on first digits
            if (inputValue.startsWith("4")) {
                cardBrand = "Visa";
                iconClass = "fab fa-cc-visa";
                cardBrandLogo.src = "../Images/visa.png";
            } else if (/^5[1-5]/.test(inputValue)) {
                cardBrand = "MasterCard";
                iconClass = "fab fa-cc-mastercard";
                cardBrandLogo.src = "../Images/mastercard.png";
            } else if (/^3[47]/.test(inputValue)) {
                cardBrand = "American Express";
                iconClass = "fab fa-cc-amex";
                cardBrandLogo.src = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg";
            } else if (/^6(?:011|5)/.test(inputValue)) {
                cardBrand = "Discover";
                iconClass = "fab fa-cc-discover";
                cardBrandLogo.src = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg";
            }
            
            if (cardBrand) {
                cardType.innerHTML = `<i class="${iconClass}"></i>`;
                cardType.setAttribute("title", cardBrand);
            } else {
                cardType.innerHTML = "";
            }
        } else {
            cardType.innerHTML = "";
            cardBrandLogo.src = "../Images/mastercard.png";
        }
        
        // Validate length
        if (inputValue.length > 0 && inputValue.length < 16) {
            numberValidation.textContent = "Card number must be at least 16 digits";
            numberValidation.className = "validation-message validation-error";
        } else if (inputValue.length >= 16) {
            // Simple Luhn algorithm check could be added here for production
            numberValidation.textContent = "✓ Valid card number";
            numberValidation.className = "validation-message validation-success";
        } else {
            numberValidation.textContent = "";
            numberValidation.className = "validation-message";
        }
    });

    // Cardholder name validation
    cardNameInput.addEventListener("input", function() {
        // Update card preview
        document.querySelector(".cardName").textContent = this.value || "Your Name";
        
        // Validate name
        const nameValidation = document.getElementById("name-validation");
        if (this.value.length > 0 && this.value.length < 3) {
            nameValidation.textContent = "Name is too short";
            nameValidation.className = "validation-message validation-error";
        } else if (this.value.length >= 3) {
            nameValidation.textContent = "✓ Valid name";
            nameValidation.className = "validation-message validation-success";
        } else {
            nameValidation.textContent = "";
            nameValidation.className = "validation-message";
        }
    });

    // Expiry date formatting and validation
    expiryDateInput.addEventListener("input", function() {
        let value = this.value.replace(/\D/g, "");
        
        if (value.length > 0) {
            // Auto-format MM/YY
            if (value.length > 2) {
                // Check if month is valid (01-12)
                const month = parseInt(value.substring(0, 2));
                if (month < 1 || month > 12) {
                    value = "0" + month.toString().charAt(0) + "/" + value.substring(2);
                } else {
                    value = value.substring(0, 2) + "/" + value.substring(2);
                }
            }
        }
        
        this.value = value;

        // Update card preview
        let splitValue = value.split("/");
        document.querySelector(".month").textContent = splitValue[0] || "MM";
        document.querySelector(".year").textContent = splitValue[1] || "YY";
        
        // Validate expiry date
        const expiryValidation = document.getElementById("expiry-validation");
        if (value.includes("/")) {
            const parts = value.split("/");
            const month = parseInt(parts[0]);
            const year = parseInt("20" + parts[1]); // Assuming 20xx
            
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
            
            if (year < currentYear || (year === currentYear && month < currentMonth)) {
                expiryValidation.textContent = "Card has expired";
                expiryValidation.className = "validation-message validation-error";
            } else {
                expiryValidation.textContent = "✓ Valid expiry date";
                expiryValidation.className = "validation-message validation-success";
            }
        } else if (value.length > 0) {
            expiryValidation.textContent = "Please enter a valid date (MM/YY)";
            expiryValidation.className = "validation-message validation-error";
        } else {
            expiryValidation.textContent = "";
            expiryValidation.className = "validation-message";
        }
    });

    // CVV validation
    cvvInput.addEventListener("input", function() {
        let value = this.value.replace(/\D/g, "");
        this.value = value;
        
        // Validate CVV
        const cvvValidation = document.getElementById("cvv-validation");
        if (value.length > 0 && value.length < 3) {
            cvvValidation.textContent = "CVV must be at least 3 digits";
            cvvValidation.className = "validation-message validation-error";
        } else if (value.length >= 3) {
            cvvValidation.textContent = "✓ Valid CVV";
            cvvValidation.className = "validation-message validation-success";
        } else {
            cvvValidation.textContent = "";
            cvvValidation.className = "validation-message";
        }
    });

    // CVV tooltip
    const cvvInfo = document.getElementById("cvv-info");
    if (cvvInfo) {
        cvvInfo.addEventListener("mouseover", function() {
            const tooltip = document.createElement("div");
            tooltip.className = "cvv-tooltip-content";
            tooltip.innerHTML = `
                <p>The CVV is the 3 or 4 digit security code on your card:</p>
                <img src="https://www.cvvnumber.com/img/cvv_cards.jpg" alt="CVV Location" style="width:200px;">
            `;
            this.appendChild(tooltip);
        });
        
        cvvInfo.addEventListener("mouseout", function() {
            const tooltip = this.querySelector(".cvv-tooltip-content");
            if (tooltip) {
                tooltip.remove();
            }
        });
    }

    // Payment button click handler
    document.getElementById("payButton").addEventListener("click", function(event) {
        event.preventDefault();
        
        // Validate all fields
        const cardName = document.getElementById("card-name").value.trim();
        const cardNumber = document.getElementById("card-number").value.trim().replace(/\s+/g, "");
        const expiryDate = document.getElementById("expiry-date").value.trim();
        const cvv = document.getElementById("cvv").value.trim();
        const termsChecked = document.getElementById("terms").checked;
        
        const paymentStatus = document.getElementById("payment-status");
        
        // Check if all fields are valid
        if (cardName === "" || cardNumber.length < 16 || expiryDate === "" || cvv.length < 3) {
            paymentStatus.textContent = "Please fill in all required fields correctly.";
            paymentStatus.className = "payment-status error";
            return;
        }
        
        if (!termsChecked) {
            paymentStatus.textContent = "Please agree to the Terms and Conditions.";
            paymentStatus.className = "payment-status error";
            return;
        }
        
        // Show 2FA verification modal
        const verificationModal = document.getElementById("verification-modal");
        verificationModal.classList.add("active");
        
        // Start countdown timer
        let timeLeft = 120; // 2 minutes
        const timerElement = document.getElementById("timer");
        const timerInterval = setInterval(function() {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerElement.textContent = "00:00";
                document.querySelector(".verification-timer").style.color = "#f44336";
            }
        }, 1000);
        
        // Focus on first verification input
        setTimeout(() => {
            document.querySelector('.verification-input[data-index="1"]').focus();
        }, 500);
    });

    // PayPal button handler
    const paypalButton = document.getElementById("paypalButton");
    if (paypalButton) {
        paypalButton.addEventListener("click", function() {
            const paymentStatus = document.getElementById("payment-status");
            paymentStatus.textContent = "Redirecting to PayPal...";
            paymentStatus.className = "payment-status warning";
            
            // Simulate redirect delay
            setTimeout(() => {
                window.location.href = "confirmation.html";
            }, 2000);
        });
    }

    // Digital wallet button handler
    const walletButton = document.getElementById("walletButton");
    if (walletButton) {
        walletButton.addEventListener("click", function() {
            const paymentStatus = document.getElementById("payment-status");
            paymentStatus.textContent = "Opening digital wallet...";
            paymentStatus.className = "payment-status warning";
            
            // Simulate processing delay
            setTimeout(() => {
                window.location.href = "confirmation.html";
            }, 2000);
        });
    }

    // Verification code input handling
    const verificationInputs = document.querySelectorAll(".verification-input");
    verificationInputs.forEach(input => {
        input.addEventListener("input", function() {
            if (this.value.length === this.maxLength) {
                const nextIndex = parseInt(this.getAttribute("data-index")) + 1;
                const nextInput = document.querySelector(`.verification-input[data-index="${nextIndex}"]`);
                if (nextInput) {
                    nextInput.focus();
                }
            }
        });
        
        input.addEventListener("keydown", function(e) {
            // Allow backspace to go to previous input
            if (e.key === "Backspace" && this.value.length === 0) {
                const prevIndex = parseInt(this.getAttribute("data-index")) - 1;
                const prevInput = document.querySelector(`.verification-input[data-index="${prevIndex}"]`);
                if (prevInput) {
                    prevInput.focus();
                }
            }
        });
    });

    // Verify code button handler
    document.getElementById("verify-code-btn").addEventListener("click", function() {
        let code = "";
        verificationInputs.forEach(input => {
            code += input.value;
        });
        
        // Check if code is complete
        if (code.length === 6) {
            // For demo purposes, any 6-digit code is accepted
            document.getElementById("verification-modal").classList.remove("active");
            
            // Show success message
            const paymentStatus = document.getElementById("payment-status");
            paymentStatus.textContent = "Payment verified successfully! Redirecting to confirmation...";
            paymentStatus.className = "payment-status success";
            
            // Update step indicator
            document.querySelectorAll(".step").forEach((step, index) => {
                if (index === 2) { // Third step (Confirm)
                    step.classList.add("active");
                }
            });
            
            // Redirect to confirmation page after delay
            setTimeout(() => {
                window.location.href = "confirmation.html";
            }, 2000);
        } else {
            alert("Please enter the complete 6-digit verification code.");
        }
    });

    // Close verification modal
    document.getElementById("close-verification").addEventListener("click", function() {
        document.getElementById("verification-modal").classList.remove("active");
    });

    // Resend code handler
    document.getElementById("resend-code").addEventListener("click", function(e) {
        e.preventDefault();
        
        // Reset timer
        document.getElementById("timer").textContent = "02:00";
        document.querySelector(".verification-timer").style.color = "";
        
        // Clear inputs
        verificationInputs.forEach(input => {
            input.value = "";
        });
        
        // Focus on first input
        document.querySelector('.verification-input[data-index="1"]').focus();
        
        // Show message
        alert("A new verification code has been sent.");
    });

    // Update step indicator when form is valid
    function checkFormValidity() {
        const cardName = document.getElementById("card-name").value.trim();
        const cardNumber = document.getElementById("card-number").value.trim().replace(/\s+/g, "");
        const expiryDate = document.getElementById("expiry-date").value.trim();
        const cvv = document.getElementById("cvv").value.trim();
        
        if (cardName.length >= 3 && cardNumber.length >= 16 && expiryDate.includes("/") && cvv.length >= 3) {
            // Update step indicator
            document.querySelectorAll(".step").forEach((step, index) => {
                if (index === 1) { // Second step (Verify)
                    step.classList.add("active");
                }
            });
        }
    }

    // Check form validity on input
    [cardNameInput, cardNumberInput, expiryDateInput, cvvInput].forEach(input => {
        input.addEventListener("input", checkFormValidity);
    });
});

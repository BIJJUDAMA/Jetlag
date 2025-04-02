document.addEventListener('DOMContentLoaded', () => {
    // Chat System
    const chatContainer = document.querySelector('.chat-container');
    const chatToggle = document.getElementById('chatToggle');
    const chatMessages = document.querySelector('.chat-messages');
    let chatHistory = [];

    if (chatToggle) {
        chatToggle.addEventListener('click', () => {
            chatContainer.classList.toggle('active');
        });
    }

    const closeChat = document.querySelector('.close-chat');
    if (closeChat) {
        closeChat.addEventListener('click', () => {
            chatContainer.classList.remove('active');
        });
    }

    // Mock AI Responses
    const aiResponses = {
        'delay': 'For real-time flight status, please use our flight tracker above.',
        'refund': 'Refunds typically take 7-10 business days. Need help initiating?',
        'baggage': 'Report lost baggage immediately at arrivals. Need the form?'
    };

    const chatInputBtn = document.querySelector('.chat-input button');
    if (chatInputBtn) {
        chatInputBtn.addEventListener('click', () => {
            const input = document.querySelector('.chat-input input');
            const message = input.value.trim();

            if (message) {
                // Add user message
                const userDiv = document.createElement('div');
                userDiv.className = 'message user-message';
                userDiv.textContent = message;
                chatMessages.appendChild(userDiv);

                // Add bot response
                setTimeout(() => {
                    const botDiv = document.createElement('div');
                    botDiv.className = 'message bot-message';
                    const responseKey = Object.keys(aiResponses).find(key =>
                        message.toLowerCase().includes(key)
                    );
                    botDiv.textContent = responseKey ? aiResponses[responseKey] : "I'll connect you to a live agent...";
                    chatMessages.appendChild(botDiv);

                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 1000);

                input.value = '';
            }
        });
    }

    // Tab System
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // Implement content switching
        });
    });

    // FAQ Interaction
    document.querySelectorAll('.faq-item').forEach(item => {
        item.addEventListener('click', () => {
            const answer = item.querySelector('.faq-answer');
            if (answer) {
                answer.style.maxHeight = answer.style.maxHeight ? null : `${answer.scrollHeight}px`;
            }
        });
    });

    // Flight Status Form
    const flightStatusForm = document.getElementById('flightStatusForm');
    if (flightStatusForm) {
        flightStatusForm.addEventListener('submit', e => {
            e.preventDefault();

            const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary') || '#007bff';

            document.querySelectorAll('.timeline-icon').forEach(icon => {
                icon.style.background = primaryColor;
            });
        });
    }

    // Feedback Form
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', e => {
            e.preventDefault();
            alert('Thank you for your feedback!');
        });
    }
});

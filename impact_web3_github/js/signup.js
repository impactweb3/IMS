// Signup functionality for Impact Web3
// Handles the extended signup form and integration with auth system

document.addEventListener('DOMContentLoaded', function() {
    // Get the full signup form
    const fullSignupForm = document.getElementById('fullSignupForm');
    const goToLoginLink = document.getElementById('goToLogin');
    
    // Initialize the auth system UI
    if (typeof updateAuthUI === 'function') {
        updateAuthUI();
    }
    
    // Handle the login link
    if (goToLoginLink) {
        goToLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('loginModal').classList.add('active');
        });
    }
    
    // Handle the full signup form submission
    if (fullSignupForm) {
        fullSignupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Optional fields
            const orgName = document.getElementById('orgName').value;
            const orgType = document.getElementById('orgType').value;
            const orgWebsite = document.getElementById('orgWebsite').value;
            
            // Get selected impact areas
            const impactAreas = [];
            document.querySelectorAll('input[name="impactAreas"]:checked').forEach(checkbox => {
                impactAreas.push(checkbox.value);
            });
            
            // Validate passwords match
            if (password !== confirmPassword) {
                showNotification('Passwords do not match. Please try again.', 'error');
                return;
            }
            
            // Validate password strength
            if (password.length < 8) {
                showNotification('Password must be at least 8 characters long.', 'error');
                return;
            }
            
            // Get existing users or initialize empty array
            let users = JSON.parse(localStorage.getItem('impactWeb3Users')) || [];
            
            // Check if user already exists
            if (users.some(user => user.email === email)) {
                showNotification('An account with this email already exists.', 'error');
                return;
            }
            
            // Create new user with extended profile
            const newUser = {
                id: generateUserId(),
                name: fullName,
                email: email,
                password: password, // In a real app, this would be hashed
                createdAt: new Date().toISOString(),
                organization: {
                    name: orgName,
                    type: orgType,
                    website: orgWebsite
                },
                impactAreas: impactAreas,
                projects: []
            };
            
            // Add to users array
            users.push(newUser);
            localStorage.setItem('impactWeb3Users', JSON.stringify(users));
            
            // Log in the new user
            let currentUser = newUser;
            localStorage.setItem('impactWeb3CurrentUser', JSON.stringify(currentUser));
            
            // Show success notification
            showNotification('Account created successfully! Welcome to Impact Web3, ' + fullName);
            
            // Redirect to impact form
            setTimeout(() => {
                window.location.href = 'impact-form.html';
            }, 1500);
        });
    }
});

// Helper Functions

// Generate a unique user ID
function generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
}

// Show notification if not defined in auth.js
if (typeof showNotification !== 'function') {
    function showNotification(message, type = 'success') {
        // Check if notification container exists, create if not
        let notificationContainer = document.getElementById('notification-container');
        
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'notification-container';
            notificationContainer.style.position = 'fixed';
            notificationContainer.style.top = '20px';
            notificationContainer.style.right = '20px';
            notificationContainer.style.zIndex = '9999';
            document.body.appendChild(notificationContainer);
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.backgroundColor = type === 'success' ? '#4CAF50' : '#F44336';
        notification.style.color = 'white';
        notification.style.padding = '15px 20px';
        notification.style.marginBottom = '10px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        notification.style.transition = 'all 0.3s ease';
        notification.style.opacity = '0';
        notification.textContent = message;
        
        // Add to container
        notificationContainer.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notificationContainer.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

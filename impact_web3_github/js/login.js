// Login functionality for Impact Web3
// Handles the login form and integration with auth system

document.addEventListener('DOMContentLoaded', function() {
    // Get the full login form
    const fullLoginForm = document.getElementById('fullLoginForm');
    const forgotPasswordLink = document.querySelector('.forgot-password');
    const socialButtons = document.querySelectorAll('.social-btn');
    
    // Initialize the auth system UI
    if (typeof updateAuthUI === 'function') {
        updateAuthUI();
    }
    
    // Handle the full login form submission
    if (fullLoginForm) {
        fullLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            // Get users from localStorage
            let users = JSON.parse(localStorage.getItem('impactWeb3Users')) || [];
            
            // Find user with matching credentials
            const user = users.find(user => user.email === email && user.password === password);
            
            if (user) {
                // Login successful
                let currentUser = user;
                
                // Store user in localStorage
                localStorage.setItem('impactWeb3CurrentUser', JSON.stringify(currentUser));
                
                // If remember me is checked, set a longer expiration
                if (rememberMe) {
                    // In a real app, this would set a longer cookie or token expiration
                    localStorage.setItem('impactWeb3RememberMe', 'true');
                } else {
                    localStorage.removeItem('impactWeb3RememberMe');
                }
                
                // Show success notification
                showNotification('Login successful! Welcome back, ' + user.name);
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                // Login failed
                showNotification('Invalid email or password. Please try again.', 'error');
            }
        });
    }
    
    // Handle forgot password link
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // In a real app, this would open a password reset form
            // For this demo, just show a notification
            showNotification('Password reset functionality would be implemented in a production environment.', 'info');
        });
    }
    
    // Handle social login buttons
    if (socialButtons) {
        socialButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get the provider name from the button class
                const provider = this.classList.contains('google') ? 'Google' : 'GitHub';
                
                // In a real app, this would redirect to OAuth flow
                // For this demo, just show a notification
                showNotification(`${provider} authentication would be implemented in a production environment.`, 'info');
            });
        });
    }
    
    // Handle modal login form if it exists
    const loginModalForm = document.getElementById('loginModalForm');
    if (loginModalForm) {
        loginModalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const email = document.getElementById('modalLoginEmail').value;
            const password = document.getElementById('modalLoginPassword').value;
            
            // Get users from localStorage
            let users = JSON.parse(localStorage.getItem('impactWeb3Users')) || [];
            
            // Find user with matching credentials
            const user = users.find(user => user.email === email && user.password === password);
            
            if (user) {
                // Login successful
                let currentUser = user;
                
                // Store user in localStorage
                localStorage.setItem('impactWeb3CurrentUser', JSON.stringify(currentUser));
                
                // Close the modal
                document.getElementById('loginModal').classList.remove('active');
                
                // Show success notification
                showNotification('Login successful! Welcome back, ' + user.name);
                
                // Update UI
                if (typeof updateAuthUI === 'function') {
                    updateAuthUI();
                }
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                // Login failed
                showNotification('Invalid email or password. Please try again.', 'error');
            }
        });
    }
});

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
        notification.style.backgroundColor = type === 'success' ? '#4CAF50' : 
                                            type === 'error' ? '#F44336' : 
                                            '#2196F3'; // info
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

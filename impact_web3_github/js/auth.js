// Authentication System for Impact Web3
// Handles user registration, login, and session management

// Mock database for users (in a real application, this would be a server-side database)
let users = JSON.parse(localStorage.getItem('impactWeb3Users')) || [];
let currentUser = JSON.parse(localStorage.getItem('impactWeb3CurrentUser')) || null;

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Modal elements
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const getStartedBtn = document.getElementById('getStartedBtn');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const closeSignupModal = document.getElementById('closeSignupModal');
    const switchToSignup = document.getElementById('switchToSignup');
    const switchToLogin = document.getElementById('switchToLogin');

    // Form elements
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    // Auth buttons in header
    const authButtons = document.querySelector('.auth-buttons');

    // Initialize UI based on authentication state
    updateAuthUI();

    // Event Listeners for Modal Controls
    loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.classList.add('active');
    });

    signupBtn.addEventListener('click', function(e) {
        e.preventDefault();
        signupModal.classList.add('active');
    });

    getStartedBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (currentUser) {
            window.location.href = 'impact-form.html';
        } else {
            signupModal.classList.add('active');
        }
    });

    closeLoginModal.addEventListener('click', function() {
        loginModal.classList.remove('active');
    });

    closeSignupModal.addEventListener('click', function() {
        signupModal.classList.remove('active');
    });

    switchToSignup.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.classList.remove('active');
        signupModal.classList.add('active');
    });

    switchToLogin.addEventListener('click', function(e) {
        e.preventDefault();
        signupModal.classList.remove('active');
        loginModal.classList.add('active');
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
        }
        if (e.target === signupModal) {
            signupModal.classList.remove('active');
        }
    });

    // Form Submissions
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        const user = authenticateUser(email, password);
        
        if (user) {
            // Login successful
            currentUser = user;
            localStorage.setItem('impactWeb3CurrentUser', JSON.stringify(currentUser));
            loginModal.classList.remove('active');
            updateAuthUI();
            showNotification('Login successful! Welcome back, ' + user.name);
            
            // Redirect to dashboard if coming from login button
            if (e.submitter === loginForm.querySelector('button')) {
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            }
        } else {
            // Login failed
            showNotification('Invalid email or password. Please try again.', 'error');
        }
    });

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        
        // Validate passwords match
        if (password !== confirmPassword) {
            showNotification('Passwords do not match. Please try again.', 'error');
            return;
        }
        
        // Check if user already exists
        if (users.some(user => user.email === email)) {
            showNotification('An account with this email already exists.', 'error');
            return;
        }
        
        // Create new user
        const newUser = {
            id: generateUserId(),
            name: name,
            email: email,
            password: password, // In a real app, this would be hashed
            createdAt: new Date().toISOString(),
            projects: []
        };
        
        // Add to users array
        users.push(newUser);
        localStorage.setItem('impactWeb3Users', JSON.stringify(users));
        
        // Log in the new user
        currentUser = newUser;
        localStorage.setItem('impactWeb3CurrentUser', JSON.stringify(currentUser));
        
        // Close modal and update UI
        signupModal.classList.remove('active');
        updateAuthUI();
        showNotification('Account created successfully! Welcome to Impact Web3, ' + name);
        
        // Redirect to impact form
        setTimeout(() => {
            window.location.href = 'impact-form.html';
        }, 1000);
    });

    // Logout functionality
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'logoutBtn') {
            e.preventDefault();
            logout();
        }
    });
});

// Helper Functions

// Authenticate user
function authenticateUser(email, password) {
    return users.find(user => user.email === email && user.password === password);
}

// Generate a unique user ID
function generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
}

// Update UI based on authentication state
function updateAuthUI() {
    const authButtons = document.querySelector('.auth-buttons');
    
    if (currentUser) {
        // User is logged in
        authButtons.innerHTML = `
            <span style="margin-right: 10px;">Hello, ${currentUser.name}</span>
            <a href="dashboard.html" class="btn auth-btn login-btn">Dashboard</a>
            <a href="#" class="btn auth-btn signup-btn" id="logoutBtn">Logout</a>
        `;
    } else {
        // User is logged out
        authButtons.innerHTML = `
            <a href="#" class="btn auth-btn login-btn" id="loginBtn">Log In</a>
            <a href="#" class="btn auth-btn signup-btn" id="signupBtn">Sign Up</a>
        `;
        
        // Reattach event listeners
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        
        if (loginBtn) {
            loginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                document.getElementById('loginModal').classList.add('active');
            });
        }
        
        if (signupBtn) {
            signupBtn.addEventListener('click', function(e) {
                e.preventDefault();
                document.getElementById('signupModal').classList.add('active');
            });
        }
    }
}

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('impactWeb3CurrentUser');
    updateAuthUI();
    showNotification('You have been logged out successfully.');
    
    // Redirect to home if on a protected page
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'dashboard.html' || currentPage === 'impact-form.html') {
        window.location.href = 'index.html';
    }
}

// Show notification
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

// Check if user is authenticated (for protected pages)
function checkAuth() {
    if (!currentUser) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Export functions for use in other scripts
window.ImpactAuth = {
    getCurrentUser: () => currentUser,
    checkAuth: checkAuth,
    logout: logout
};

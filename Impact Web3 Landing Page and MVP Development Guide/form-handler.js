// Contact form validation and submission handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Add form validation
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form fields
            const nameField = document.getElementById('name');
            const emailField = document.getElementById('email');
            const organizationField = document.getElementById('organization');
            const messageField = document.getElementById('message');
            
            // Reset previous error states
            resetFormErrors();
            
            // Validate fields
            let isValid = true;
            
            if (!nameField.value.trim()) {
                showError(nameField, 'Name is required');
                isValid = false;
            }
            
            if (!emailField.value.trim()) {
                showError(emailField, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(emailField.value)) {
                showError(emailField, 'Please enter a valid email address');
                isValid = false;
            }
            
            if (!messageField.value.trim()) {
                showError(messageField, 'Message is required');
                isValid = false;
            }
            
            // If form is valid, submit it
            if (isValid) {
                // In a real implementation, you would send the data to a server
                // For now, we'll just show a success message
                
                // Create success message
                const successMessage = document.createElement('div');
                successMessage.className = 'form-success';
                successMessage.innerHTML = `
                    <h3>Thank you for your message!</h3>
                    <p>We've received your inquiry and will get back to you shortly.</p>
                `;
                successMessage.style.backgroundColor = '#d4edda';
                successMessage.style.color = '#155724';
                successMessage.style.padding = '15px';
                successMessage.style.borderRadius = '4px';
                successMessage.style.marginBottom = '20px';
                
                // Insert success message before form
                contactForm.parentNode.insertBefore(successMessage, contactForm);
                
                // Reset form
                contactForm.reset();
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            }
        });
    }
    
    // Helper functions
    function showError(field, message) {
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#dc3545';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '5px';
        
        // Add error styling to field
        field.style.borderColor = '#dc3545';
        
        // Insert error message after field
        field.parentNode.appendChild(errorDiv);
    }
    
    function resetFormErrors() {
        // Remove all error messages
        const errorMessages = document.querySelectorAll('.form-error');
        errorMessages.forEach(error => error.remove());
        
        // Reset field styling
        const formFields = document.querySelectorAll('.form-group input, .form-group textarea');
        formFields.forEach(field => {
            field.style.borderColor = '';
        });
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});

// Performance optimizations
document.addEventListener('DOMContentLoaded', function() {
    // Lazy load images
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
    
    // Defer non-critical CSS
    const loadDeferredStyles = function() {
        const deferredStyles = document.querySelectorAll('link[rel="stylesheet"][media="print"]');
        deferredStyles.forEach(styleSheet => {
            styleSheet.media = 'all';
        });
    };
    
    // Load deferred styles after page load
    if (window.addEventListener) {
        window.addEventListener('load', loadDeferredStyles);
    } else if (window.attachEvent) {
        window.attachEvent('onload', loadDeferredStyles);
    }
    
    // Add browser compatibility checks
    const browserCheck = function() {
        // Check for CSS Grid support
        if (!CSS.supports('display', 'grid')) {
            console.warn('Your browser does not fully support CSS Grid. Some layout features may not display correctly.');
        }
        
        // Check for Flexbox support
        if (!CSS.supports('display', 'flex')) {
            console.warn('Your browser does not fully support Flexbox. Some layout features may not display correctly.');
        }
        
        // Check for IntersectionObserver support
        if (!('IntersectionObserver' in window)) {
            console.warn('Your browser does not support IntersectionObserver. Lazy loading images will not work optimally.');
        }
    };
    
    // Run browser compatibility check
    browserCheck();
});

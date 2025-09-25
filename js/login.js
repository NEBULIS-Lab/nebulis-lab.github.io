// NEBULIS Lab Login Page JavaScript
// Login page form handling and validation

document.addEventListener('DOMContentLoaded', function() {
    // Initialize login form
    initLoginForm();
    
    // Initialize form validation
    initFormValidation();
    
    // Initialize remember me functionality
    initRememberMe();
});

// Initialize login form
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', handleLoginSubmit);
}

// Handle login submission
function handleLoginSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');
    
    // Basic validation
    if (!validateEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    if (!password || password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;
    
    // Simulate login request
    simulateLogin(email, password, remember)
        .then(result => {
            if (result.success) {
                showSuccess('Login successful!');
                
                // If remember me is selected, save to local storage
                if (remember) {
                    localStorage.setItem('rememberedEmail', email);
                }
                
                // Redirect to internal page (in real project should redirect to actual internal page)
                setTimeout(() => {
                    window.location.href = '/dashboard.html';
                }, 1000);
            } else {
                showError(result.message || 'Login failed, please check email and password');
            }
        })
        .catch(error => {
            showError('An error occurred during login, please try again later');
            console.error('Login error:', error);
        })
        .finally(() => {
            // Restore button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
}

// Simulate login request
function simulateLogin(email, password, remember) {
    return new Promise((resolve) => {
        // Simulate network delay
        setTimeout(() => {
            // This should be a real API call
            // Now just simulate some basic validation
            
            // Simulated validation logic
            const validEmails = [
                'admin@nebulislab.org',
                'member@nebulislab.org',
                'researcher@nebulislab.org'
            ];
            
            const validPasswords = [
                'password123',
                'admin123',
                'member123'
            ];
            
            if (validEmails.includes(email.toLowerCase()) && validPasswords.includes(password)) {
                resolve({
                    success: true,
                    user: {
                        email: email,
                        name: 'NEBULIS Lab Member',
                        role: 'member'
                    }
                });
            } else {
                resolve({
                    success: false,
                    message: 'Email or password is incorrect'
                });
            }
        }, 1500);
    });
}

// Initialize form validation
function initFormValidation() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            validateEmailField(emailInput);
        });
        
        emailInput.addEventListener('input', () => {
            clearFieldError(emailInput);
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('blur', () => {
            validatePasswordField(passwordInput);
        });
        
        passwordInput.addEventListener('input', () => {
            clearFieldError(passwordInput);
        });
    }
}

// Validate email field
function validateEmailField(input) {
    const email = input.value.trim();
    
    if (!email) {
        showFieldError(input, 'Please enter email address');
        return false;
    }
    
    if (!validateEmail(email)) {
        showFieldError(input, 'Please enter a valid email address');
        return false;
    }
    
    clearFieldError(input);
    return true;
}

// Validate password field
function validatePasswordField(input) {
    const password = input.value;
    
    if (!password) {
        showFieldError(input, 'Please enter password');
        return false;
    }
    
    if (password.length < 6) {
        showFieldError(input, 'Password must be at least 6 characters');
        return false;
    }
    
    clearFieldError(input);
    return true;
}

// Validate email format
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show field error
function showFieldError(input, message) {
    clearFieldError(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#dc2626';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    input.parentNode.appendChild(errorDiv);
    input.style.borderColor = '#dc2626';
}

// Clear field error
function clearFieldError(input) {
    const existingError = input.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    input.style.borderColor = '';
}

// Show error message
function showError(message) {
    showMessage(message, 'error');
}

// Show success message
function showSuccess(message) {
    showMessage(message, 'success');
}

// Show message
function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.login-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `login-message login-message-${type}`;
    messageDiv.textContent = message;
    
    // Style settings
    messageDiv.style.padding = '0.75rem 1rem';
    messageDiv.style.borderRadius = '0.5rem';
    messageDiv.style.marginBottom = '1rem';
    messageDiv.style.fontSize = '0.875rem';
    messageDiv.style.fontWeight = '500';
    
    if (type === 'error') {
        messageDiv.style.backgroundColor = '#fef2f2';
        messageDiv.style.color = '#dc2626';
        messageDiv.style.border = '1px solid #fecaca';
    } else if (type === 'success') {
        messageDiv.style.backgroundColor = '#f0fdf4';
        messageDiv.style.color = '#16a34a';
        messageDiv.style.border = '1px solid #bbf7d0';
    }
    
    // Insert before form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.parentNode.insertBefore(messageDiv, loginForm);
        
        // Auto remove message
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

// Initialize remember me functionality
function initRememberMe() {
    const rememberCheckbox = document.querySelector('input[name="remember"]');
    const emailInput = document.getElementById('email');
    
    if (rememberCheckbox && emailInput) {
        // Check if there's a saved email
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            emailInput.value = rememberedEmail;
            rememberCheckbox.checked = true;
        }
    }
}

// Forgot password handling
function initForgotPassword() {
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (!forgotPasswordLink) return;
    
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        
        if (!email) {
            showError('Please enter email address first');
            return;
        }
        
        if (!validateEmail(email)) {
            showError('Please enter a valid email address');
            return;
        }
        
        // Simulate sending password reset email
        showSuccess('Password reset email has been sent to your email');
        
        // In real project should call API to send reset email
        console.log('Password reset requested for:', email);
    });
}

// Keyboard shortcuts
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Enter key to submit form
        if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.dispatchEvent(new Event('submit'));
            }
        }
        
        // Escape key to clear error messages
        if (e.key === 'Escape') {
            const message = document.querySelector('.login-message');
            if (message) {
                message.remove();
            }
        }
    });
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', function() {
    initForgotPassword();
    initKeyboardShortcuts();
});

// Export functions
window.LoginPage = {
    validateEmail,
    showError,
    showSuccess,
    simulateLogin
};

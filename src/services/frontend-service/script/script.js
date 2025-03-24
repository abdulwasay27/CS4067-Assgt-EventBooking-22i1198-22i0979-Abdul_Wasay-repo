document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    
    // Email validation function
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    // Display error message
    const displayError = (element, message) => {
        let errorElement = element.nextElementSibling;
    
        // If no error element exists, create one
        if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement("small");
            errorElement.classList.add("error-message");
            errorElement.style.color = "red";
            errorElement.style.display = "block";
            errorElement.style.marginTop = "5px"; // Add spacing below input
            element.parentNode.insertBefore(errorElement, element.nextSibling);
        }
    
        errorElement.innerText = message;
        errorElement.style.display = "block";
    };
    

    // Clear error message
    const clearError = (element) => {
        let errorElement = element.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.innerText = '';
            errorElement.style.display = 'none';
        }
    };
    

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            console.log("I made it here")
            e.preventDefault();
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            console.log(email.value, password)
            // Validate email
            if (!validateEmail(email.value)) {
                displayError(email, 'Please enter a valid email address.');
                return;
            } else {
                clearError(email);
            }

            // Validate password length
            if (password.value.length < 2) {
                displayError(password, 'Password must be at least 2 characters long.');
                return;
            } else {
                clearError(password);
            }

            // Proceed with form submission
            try {
                const response = await fetch('http://localhost:8080/user/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: email.value, password: password.value }),
                });
                const data = await response.json();
                if (response.ok) {
                    alert(data.message || 'User registered successfully!');
                    window.location.href = 'login.html';
                } else {
                    alert(data.message || 'Registration failed. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email');
            const password = document.getElementById('password');

            // Validate email
            if (!validateEmail(email.value)) {
                displayError(email, 'Please enter a valid email address.');
                return;
            } else {
                clearError(email);
            }

            // Validate password length
            if (password.value.length < 2) {
                displayError(password, 'Password must be at least 2 characters long.');
                return;
            } else {
                clearError(password);
            }

            // Proceed with form submission
            try {
                const response = await fetch('http://localhost:8080/user/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: email.value, password: password.value }),
                });

                const data = await response.json();
                if (response.ok) {
                    alert('Login successful!');
                    localStorage.setItem("jwtToken", data.token); 
                    localStorage.setItem("userEmail", email.value);
                    window.location.href = 'dashboard.html';
                } else {
                    alert(data.message || 'Invalid credentials. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }
});

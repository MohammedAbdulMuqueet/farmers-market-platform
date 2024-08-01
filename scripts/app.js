document.addEventListener('DOMContentLoaded', () => {
    const farmerRegistrationForm = document.getElementById('farmer-registration-form');
    if (farmerRegistrationForm) {
        farmerRegistrationForm.addEventListener('submit', async (event) => {
            event.preventDefault(); 
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const farmName = document.getElementById('farmName').value;
            const location = document.getElementById('location').value;
            const data = { name, email, password, farmName, location };
            try {
                const response = await fetch('http://localhost:3000/api/farmer-register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                const contentType = response.headers.get('Content-Type');
                if (contentType && contentType.includes('application/json')) {
                    const result = await response.json();

                    if (response.ok) {
                        alert('Farmer Registration successful!');
                        farmerRegistrationForm.reset(); 
                    } else {
                        alert('Registration failed: ' + (result.message || 'An error occurred'));
                    }
                } else {
                    const text = await response.text();
                    console.error('Unexpected response:', text);
                    alert('An error occurred. Please try again.');
                }
            } catch (error) {
                console.error('Error during registration:', error);
                alert('An error occurred. Please try again.');
            }
        });
    } else {
        console.error('Farmer registration form is missing in the DOM');
    }
    const consumerRegistrationForm = document.getElementById('consumer-registration-form');
    if (consumerRegistrationForm) {
        consumerRegistrationForm.addEventListener('submit', async (event) => {
            event.preventDefault(); 
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const address = document.getElementById('address').value; 
            const data = { name, email, password, address };
            try {
                const response = await fetch('http://localhost:3000/api/consumer-register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                const contentType = response.headers.get('Content-Type');
                if (contentType && contentType.includes('application/json')) {
                    const result = await response.json();
                    if (response.ok) {
                        alert('Consumer Registration successful!');
                        consumerRegistrationForm.reset(); 
                    } else {
                        alert('Registration failed: ' + (result.message || 'An error occurred'));
                    }
                } else {
                    const text = await response.text();
                    console.error('Unexpected response:', text);
                    alert('An error occurred. Please try again.');
                }
            } catch (error) {
                console.error('Error during registration:', error);
                alert('An error occurred. Please try again.');
            }
        });
    } else {
        console.error('Consumer registration form is missing in the DOM');
    }
    const farmerLoginForm = document.getElementById('farmer-login-form');
    if (farmerLoginForm) {
        farmerLoginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('farmer-login-email').value;
            const password = document.getElementById('farmer-login-password').value;
            try {
                const response = await fetch('http://localhost:3000/api/farmer-login', { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                if (response.ok) {
                    const result = await response.json();
                    localStorage.setItem('token', result.token);
                    localStorage.setItem('userType', 'farmer');
                    alert('Login successful');
                    window.location.href = 'product.html'; 
                } else {
                    const errorResult = await response.json();
                    alert('Login failed: ' + errorResult.message);
                }
            } catch (error) {
                alert('An error occurred: ' + error.message);
            }
        });
    } else {
        console.error('Farmer login form is missing in the DOM');
    }
    const consumerLoginForm = document.getElementById('consumer-login-form');
    if (consumerLoginForm) {
        consumerLoginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('consumer-login-email').value;
            const password = document.getElementById('consumer-login-password').value;
            try {
                const response = await fetch('http://localhost:3000/api/consumer-login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                if (response.ok) {
                    const result = await response.json();
                    localStorage.setItem('token', result.token);
                    localStorage.setItem('userType', 'consumer');
                    alert('Login successful');
                    window.location.href = 'order.html'; 
                } else {
                    const errorResult = await response.json();
                    alert('Login failed: ' + errorResult.message);
                }
            } catch (error) {
                alert('An error occurred: ' + error.message);
            }
        });
    } else {
        console.error('Consumer login form is missing in the DOM');
    }
    const restrictAccess = () => {
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');

        if (window.location.pathname === '/product.html' && userType !== 'farmer') {
            window.location.href = 'farmer-login.html'; 
        }
        if (window.location.pathname === '/order.html' && userType !== 'consumer') {
            window.location.href = 'consumer-login.html'; 
        }
        if (window.location.pathname === '/message.html' && userType !== 'consumer') {
            window.location.href = 'consumer-login.html'; 
        }
    };
    restrictAccess();
    const farmerLoginButton = document.getElementById('show-farmer-login');
    const consumerLoginButton = document.getElementById('show-consumer-login');
    const farmerLoginContainer = document.getElementById('farmer-login-container');
    const consumerLoginContainer = document.getElementById('consumer-login-container');
    const homeContent = document.getElementById('home-content');
    if (farmerLoginButton && consumerLoginButton) {
        farmerLoginButton.addEventListener('click', () => {
            homeContent.style.display = 'none';
            farmerLoginContainer.style.display = 'block';
            consumerLoginContainer.style.display = 'none';
        });
        consumerLoginButton.addEventListener('click', () => {
            homeContent.style.display = 'none';
            consumerLoginContainer.style.display = 'block';
            farmerLoginContainer.style.display = 'none';
        });
    } else {
        console.error('Login buttons or containers are missing in the DOM');
    }
});

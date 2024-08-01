document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('consumer-login');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('consumer-email').value;
        const password = document.getElementById('consumer-password').value;

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const result = await response.json();
                localStorage.setItem('token', result.token);
                alert('Login successful');
                window.location.href = 'dashboard.html';
            } else {
                const errorResult = await response.json();
                alert('Login failed: ' + errorResult.message);
            }
        } catch (error) {
            alert('An error occurred: ' + error.message);
        }
    });
});

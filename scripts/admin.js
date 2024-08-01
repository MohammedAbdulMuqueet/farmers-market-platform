document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('admin-login-form');
    const feedbackContainer = document.getElementById('feedback-container');
    const deleteFeedbackBtn = document.getElementById('delete-feedback-btn'); 
    const feedbackList = document.getElementById('feedback-list');
    const fetchFeedback = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/feedback', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                }
            });
            if (response.ok) {
                const feedbacks = await response.json();
                feedbackList.innerHTML = ''; 

                feedbacks.forEach(item => {
                    const feedbackElement = document.createElement('li');
                    feedbackElement.textContent = `User: ${item.userEmail}, Feedback: ${item.feedback}`;
                    feedbackList.appendChild(feedbackElement);
                });
            } else {
                const errorData = await response.json();
                throw new Error(`Failed to fetch feedback: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error fetching feedback:', error);
            alert('Failed to fetch feedback: ' + error.message);
        }
    };
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        if (email === 'admin@farmersmarket.com' && password === 'admin@123') {
            try {
                const response = await fetch('http://localhost:3000/api/admin/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('token', data.token);
                    console.log('Stored token in localStorage:', data.token); 
                    loginForm.style.display = 'none';
                    feedbackContainer.style.display = 'block';
                    fetchFeedback();
                } else {
                    const errorData = await response.json();
                    alert(`Login failed: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Error during login:', error);
                alert('Login failed: ' + error.message);
            }
        } else {
            alert('Invalid admin credentials');
        }
    });
    deleteFeedbackBtn.addEventListener('click', async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/feedback', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                }
            });
            if (response.ok) {
                feedbackList.innerHTML = ''; 
                alert('All feedback deleted successfully');
            } else {
                const errorData = await response.json();
                throw new Error(`Failed to delete feedback: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error during feedback deletion:', error);
            alert('Failed to delete feedback: ' + error.message);
        }
    });
});
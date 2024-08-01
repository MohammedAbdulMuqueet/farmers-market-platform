const fetch = require('node-fetch'); 

fetch('http://localhost:3000/admin/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email: 'admin@farmersmarket.com',
        password: 'admin@123'
    })
})
.then(response => response.text()) 
.then(data => {
    console.log('Response Text:', data);
    try {
        const jsonData = JSON.parse(data); 
        console.log('Token:', jsonData.token);
    } catch (err) {
        console.error('Error parsing JSON:', err);
    }
})
.catch(error => console.error('Error:', error));
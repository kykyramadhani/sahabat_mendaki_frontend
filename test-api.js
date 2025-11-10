const fetch = require('node-fetch');

async function testLogin() {
  try {
    const response = await fetch('http://localhost:5000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'test123'
      })
    });
    
    console.log('Status:', response.status);
    const data = await response.text();
    console.log('Response:', data);
  } catch (err) {
    console.error('Error:', err);
  }
}

testLogin();
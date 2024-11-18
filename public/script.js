// Google Sign-In Handler
function handleCredentialResponse(response) {
    const data = JSON.parse(atob(response.credential.split('.')[1]));
    console.log("Google User:", data);
  
    alert(`Welcome, ${data.name}!`);
    // Send user info to server if needed
  }
  
  // Sign-Up Form Submission
  document.getElementById('signup-form').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    const response = await fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
  
    if (response.ok) {
      alert('Sign-up successful');
    } else {
      alert('Error signing up');
    }
  });
  
  // Login Form Submission
  document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
  
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  
    if (response.ok) {
      alert('Login successful');
    } else {
      alert('Invalid credentials');
    }
  });
  
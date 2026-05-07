const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

const message = document.getElementById('message');

// Switch tabs
loginTab.addEventListener('click', () => {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');

    loginTab.classList.add('active');
    registerTab.classList.remove('active');

    message.textContent = '';
});

registerTab.addEventListener('click', () => {
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');

    registerTab.classList.add('active');
    loginTab.classList.remove('active');

    message.textContent = '';
});


    // LOGIN USER
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;

      try {
        const response = await fetch('http://localhost:3000/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        message.style.color = 'green';
        message.textContent = data.message;

      } catch (error) {
        message.style.color = 'red';
        message.textContent = error.message;
      }
    });




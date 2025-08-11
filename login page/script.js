   let generatedOTP = "";
    let currentMobileNumber = "";

    // Handle Enter key navigation
    function handleEnterKey(event, nextAction) {
      if (event.key === 'Enter') {
        event.preventDefault();
        
        if (nextAction === 'register') {
          register();
        } else if (nextAction === 'login') {
          login();
        } else if (nextAction === 'sendOTP') {
          sendOTP();
        } else if (nextAction === 'verifyOTP') {
          verifyOTP();
        } else if (nextAction === 'resetCredentials') {
          resetCredentials();
        } else {
          // Focus next input field
          const nextElement = document.getElementById(nextAction);
          if (nextElement) {
            nextElement.focus();
          }
        }
      }
    }

    // Parallax gradient effect
    document.addEventListener('mousemove', function(e){
      const percentX = e.clientX / window.innerWidth;
      const percentY = e.clientY / window.innerHeight;
      document.body.style.backgroundPosition = `${30 + percentX*40}% ${40 + percentY*20}%`;
      document.body.style.transition = 'background-position 0.3s cubic-bezier(.77,0,.18,1)';
    });

    // Show/Hide helpers
    function showLogin() { 
      clearAll(); 
      hideAll(); 
      // Ensure modal is hidden
      document.getElementById('success-modal').classList.add('hidden');
      document.getElementById('login-form').classList.remove('hidden'); 
    }
    
    function showRegister() { 
      clearAll(); 
      hideAll(); 
      // Ensure modal is hidden
      document.getElementById('success-modal').classList.add('hidden');
      document.getElementById('register-form').classList.remove('hidden'); 
    }
    
    function showForgotMobile() { clearAll(); hideAll(); document.getElementById('forgot-mobile-form').classList.remove('hidden'); }
    function showOTP() { clearAll(); hideAll(); document.getElementById('otp-form').classList.remove('hidden'); }
    function showReset() { clearAll(); hideAll(); document.getElementById('reset-form').classList.remove('hidden'); }
    function showSecure() { clearAll(); hideAll(); document.getElementById('secure-page').classList.remove('hidden'); }
    
    function hideAll() { 
      document.querySelectorAll('.container').forEach(el => el.classList.add('hidden')); 
    }
    
    function clearAll() {
      document.querySelectorAll('input').forEach(input => input.value = '');
      document.querySelectorAll('.message').forEach(msg => { 
        msg.innerText = ''; 
        msg.classList.remove('error-message'); 
      });
    }

    // Registration with fixed modal logic
    function register() {
      const usernameEl = document.getElementById('reg-username');
      const passwordEl = document.getElementById('reg-password');
      const regMsg = document.getElementById('reg-message');

      // Clear previous messages first
      regMsg.innerText = '';
      regMsg.classList.remove('error-message');

      const username = usernameEl.value.trim();
      const password = passwordEl.value.trim();

      // Validate - if fails, show error and RETURN (no modal)
      if (username.length < 8 || password.length < 8) {
        regMsg.classList.add('error-message');
        regMsg.innerText = "Username & Password must be at least 8 characters.";
        return; // CRITICAL: Exit here, modal won't show
      }

      // Only if validation passes, save and show modal
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
      
      // Show success modal ONLY after successful save
      document.getElementById('success-modal').classList.remove('hidden');
    }

    // Close modal and go to login
    function closeModal() {
      document.getElementById('success-modal').classList.add('hidden');
      // Clear registration fields
      document.getElementById('reg-username').value = '';
      document.getElementById('reg-password').value = '';
      showLogin();
    }

    // Login function
    function login() {
      const username = document.getElementById('login-username').value.trim();
      const password = document.getElementById('login-password').value.trim();
      const storedUser = localStorage.getItem('username');
      const storedPass = localStorage.getItem('password');
      
      if (!username || !password) {
        document.getElementById('login-message').innerText = "Please fill in all fields.";
        return;
      }
      
      if (username === storedUser && password === storedPass) {
        localStorage.setItem('loggedIn', 'true');
        window.location.href = "https://saikrishnajanga.github.io/demoresume/"; // Change this to your target page
      } else {
        document.getElementById('login-message').innerText = "Invalid credentials!";
        document.getElementById('login-username').value = "";
        document.getElementById('login-password').value = "";
      }
    }

    // Forgot Password - OTP flow
    function forgotPassword() { showForgotMobile(); }
    
    function sendOTP() {
      const mobile = document.getElementById('mobile-number').value.trim();
      if (!mobile.match(/^\d{8,15}$/)) {
        document.getElementById('mobile-message').innerText = "Please enter a valid mobile number.";
        return;
      }
      if (!localStorage.getItem('username')) {
        document.getElementById('mobile-message').innerText = "No registered account found.";
        return;
      }
      currentMobileNumber = mobile;
      generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
      document.getElementById('otp-display').innerText = generatedOTP;
      showOTP();
    }
    
    function verifyOTP() {
      const userOTP = document.getElementById('otp-input').value.trim();
      if (userOTP === "") {
        document.getElementById('otp-message').innerText = "Please enter the OTP.";
        return;
      }
      if (userOTP === generatedOTP) {
        showReset();
      } else {
        document.getElementById('otp-message').innerText = "Invalid OTP.";
      }
    }
    
    function resetCredentials() {
      const newUsername = document.getElementById('reset-username').value.trim();
      const newPassword = document.getElementById('reset-password').value.trim();
      if (newUsername.length < 8 || newPassword.length < 8) {
        document.getElementById('reset-message').innerText = "Username & Password must be at least 8 characters.";
        return;
      }
      localStorage.setItem('username', newUsername);
      localStorage.setItem('password', newPassword);
      document.getElementById('reset-message').innerText = "Credentials updated successfully! Please login.";
      setTimeout(showLogin, 1500);
    }
    
    function logout() {
      localStorage.removeItem('loggedIn');
      showLogin();
    }

    // Initialize page - ensure modal is hidden
    window.onload = () => {
      // Force hide modal on page load
      document.getElementById('success-modal').classList.add('hidden');
      clearAll();
      showLogin();
    };
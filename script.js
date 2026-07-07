// Password validation functions
function hasUpper(s) {
  return /[A-Z]/.test(s);
}

function hasLower(s) {
  return /[a-z]/.test(s);
}

function hasDigit(s) {
  return /[0-9]/.test(s);
}

function hasSpecial(s) {
  return /[!@#$%^&*()_+\-=\[\]{};:'",.<>?\/\\|`~]/.test(s);
}

function analyzePassword(pwd) {
  return {
    length: pwd.length >= 8,
    upper: hasUpper(pwd),
    lower: hasLower(pwd),
    digit: hasDigit(pwd),
    special: hasSpecial(pwd)
  };
}

function getStrength(results) {
  const score = [results.length, results.upper, results.lower, results.digit, results.special].filter(Boolean).length;
  if (score <= 2) return { label: 'Weak', color: '#f44336', class: 'weak', score };
  if (score <= 4) return { label: 'Moderate', color: '#ff9800', class: 'moderate', score };
  return { label: 'Strong', color: '#4caf50', class: 'strong', score };
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const pwdInput = document.getElementById('pwd-input');
  const btnCheck = document.getElementById('btn-check');
  const btnGenerate = document.getElementById('btn-generate');
  const btnGenerateName = document.getElementById('btn-generate-name');
  const progressBar = document.getElementById('progress-bar');
  const result = document.getElementById('result');

  const checkLength = document.getElementById('check-length');
  const checkUpper = document.getElementById('check-upper');
  const checkLower = document.getElementById('check-lower');
  const checkDigit = document.getElementById('check-digit');
  const checkSpecial = document.getElementById('check-special');

  const generateModal = document.getElementById('generate-modal');
  const nameModal = document.getElementById('name-modal');
  const closeModal = document.getElementById('close-modal');
  const closeModalName = document.getElementById('close-modal-name');
  const togglePassword = document.getElementById('toggle-password');

  // Toggle password visibility
  if (togglePassword && pwdInput) {
    togglePassword.addEventListener('click', function(e) {
      e.preventDefault();
      const isPassword = pwdInput.type === 'password';
      pwdInput.type = isPassword ? 'text' : 'password';
      togglePassword.textContent = isPassword ? '🙈' : '👁️';
    });
  }

  // Real-time password checking
  if (pwdInput) {
    pwdInput.addEventListener('input', function() {
      const pwd = this.value;
      if (pwd.length === 0) {
        progressBar.style.width = '0%';
        result.textContent = '';
        result.className = 'result';
        checkLength.textContent = '✗';
        checkLength.className = 'icon fail';
        checkUpper.textContent = '✗';
        checkUpper.className = 'icon fail';
        checkLower.textContent = '✗';
        checkLower.className = 'icon fail';
        checkDigit.textContent = '✗';
        checkDigit.className = 'icon fail';
        checkSpecial.textContent = '✗';
        checkSpecial.className = 'icon fail';
        return;
      }

      const analysis = analyzePassword(pwd);
      const strength = getStrength(analysis);

      // Update progress bar
      const percentage = (strength.score / 5) * 100;
      progressBar.style.width = percentage + '%';
      progressBar.style.background = strength.color;

      // Update result text
      result.textContent = `Password Strength: ${strength.label}`;
      result.className = `result ${strength.class}`;

      // Update requirement checks
      updateRequirementIcon(checkLength, analysis.length);
      updateRequirementIcon(checkUpper, analysis.upper);
      updateRequirementIcon(checkLower, analysis.lower);
      updateRequirementIcon(checkDigit, analysis.digit);
      updateRequirementIcon(checkSpecial, analysis.special);
    });
  }

  function updateRequirementIcon(element, passed) {
    if (passed) {
      element.textContent = '✓';
      element.className = 'icon pass';
    } else {
      element.textContent = '✗';
      element.className = 'icon fail';
    }
  }

  // Check button functionality
  if (btnCheck) {
    btnCheck.addEventListener('click', function() {
      const pwd = pwdInput.value;
      if (pwd.length === 0) {
        alert('Please enter a password!');
        return;
      }
    });
  }

  // Generate Strong Password Modal
  if (btnGenerate) {
    btnGenerate.addEventListener('click', function() {
      generateModal.classList.remove('hidden');
    });
  }

  if (closeModal) {
    closeModal.addEventListener('click', function() {
      generateModal.classList.add('hidden');
    });
  }

  if (generateModal) {
    generateModal.addEventListener('click', function(e) {
      if (e.target === generateModal) {
        generateModal.classList.add('hidden');
      }
    });
  }

  const genStrongBtn = document.getElementById('gen-strong');
  if (genStrongBtn) {
    genStrongBtn.addEventListener('click', function() {
      const length = parseInt(document.getElementById('password-length').value) || 16;
      const password = generateStrongPassword(length);
      displayGeneratedPassword(password, 'generated-password');
    });
  }

  // Generate from Name Modal
  if (btnGenerateName) {
    btnGenerateName.addEventListener('click', function() {
      nameModal.classList.remove('hidden');
    });
  }

  if (closeModalName) {
    closeModalName.addEventListener('click', function() {
      nameModal.classList.add('hidden');
    });
  }

  if (nameModal) {
    nameModal.addEventListener('click', function(e) {
      if (e.target === nameModal) {
        nameModal.classList.add('hidden');
      }
    });
  }

  const genNameBtn = document.getElementById('gen-name');
  if (genNameBtn) {
    genNameBtn.addEventListener('click', function() {
      const name = document.getElementById('name-input').value.trim();
      if (name.length === 0) {
        alert('Please enter a name!');
        return;
      }
      const password = generatePasswordFromName(name);
      displayGeneratedPassword(password, 'generated-from-name');
    });
  }

  // Password generation functions
  function generateStrongPassword(length = 16) {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let password = '';
    
    // Ensure at least one character from each category
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += digits[Math.floor(Math.random() * digits.length)];
    password += special[Math.floor(Math.random() * special.length)];

    // Fill the rest randomly
    const allChars = uppercase + lowercase + digits + special;
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  function generatePasswordFromName(name) {
    const nameLower = name.toLowerCase();
    const nameUpper = name.toUpperCase();
    const digits = '0123456789';
    const special = '!@#$%^&*';

    // Use first and last letters
    let password = nameUpper[0];
    password += nameLower.slice(1, Math.min(5, nameLower.length));
    password += nameUpper[Math.min(name.length - 1, name.length - 1)];
    password += digits[Math.floor(Math.random() * digits.length)];
    password += digits[Math.floor(Math.random() * digits.length)];
    password += special[Math.floor(Math.random() * special.length)];

    return password;
  }

  function displayGeneratedPassword(password, containerId) {
    const container = document.getElementById(containerId);
    container.classList.add('show');
    container.innerHTML = `
      <div class="generated-password-text">${password}</div>
      <button class="copy-btn" onclick="copyToClipboard('${password}')">Copy to Clipboard</button>
    `;
    
    // Also fill it in the check field
    if (pwdInput) {
      pwdInput.value = password;
      pwdInput.dispatchEvent(new Event('input'));
    }
  }
});

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Password copied to clipboard!');
  });
}
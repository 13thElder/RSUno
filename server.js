<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Secure Access</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .login-container {
            width: 100%;
            max-width: 420px;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
        }

        .logo-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 36px;
        }

        h1 {
            color: #ffffff;
            font-size: 28px;
            text-align: center;
            margin-bottom: 8px;
        }

        .subtitle {
            color: #a0a0a0;
            text-align: center;
            font-size: 14px;
            margin-bottom: 30px;
        }

        .form-group {
            margin-bottom: 20px;
            position: relative;
        }

        label {
            display: block;
            color: #b0b0b0;
            font-size: 13px;
            font-weight: 500;
            margin-bottom: 8px;
            text-transform: uppercase;
        }

        input {
            width: 100%;
            padding: 14px 16px 14px 45px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            color: #ffffff;
            font-size: 15px;
            transition: all 0.3s;
        }

        input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        /* Browser autofill support */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
            -webkit-text-fill-color: #ffffff;
            -webkit-box-shadow: 0 0 0px 1000px #1a1a2e inset;
        }

        .input-icon {
            position: absolute;
            left: 16px;
            top: 38px;
            font-size: 18px;
            opacity: 0.5;
        }

        .toggle-password {
            position: absolute;
            right: 16px;
            top: 38px;
            background: none;
            border: none;
            color: #667eea;
            cursor: pointer;
            font-size: 14px;
        }

        .remember-forgot {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
        }

        .checkbox-wrapper {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #b0b0b0;
            font-size: 14px;
        }

        .forgot-link {
            color: #667eea;
            text-decoration: none;
            font-size: 14px;
        }

        .submit-btn {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 12px;
            color: #ffffff;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }

        .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }

        .divider {
            display: flex;
            align-items: center;
            margin: 25px 0;
            color: #666;
            font-size: 13px;
        }

        .divider::before,
        .divider::after {
            content: '';
            flex: 1;
            height: 1px;
            background: rgba(255, 255, 255, 0.1);
        }

        .divider span {
            padding: 0 15px;
        }

        .social-login {
            display: flex;
            gap: 12px;
            margin-bottom: 25px;
        }

        .social-btn {
            flex: 1;
            padding: 12px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            color: #ffffff;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .social-btn:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        .signup-link {
            text-align: center;
            color: #a0a0a0;
            font-size: 14px;
        }

        .signup-link a {
            color: #667eea;
            text-decoration: none;
        }

        .error-message {
            color: #ff4444;
            font-size: 12px;
            margin-top: 6px;
        }

        .success-icon {
            position: absolute;
            right: 45px;
            top: 38px;
            color: #00c851;
            opacity: 0;
            transition: opacity 0.2s;
        }

        .form-group.success .success-icon {
            opacity: 1;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="logo-icon">🔐</div>
        <h1>Welcome Back</h1>
        <p class="subtitle">Sign in to access your account</p>

        <form id="loginForm" autocomplete="on">
            <!-- Username with autocomplete -->
            <div class="form-group">
                <label for="username">Username</label>
                <span class="input-icon">👤</span>
                <input 
                    type="text" 
                    id="username" 
                    name="username"
                    placeholder="Enter your username"
                    autocomplete="username"
                    required
                >
                <span class="success-icon">✓</span>
                <div class="error-message" id="usernameError"></div>
            </div>

            <!-- Email with autocomplete -->
            <div class="form-group">
                <label for="email">Email Address</label>
                <span class="input-icon">✉️</span>
                <input 
                    type="email" 
                    id="email" 
                    name="email"
                    placeholder="your@email.com"
                    autocomplete="email"
                    required
                >
                <span class="success-icon">✓</span>
                <div class="error-message" id="emailError"></div>
            </div>

            <!-- Password with autocomplete -->
            <div class="form-group">
                <label for="password">Password</label>
                <span class="input-icon">🔑</span>
                <input 
                    type="password" 
                    id="password" 
                    name="password"
                    placeholder="Enter your password"
                    autocomplete="current-password"
                    required
                >
                <button type="button" class="toggle-password" onclick="togglePassword()">👁</button>
                <span class="success-icon">✓</span>
                <div class="error-message" id="passwordError"></div>
            </div>

            <div class="remember-forgot">
                <div class="checkbox-wrapper">
                    <input type="checkbox" id="remember" name="remember">
                    <label for="remember">Remember me</label>
                </div>
                <a href="#" class="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" class="submit-btn">Sign In</button>
        </form>

        <div class="divider"><span>or continue with</span></div>

        <div class="social-login">
            <button class="social-btn">🔍 Google</button>
            <button class="social-btn">🐙 GitHub</button>
        </div>

        <p class="signup-link">
            Don't have an account? <a href="#">Sign up</a>
        </p>
    </div>

    <script>
        const form = document.getElementById('loginForm');
        const password = document.getElementById('password');

        // Toggle password visibility
        function togglePassword() {
            password.type = password.type === 'password' ? 'text' : 'password';
        }

        // Form validation
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const pass = password.value;

            // Simple validation
            if (username.length < 3) {
                document.getElementById('usernameError').textContent = 'Username too short';
                return;
            }
            if (!email.includes('@')) {
                document.getElementById('emailError').textContent = 'Invalid email';
                return;
            }
            if (pass.length < 6) {
                document.getElementById('passwordError').textContent = 'Password too short';
                return;
            }

            // Success - show data (in real app, send to server)
            alert('Login successful!\\n\\nUsername: ' + username + '\\nEmail: ' + email);
        });

        // Clear errors on input
        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', function() {
                this.parentElement.classList.add('success');
                this.parentElement.querySelector('.error-message').textContent = '';
            });
        });
    </script>
</body>
</html>

<template>
    <div class="signup-container">
      <div class="signup-content">
        <h1>Registrazione</h1>
        
        <form @submit.prevent="handleSignup" class="signup-form">
          <div class="form-group">
            <label for="email">Email:</label>
            <input
              type="email"
              id="email"
              v-model="email"
              required
            />
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input
              type="password"
              id="password"
              v-model="password"
              required
            />
          </div>
          <div class="form-group">
            <label for="confirmPassword">Conferma Password:</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="confirmPassword"
              required
            />
          </div>
          <button type="submit">Registrati</button>
          <p v-if="error" class="error">{{ error }}</p>
        </form>
        
        <p class="login-suggestion">
          Hai già un account? <a href="/login">Accedi qui</a>
        </p>
      </div>
    </div>
  </template>
  
  <script>
  import { useAuthStore } from '@/store/AuthStore';
import { ref } from 'vue';
  
  export default {
    name: 'SignupView',
    setup() {
      const email = ref('');
      const password = ref('');
      const confirmPassword = ref('');
      const error = ref('');
      const authStore = useAuthStore();
  
      const handleSignup = async () => {
        if (password.value !== confirmPassword.value) {
          error.value = 'Le password non corrispondono. Per favore, riprova.';
          return;
        }
  
        try {
          await authStore.signup(email.value, password.value);
          // Redirect or notify user of successful registration
        } catch (err) {
          error.value = 'Errore durante la registrazione. Per favore, riprova.';
        }
      };
  
      return {
        email,
        password,
        confirmPassword,
        error,
        handleSignup
      };
    }
  };
  </script>
  
  <style scoped>
  html, body {
    height: 100%;
    margin: 0;
    font-family: Arial, sans-serif;
  }
  
  .signup-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; /* Full viewport height */
    padding: 20px;
    background-color: #f4f4f4; /* Light background color */
  }
  
  .signup-content {
    max-width: 400px;
    width: 100%;
    text-align: center; /* Center text and form */
  }
  
  h1 {
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
  }
  
  input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  button {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  .error {
    color: red;
    margin-top: 10px;
  }
  
  .login-suggestion {
    margin-top: 20px;
  }
  
  .login-suggestion a {
    color: #007bff;
    text-decoration: none;
  }
  
  .login-suggestion a:hover {
    text-decoration: underline;
  }
  </style>
  
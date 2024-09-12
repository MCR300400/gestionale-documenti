<template>
  <div class="login-container">
    <div class="login-content">
      <h1>Login</h1>
      
      <form @submit.prevent="handleLogin" class="login-form">
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
        <button type="submit">Login</button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
      

    </div>
  </div>
</template>


<script>
import { useAuthStore } from '@/store/AuthStore';
import { ref } from 'vue';

export default {
  name: 'LoginView',
  setup() {
    const email = ref('');
    const password = ref('');
    const error = ref('');

    const authStore = useAuthStore();

    const handleLogin = async () => {
      try {
        await authStore.login(email.value, password.value);
        // Redirect or notify user of successful login
      } catch (err) {
        error.value = 'Invalid credentials. Please try again.';
      }
    };

    return {
      email,
      password,
      error,
      handleLogin
    };
  }
};
</script>

<style scoped>
html, body {

  margin: 0;
  font-family: Arial, sans-serif;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10%;


}

.login-content {
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

.signup-suggestion {
  margin-top: 20px;
}

.signup-suggestion a {
  color: #007bff;
  text-decoration: none;
}

.signup-suggestion a:hover {
  text-decoration: underline;
}
</style>

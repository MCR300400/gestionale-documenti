import { usePopupStore } from '@/store/PopupStore'; // Importa il popup store
import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const isAuthenticated = ref(false);
  const isAdmin = ref(false);
  const token = ref(localStorage.getItem('authToken') || null);
  const admin = ref(localStorage.getItem('token-admin') || null);
  const router = useRouter();
  const popupStore = usePopupStore(); // Usa il popup store

  const checkAuthStatus = () => {
    if (token.value) {
      isAuthenticated.value = true;
    }
    if (admin.value) {
      isAdmin.value = true;
    }
  };
     

  // Funzione per effettuare la registrazione
  const signup = async (email, password) => {
    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        popupStore.showPopup('Registrazione fallita: ' + errorMessage, '#F44336', '#fff'); // Rosso per errore
        throw new Error(errorMessage);
      }

      popupStore.showPopup('Registrazione riuscita', '#4CAF50', '#fff'); // Verde per successo
      await login(email, password); // Esegue il login dopo la registrazione
    } catch (error) {
      console.error('Signup error:', error);
      popupStore.showPopup(error.message, '#F44336', '#fff'); // Rosso per errore
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      // Verifica se l'header `Authorization` è presente
      if (response.headers.authorization) {
        // Salva il token JWT e il nome utente in localStorage
        localStorage.setItem('authToken', response.headers.authorization);
        localStorage.setItem('username', response.data.username);
        


        // Aggiorna lo stato dell'utente
        user.value = { email: response.data }; // Imposta l'utente con il nome utente
        isAuthenticated.value = true;
        token.value = response.headers.authorization;
        
        // Reindirizza in base al ruolo
        if (response.data.role === "admin") {
          localStorage.setItem('token-admin', "token-admin");
          router.push('/admin');
          isAdmin.value = true;
        } else {
          isAdmin.value = false;
          router.push('/home'); // O altre rotte basate sul ruolo se necessario
        }

        popupStore.showPopup('Login riuscito', '#4CAF50', '#fff'); // Verde per successo
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      popupStore.showPopup('Login fallito: ' + error.message, '#F44336', '#fff'); // Rosso per errore
      throw error;
    }
  };

  // Funzione per effettuare il logout
  const logout = () => {
    user.value = null;
    isAuthenticated.value = false;
    isAdmin.value = false;
    token.value = null;
    localStorage.removeItem('cartItems');
    localStorage.removeItem('authToken');
    localStorage.removeItem('token-admin'); // Rimuove anche token-admin al logout
    popupStore.showPopup('Logout riuscito', '#4CAF50', '#fff'); // Verde con testo bianco
    router.push('/');
  };

  return {
    user,
    isAuthenticated,
    isAdmin,
    token,
    signup,
    login,
    logout,
    checkAuthStatus
  };
});

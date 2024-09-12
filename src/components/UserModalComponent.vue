<template>
    <div class="modal-overlay">
      <div class="modal-content">
        <header class="modal-header">
          <h2>{{ mode === 'create' ? 'Aggiungi Utente' : 'Modifica Utente' }}</h2>
          <button @click="close" class="close-button">&times;</button>
        </header>
        <form @submit.prevent="save" class="modal-form">
          <label>
            Email:
            <input type="email" v-model="localUser.email" required class="form-input" />
          </label>
          <label>
            Password:
            <input v-model="localUser.password" class="form-input" />
          </label>
          <label>
            Ruolo:
            <select v-model="localUser.role" class="form-select">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <div class="button-group">
            <button type="submit" class="save-button">Salva</button>
            <button type="button" @click="close" class="cancel-button">Annulla</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, watch } from 'vue';
  
  export default {
    props: {
      mode: {
        type: String,
        required: true
      },
      user: {
        type: Object,
        default: () => ({})
      }
    },
    emits: ['close', 'save'],
    setup(props, { emit }) {
      const localUser = ref({ ...props.user });
  
      watch(() => props.user, (newUser) => {
        localUser.value = { ...newUser };
      }, { immediate: true });
  
      const close = () => {
        emit('close');
      };
  
      const save = () => {
        emit('save', localUser.value);
      };
  
      return {
        localUser,
        close,
        save
      };
    }
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    width: 450px;
    max-width: 90%;
    position: relative;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .modal-header h2 {
    margin: 0;
    font-size: 18px;
    color: #333;
  }
  
  .close-button {
    background: none;
    border: none;
    font-size: 24px;
    color: #888;
    cursor: pointer;
  }
  
  .modal-form label {
    display: block;
    margin-bottom: 15px;
  }
  
  .form-input, .form-select {
    width: 95%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .button-group {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  
  .save-button, .cancel-button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }
  
  .save-button {
    background-color: #3498db;
    color: #fff;
  }
  
  .cancel-button {
    background-color: #e74c3c;
    color: #fff;
  }
  
  .cancel-button:hover {
    background-color: #c0392b;
  }
  
  .save-button:hover {
    background-color: #2980b9;
  }
  </style>
  
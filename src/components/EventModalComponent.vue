<template>
    <div class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h2>{{ mode === 'create' ? 'Crea Evento' : 'Modifica Evento' }}</h2>
  
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="name">Nome Evento</label>
            <input type="text" id="name" v-model="localEvent.nome" required />
          </div>
  
          <div class="form-group">
            <label for="data">Data Evento</label>
            <input type="string" id="string" v-model="localEvent.data" required />
          </div>
  
          <div class="form-group">
            <label for="descrizione">Descrizione</label>
            <input type="string" id="descrizione" v-model="localEvent.descrizione" required />
          </div>
  
          <div class="modal-actions">
            <button type="submit" class="save-button">{{ mode === 'create' ? 'Crea' : 'Salva Modifiche' }}</button>
            <button type="button" @click="closeModal" class="cancel-button">Annulla</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { computed, ref, watch } from 'vue';
  
  export default {
    name: 'EventModalComponent',
    props: {
      mode: {
        type: String,
        required: true,
      },
      event: {
        type: Object,
        default: () => ({}),
      },
    },
    emits: ['close', 'save'],
    setup(props, { emit }) {
      // Crea una copia locale dell'evento
      const localEvent = ref({
        nome: '',
        data: '',
        prezzo: 0,
        id: '',
      });
  
      // Computed property to handle date formatting
      const formattedDate = computed({
        get() {
          // Convert date to yyyy-mm-dd format
          const date = new Date(localEvent.value.data);
          return date.toISOString().split('T')[0];
        },
        set(value) {
          localEvent.value.data = value;
        }
      });
  
      // Sincronizza la copia locale con il prop quando cambia
      watch(
        () => props.event,
        (newEvent) => {
          // Debug: Controlla i dati del nuovo evento
          console.log('Received New Event:', newEvent);
          
          // Aggiorna solo se i dati sono cambiati
          localEvent.value = {
            nome: newEvent.nome || '',
            data: newEvent.data || '',
            descrizione: newEvent.descrizione || '',
            id: newEvent.id || '',
          };
  
          // Debug: Controlla i dati aggiornati
          console.log('Updated Local Event:', localEvent.value);
        },
        { immediate: true }
      );
  
      const closeModal = () => {
        emit('close');
      };
  
      const submitForm = () => {
        emit('save', localEvent.value);
      };
  
      return {
        localEvent,
        formattedDate,
        closeModal,
        submitForm,
      };
    },
  };
  </script>
  

  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    max-width: 500px;
    width: 100%;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  .form-group input {
    width: 100%;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
  
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
  
  .save-button {
    background-color: #2ecc71;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 10px;
  }
  
  .cancel-button {
    background-color: #e74c3c;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>
  
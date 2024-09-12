<template>
  <div class="eventi-azienda">
    <h1>Eventi Aziendali</h1>



    <!-- Lista degli Eventi -->
    <div class="event-list">
      <h2>Eventi Programmati</h2>
      <div v-if="filteredEvents.length === 0" class="no-events">
        <p>Nessun evento programmato.</p>
      </div>
      <div v-else>
        <div v-for="event in filteredEvents" :key="event.id" class="event-card">
          <h3>{{ event.nome }}</h3>
          <p> {{ event.data }}</p>
          <p>{{ event.descrizione }}</p>
        </div>
      </div>
    </div>

    <!-- Form per Modificare Evento -->
    <div v-if="showEditEventForm" class="form-container">
      <h2>Modifica Evento</h2>
      <form @submit.prevent="updateEvent">
        <label for="edit-title">Titolo:</label>
        <input type="text" id="edit-title" v-model="currentEvent.title" required />

        <label for="edit-date">Data:</label>
        <input type="date" id="edit-date" v-model="currentEvent.date" required />

        <label for="edit-description">Descrizione:</label>
        <textarea id="edit-description" v-model="currentEvent.description" required></textarea>

        <button type="submit">Salva Modifiche</button>
        <button type="button" @click="showEditEventForm = false">Annulla</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useAdminStore } from '@/store/AdminStore';
import { computed, onMounted, ref } from 'vue';

// Ottieni lo store
const adminStore = useAdminStore();
const showEditEventForm = ref(false);
const currentEvent = ref({ id: '', title: '', date: '', description: '' });

// Funzione per formattare la data
// Funzione per formattare la data



// Funzione per aggiornare un evento
const updateEvent = async () => {
  await adminStore.updateEvent(currentEvent.value);
  showEditEventForm.value = false;
};

// Carica gli eventi dal server quando il componente è montato
onMounted(async () => {
  await adminStore.loadEvents();
});

// Filtro per mostrare solo gli eventi caricati
const filteredEvents = computed(() => adminStore.products);
</script>


  
  <style scoped>
  .eventi-azienda {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;

  }
  
  h1 {
    font-size: 2em;
    margin-bottom: 20px;
    color: #000; /* Titolo in nero */
  }
  
  .actions {
    margin-bottom: 20px;
  }
  
  button {
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    color: #fff;
    background-color: #007bff;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  .form-container {
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  form label {
    display: block;
    margin-top: 10px;
    font-weight: bold;
  }
  
  input, textarea {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    border: 1px solid;
    border-radius: 4px;
  }
  
  textarea {
    height: 100px;
  }
  
  .event-list {
    margin-top: 20px;
  }
  
  .event-card {


    padding: 15px;
    margin-bottom: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }
  
  .event-card h3 {
    margin: 0;
    font-size: 1.2em;
  }
  
  .event-card p {
    margin: 5px 0;
  }
  
  .no-events {
    text-align: center;
    color: #666;
  }
  </style>
  
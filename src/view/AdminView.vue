<template>
  <div class="admin-container">
    <header class="admin-header">
      <h1>Dashboard Amministratore</h1>
      <button @click="logout" class="logout-button">Logout</button>
    </header>

    <!-- Navigazione tra sezioni -->
    <nav class="section-navigation">
      <button @click="currentSection = 'users'" :class="{ active: currentSection === 'users' }">Gestione Utenti</button>
      <button @click="currentSection = 'events'" :class="{ active: currentSection === 'events' }">Gestione Eventi</button>
      <button @click="currentSection = 'interviews'" :class="{ active: currentSection === 'interviews' }">Gestione Colloqui</button>
    </nav>

    <main class="admin-content">
      <!-- Sezione Gestione Utenti -->
      <section v-if="currentSection === 'users'" class="user-management">
        <h2>Gestione Utenti</h2>
        <div class="search-bar">
          <input type="text" v-model="userSearchQuery" placeholder="Cerca utenti per nome o email" class="search-input" />
          <button @click="openUserModal('create')" class="action-button">Aggiungi Utente</button>
        </div>
        <ul class="user-list">
          <li v-for="user in filteredUsers" :key="user.email" class="user-item">
            <div class="user-details">
              <strong>Nome:</strong> {{ user.name }}<br />
              <strong>Email:</strong> {{ user.email }}<br />
              <strong>Ruolo:</strong> {{ user.role }}<br />
            </div>
            <div class="user-actions">
              <button @click="openUserModal('edit', user)" class="action-button-modifica">Modifica</button>
              <button @click="deleteUser(user.email)" class="action-button danger">Elimina</button>
            </div>
          </li>
        </ul>
      </section>

      <!-- Sezione Gestione Eventi -->
      <section v-if="currentSection === 'events'" class="event-management">
        <h2>Gestione Eventi</h2>
        <div class="search-bar">
          <input type="text" v-model="eventSearchQuery" placeholder="Cerca eventi per nome o data" class="search-input" />
          <button @click="openEventModal('create')" class="action-button">Aggiungi Evento</button>
        </div>
        <ul class="event-list">
          <li v-for="event in filteredEvents" :key="event.id" class="event-item">
            <div class="event-details">
              <strong>Nome:</strong> {{ event.nome }}<br />
              <strong>Data:</strong> {{ event.data }}<br />
              <strong>Descrizione:</strong> {{ event.descrizione }}<br />
            </div>
            <div class="event-actions">
              <button @click="openEventModal('edit', event)" class="action-button-modifica">Modifica</button>
              <button @click="deleteEvent(event.id)" class="action-button danger">Elimina</button>
            </div>
          </li>
        </ul>
      </section>

      <!-- Sezione Gestione Colloqui -->
      <section v-if="currentSection === 'interviews'" class="interview-management">
        <h2>Gestione Colloqui</h2>
        <div class="search-bar">
          <input type="text" v-model="interviewSearchQuery" placeholder="Cerca colloqui per nome o data" class="search-input" />
          <button @click="openInterviewModal('create')" class="action-button">Aggiungi Colloquio</button>
        </div>
        <ul class="interview-list">
          <li v-for="interview in filteredInterviews" :key="interview.id" class="interview-item">
            <div class="interview-details">
              <strong>Creatore:</strong> {{ interview.creatore }}<br />
              <strong>Data Inizio:</strong> {{ formatDate(interview.dataInizio) }}<br />
              <strong>Data Fine:</strong> {{ formatDate(interview.dataFine) }}<br />
              <strong>Richiedente:</strong> {{ interview.richiedente }}<br />
            </div>
            <div class="interview-actions">
              <button @click="openInterviewModal('edit', interview)" class="action-button-modifica">Modifica</button>
              <button @click="deleteInterview(interview.id)" class="action-button danger">Elimina</button>
            </div>
          </li>
        </ul>
      </section>
    </main>

    <!-- Modal per Utenti -->
    <UserModalComponent v-if="isUserModalOpen" :mode="modalMode" :user="currentUser" @close="closeUserModal" @save="saveUser" />

    <!-- Modal per Eventi -->
    <EventModalComponent
      v-if="isEventModalOpen"
      :mode="modalMode"
      :event="currentEvent"
      @close="closeEventModal"
      @save="saveEvent"
    />

    <!-- Modal per Colloqui -->
    <InterviewModalComponent
      v-if="isInterviewModalOpen"
      :mode="modalMode"
      :interview="currentInterview"
      @close="closeInterviewModal"
      @save="saveInterview"
    />
  </div>
</template>

<script>
import EventModalComponent from '@/components/EventModalComponent.vue';
import InterviewModalComponent from '@/components/InterviewModalComponent.vue'; // Assicurati di avere questo componente
import UserModalComponent from '@/components/UserModalComponent.vue';
import { useAdminStore } from '@/store/AdminStore';
import { useAuthStore } from '@/store/AuthStore';
import { computed, onMounted, ref } from 'vue';

export default {
  name: 'AdminView',
  components: {
    UserModalComponent,
    EventModalComponent,
    InterviewModalComponent // Assicurati di avere questo componente
  },
  setup() {
    const adminStore = useAdminStore();
    const userSearchQuery = ref('');
    const eventSearchQuery = ref('');
    const interviewSearchQuery = ref('');
    const isUserModalOpen = ref(false);
    const isEventModalOpen = ref(false);
    const isInterviewModalOpen = ref(false);
    const modalMode = ref(''); // 'create' o 'edit'
    const currentUser = ref(null);
    const currentEvent = ref(null);
    const currentInterview = ref(null);

    const authStore = useAuthStore();
    const currentSection = ref('users'); // Stato per gestire la sezione attiva

    // Carica utenti, eventi e colloqui al montaggio del componente
    onMounted(() => {
      adminStore.loadUsers();
      adminStore.loadEvents();
      adminStore.loadInterviews(); // Assicurati che questo metodo esista
    });

    const formatDate = (dataTime) => {
      if (!dataTime) return '';
      return dataTime.replace('T', ' ')
    };

    // Filtra utenti
    const filteredUsers = computed(() =>
      adminStore.searchUsers(userSearchQuery.value).filter((user) => user.role !== 'admin')
    );

    // Filtra eventi
    const filteredEvents = computed(() =>
      adminStore.searchProducts(eventSearchQuery.value, '')
    );

    // Filtra colloqui
    const filteredInterviews = computed(() =>
      adminStore.searchInterviews(interviewSearchQuery.value) // Assicurati che questo metodo esista
    );

    // Funzioni di gestione utenti
    const logout = () => {
      authStore.logout();
    };

    const openUserModal = (mode, user = null) => {
      modalMode.value = mode;
      currentUser.value = user;
      isUserModalOpen.value = true;
    };

    const closeUserModal = () => {
      isUserModalOpen.value = false;
      currentUser.value = null;
    };

    const saveUser = (user) => {
      if (modalMode.value === 'create') {
        adminStore.createUser(user);
      } else if (modalMode.value === 'edit') {
        adminStore.updateUser(user);
      }
      closeUserModal();
    };

    const deleteUser = (email) => {
      adminStore.deleteUser(email);
    };

    // Funzioni di gestione eventi
    const openEventModal = (mode, event = null) => {
      modalMode.value = mode;
      currentEvent.value = event ? { ...event } : { nome: '', data: '', descrizione: '', id: '' }; // Pre-popola solo se è presente un evento
      isEventModalOpen.value = true;
    };

    const closeEventModal = () => {
      isEventModalOpen.value = false;
      currentEvent.value = null;
    };

    const saveEvent = (event) => {
      if (modalMode.value === 'create') {
        adminStore.createEvent(event);
      } else if (modalMode.value === 'edit') {
        adminStore.updateEvent(event);
      }
      closeEventModal();
    };

    const deleteEvent = (id) => {
      adminStore.deleteEvent(id);
    };

    // Funzioni di gestione colloqui
    const openInterviewModal = (mode, interview = null) => {
      modalMode.value = mode;
      console.log(interview)
      currentInterview.value = interview ? { ...interview } : { creatore: '', dataInizio: '', dataFine: '', id: '' , richiedente: '' }; // Pre-popola solo se è presente un colloquio
      isInterviewModalOpen.value = true;
    };

    const closeInterviewModal = () => {
      isInterviewModalOpen.value = false;
      currentInterview.value = null;
    };

    const saveInterview = (interview) => {
      if (modalMode.value === 'create') {
        adminStore.createInterview(interview);
      } else if (modalMode.value === 'edit') {
        adminStore.updateInterview(interview);
      }
      closeInterviewModal();
    };

    const deleteInterview = (id) => {
      adminStore.deleteInterview(id);
    };

    return {
      userSearchQuery,
      eventSearchQuery,
      interviewSearchQuery,
      filteredUsers,
      filteredEvents,
      filteredInterviews,
      logout,
      openUserModal,
      closeUserModal,
      saveUser,
      deleteUser,
      formatDate,
      openEventModal,
      closeEventModal,
      saveEvent,
      deleteEvent,
      openInterviewModal,
      closeInterviewModal,
      saveInterview,
      deleteInterview,
      isUserModalOpen,
      isEventModalOpen,
      isInterviewModalOpen,
      modalMode,
      currentUser,
      currentEvent,
      currentInterview,
      currentSection,
    };
  },
};
</script>

<style scoped>
.admin-container {
  font-family: Arial, sans-serif;
  padding: 20px;
  margin-top: 45px;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #ddd;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.admin-header h1 {
  margin: 0;
  font-size: 24px;
}

.section-navigation {
  display: flex;
  justify-content: center; /* Centra i bottoni orizzontalmente */
  align-items: center; /* Centra i bottoni verticalmente */
  gap: 10px;
  margin-bottom: 20px;

}


.section-navigation button {
  background-color: black;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 4px;
}

.section-navigation button.active {
  background-color: red;
}

.logout-button {
  border-radius: 4px;
  background-color: red;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
}

.admin-content {
  display: flex;
  flex-direction: column;
}

.user-management,
.event-management,
.interview-management {
  margin-bottom: 30px;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.search-input {
  flex: 1;
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.action-button-modifica {
  background-color: black;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 4px;
  margin-right: 5px;
  margin-bottom: 5px;
}

.action-button {
  background-color: green;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 4px;
  margin-right: 5px;
}

.action-button.danger {
  background-color: red;
}

.user-list,
.event-list,
.interview-list {
  list-style-type: none;
  padding: 0;
}

.user-item,
.event-item,
.interview-item {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}

.user-details,
.event-details,
.interview-details {
  flex: 1;
}

.user-actions,
.event-actions,
.interview-actions {
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
  }

  .search-input,
  .action-button {
    margin-bottom: 10px;
  }

  .user-item,
  .event-item,
  .interview-item {
    flex-direction: column;
  }
}
</style>

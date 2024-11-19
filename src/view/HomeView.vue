<template>

<header class="home-header">
      <h1>Dashboard Amministratore</h1>
      <button @click="logoutUser" class="logout-button">Logout</button>
    </header>


  <div class="home">
    <div class="card-container">
      <!-- Card 1: Download Documenti -->
      <div class="card" @click="goToPage('/download-documents')">
        <h2>Download Documents</h2>
        <p>View and download all available documents.</p>
      </div>

      <!-- Card 2: Upload Documenti -->
      <div class="card" @click="goToPage('/upload-documents')">
        <h2>Upload Documents</h2>
        <p>Upload new documents to the system.</p>
      </div>

      <!-- Card 3: Info Documenti -->
      <div class="card" @click="goToPage('/document-info')">
        <h2>Document Info</h2>
        <p>Get detailed information about documents.</p>
      </div>
    </div>

    <!-- Card 4: Prenota Colloquio -->
    <div class="large-card" @click="goToPage('/prenota-colloquio')">
      <h2>Book a Meeting</h2>
      <p>Schedule a meeting or appointment here.</p>
    </div>
    
    <!-- Card 5: Eventi Azienda -->
    <div class="large-card" @click="goToPage('/eventi-azienda')">
      <h2>Company Events</h2>
      <p>See all company event here.</p>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/store/AuthStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
// Funzione per reindirizzare a una pagina
const goToPage = (route) => {
  router.push(route);
};

const logoutUser = () => {
  authStore.logout();
}

</script>

<style scoped>

.logout-button {
  border-radius: 4px;
  background-color: red;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
}


.home-content {
  display: flex;
  flex-direction: column;
}

.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #ddd;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.home-header h1 {
  margin: 0;
  font-size: 24px;
}
.home {

  margin: 0 auto;
  padding: 20px;

}

.card-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.card {
  width: 30%;
  padding: 20px;
  border: 1px solid #ccc; /* Bordo grigio chiaro */
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Ombra leggera */
  background-color: #fff; /* Sfondo bianco per le card */
  color: #333; /* Testo grigio scuro */
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Ombra più scura al passaggio del mouse */
}



.large-card {
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #ccc; /* Bordo grigio chiaro */
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Ombra leggera */
  background-color: #fff; /* Sfondo bianco */
  color: #333; /* Testo grigio scuro */
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  text-align: center;
}

.large-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); /* Ombra più scura al passaggio del mouse */
}

h1 {
  font-size: 2em;
  margin-bottom: 20px;
  color: #000; /* Titolo in nero */
}

h2 {
  font-size: 1.5em;
  margin-bottom: 10px;
  color: #000; /* Sottotitoli in nero */
}

p {
  color: #666; /* Testo dei paragrafi in grigio scuro */
}
</style>

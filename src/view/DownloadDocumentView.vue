<template>
  <div class="download-documents">
    <h1>Scarica Documenti</h1>
    <p>Qui puoi visualizzare e scaricare documenti utili per l'azienda e i suoi dipendenti.</p>

    <div class="documents-section">
      <h2>Documenti Disponibili</h2>
      <ul>
        <li v-for="(doc, index) in documents" :key="index" class="document-item">
          <div class="document-details">
            <!-- Utilizza :href per costruire il link di download -->
            <a :href="doc.url" download :title="doc.name">{{ doc.name }}</a>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useDocumentStore } from '@/store/DocumentStore'; // Assicurati che il percorso sia corretto
import { onMounted, ref } from 'vue';

const documentStore = useDocumentStore();
const documents = ref([]);

// Funzione per caricare i documenti
const loadDocuments = async () => {
  await documentStore.fetchDocumentsDownload();
  documents.value = documentStore.documents;
  console.log(documents)
};

onMounted(() => {
  loadDocuments();
});
</script>


<style scoped>
.download-documents {
  margin: 0 auto;
  padding: 30px;
}

.documents-section {
  margin-top: 20px;
}

.document-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.document-icon {
  margin-right: 20px;
  display: flex;
  align-items: center;
}

.document-icon img {
  width: 40px;
  height: 40px;
}

.document-details {
  flex: 1;
}

.document-item a {
  font-weight: bold;
  color: #007bff;
  text-decoration: none;
  font-size: 18px;
}

.document-item a:hover {
  text-decoration: underline;
}

.document-description {
  margin-top: 5px;
  color: #555;
  font-size: 16px;
}
</style>

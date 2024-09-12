<template>
  <div>
    <h1>Upload Documents</h1>
    <p>Upload your documents here.</p>

    <!-- Contenitore flessibile per il drag-and-drop e la lista dei file -->
    <div class="upload-container">
      <!-- Sezione drag-and-drop -->
      <div 
        class="upload-section" 
        @dragover.prevent="handleDragOver"
        @drop.prevent="handleDrop"
        @dragleave="handleDragLeave"
        @click="triggerFileInput"
        :class="{ 'drag-over': isDragOver }"
      >
        <p>Drag and drop your files here or <span class="click-text">click here</span> to select</p>
        <input 
          type="file" 
          ref="fileInput"
          @change="handleFileUpload" 
          multiple
          hidden
        />
        <button @click="uploadDocuments" :disabled="!selectedFiles || selectedFiles.length === 0" class="upload-button">
          Upload
        </button>
        <p v-if="uploadStatus">{{ uploadStatus }}</p>
      </div>

      <!-- Lista dei file selezionati -->
      <div v-if="selectedFiles && selectedFiles.length > 0" class="file-list">
        <h2>Selected Files</h2>
        <ul>
          <li v-for="(file, index) in selectedFiles" :key="index">
            <span>{{ file.name }}</span>
            <button @click="removeFile(index)" class="remove-button">Remove</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useDocumentStore } from '../store/DocumentStore';

const documentStore = useDocumentStore();
const selectedFiles = ref([]);
const uploadStatus = ref('');
const isDragOver = ref(false);
const fileInput = ref(null); // Riferimento per l'input dei file

// Gestisci il file selezionato dal normale input
const handleFileUpload = (event) => {
  const files = Array.from(event.target.files);
  selectedFiles.value = [...selectedFiles.value, ...files];
  documentStore.setSelectedFiles(selectedFiles.value);
};

// Gestisci il file rilasciato nell'area di drop
const handleDrop = (event) => {
  const files = Array.from(event.dataTransfer.files);
  selectedFiles.value = [...selectedFiles.value, ...files];
  documentStore.setSelectedFiles(selectedFiles.value);
  isDragOver.value = false;
};

// Gestisci l'evento di dragover per visualizzare feedback visivo
const handleDragOver = () => {
  isDragOver.value = true;
};

// Reset l'area di drop quando il file viene rimosso dal dragover
const handleDragLeave = () => {
  isDragOver.value = false;
};

// Rimuovi un file dalla lista
const removeFile = (index) => {
  selectedFiles.value.splice(index, 1);
  documentStore.setSelectedFiles(selectedFiles.value);
};

// Carica i documenti
const uploadDocuments = async () => {
  try {
    await documentStore.uploadDocuments();
    uploadStatus.value = documentStore.uploadStatus;
  } catch (error) {
    uploadStatus.value = 'An error occurred during upload.';
    console.error('Upload error:', error);
  }
};

// Attiva il click sul campo file nascosto
const triggerFileInput = () => {
  fileInput.value.click(); // Simula il click sull'input nascosto
};
</script>



<style scoped>
/* Contenitore flessibile per due colonne */
.upload-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-top: 20px;
}

/* Sezione Drag-and-Drop */
.upload-section {
  flex: 1;
  border: 2px dashed #ccc;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
  min-width: 45%;
  border-radius: 10px;
  background-color: #f9f9f9;
  position: relative;
}

.upload-section.drag-over {
  background-color: #e0e0e0;
  border-color: #007bff;
}

.click-text {
  color: #007bff;
  font-weight: bold;
  cursor: pointer;
}

.upload-button {
  margin-top: 15px;
  padding: 10px 20px;
  border-radius: 5px;
  background-color: #28a745;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.upload-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.upload-button:hover {
  background-color: #218838;
}

input[type="file"] {
  display: none;
}

/* Lista dei file */
.file-list {
  flex: 1;
  margin-top: 20px;
  min-width: 45%;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;
}

.file-list ul {
  list-style: none;
  padding: 0;
}

.file-list li {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.file-list li:last-child {
  border-bottom: none;
}

.remove-button {
  background-color: #dc3545;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.remove-button:hover {
  background-color: #c82333;
}
</style>

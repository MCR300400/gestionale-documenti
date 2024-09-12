<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <header class="modal-header">
        <h2>{{ mode === 'create' ? 'Aggiungi Colloquio' : 'Modifica Colloquio' }}</h2>
        <button @click="close" class="close-button">X</button>
      </header>
      <main class="modal-body">
        <form @submit.prevent="handleSubmit">
          <!-- Creatore -->
          <div class="form-group">
            <label for="creatore">Creatore:</label>
            <input type="text" id="creatore" v-model="localInterview.creatore" required />
          </div>

          <!-- Data inizio -->
          <div class="form-group">
            <label for="data-inizio">Data Inizio:</label>
            <input type="datetime-local" id="data-inizio" v-model="localInterview.dataInizio" required />
          </div>

          <!-- Data fine -->
          <div class="form-group">
            <label for="data-fine">Data Fine:</label>
            <input type="datetime-local" id="data-fine" v-model="localInterview.dataFine" required />
          </div>

          <!-- Richiedente -->
          <div class="form-group">
            <label for="richiedente">Richiedente:</label>
            <input type="text" id="richiedente" v-model="localInterview.richiedente"  />
          </div>


          <!-- Azioni -->
          <div class="form-actions">
            <button type="submit" class="action-button">Salva</button>
            <button @click="close" type="button" class="action-button danger">Annulla</button>
          </div>
        </form>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InterviewModalComponent',
  props: {
    mode: {
      type: String,
      required: true // 'create' o 'edit'
    },
    interview: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      localInterview: { ...this.interview }
    };
  },
  watch: {
    interview(newInterview) {
      this.localInterview = { ...newInterview };
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    handleSubmit() {
      this.$emit('save', this.localInterview);
    }
  }
}
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
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;

  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
}

.modal-header h2 {
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.modal-body {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}



.form-group label {
  display: block;
  margin-bottom: 2px;
}

.form-group input,
.form-group textarea {
  width: 90%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.action-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 4px;
}

.action-button.danger {
  background-color: #e74c3c;
}

.action-button:focus,
.action-button:hover {
  opacity: 0.9;
}
</style>

<template>
  <div class="document-info">
    <h1>Informazioni sui Documenti</h1>
    <p>Trovate risposte alle domande frequenti sui requisiti e sui processi relativi ai documenti qui sotto.</p>
    
    <div class="faq-section">
      <h2>Domande Frequenti</h2>
      
      <div v-for="(faq, index) in faqs" :key="index" class="faq-item">
        <h3 @click="toggleAnswer(index)" class="faq-question">
          {{ faq.question }}
          <span :class="{'arrow-down': expandedIndex === index, 'arrow-up': expandedIndex !== index}"></span>
        </h3>
        <p v-if="expandedIndex === index" class="faq-answer">
          {{ faq.answer }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDocumentStore } from '@/store/DocumentStore';
import { onMounted, ref } from 'vue';

const documentStore = useDocumentStore();

const faqs = ref([]);
const expandedIndex = ref(null);

const toggleAnswer = (index) => {
  expandedIndex.value = expandedIndex.value === index ? null : index;
};

onMounted(async () => {
  await documentStore.fetchDocuments();
  faqs.value = documentStore.documents.map(doc => ({
    question: doc.nome,
    answer: doc.descrizione
  }));
});
</script>

<style scoped>
.document-info {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.faq-section {
  margin-top: 20px;
}

.faq-item {
  margin-bottom: 10px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.faq-question {
  
  cursor: pointer;
  font-weight: bold;
  position: relative;
}

.faq-answer {
  padding: 10px 0;
}

.arrow-down::after {
  content: '▼';
  position: absolute;
  right: 0;
}

.arrow-up::after {
  content: '▲';
  position: absolute;
  right: 0;
}
</style>

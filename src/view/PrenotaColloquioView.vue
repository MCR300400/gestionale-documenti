<template>
  <div class="prenota-colloquio">
    <h1>Prenota un Colloquio</h1>

    <!-- Selezione della Persona -->
    <div class="person-selection">
      <label for="person">Seleziona la Persona:</label>
      <select id="person" v-model="selectedPerson" @change="fetchAvailableDates">
        <!-- Opzione predefinita -->
        <option value="">NESSUNA PERSONA SELEZIONATA</option>
        <!-- Opzioni dinamiche per le persone -->
        <option v-for="person in people" :key="person.id" :value="person.name">
          {{ person.name }}
        </option>
      </select>
    </div>

    <!-- Navigazione Settimanale -->
    <div v-if="currentWeekDates.length > 0" class="calendar-nav">
      <button @click="prevWeek" :disabled="isFirstWeek" class="nav-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <span>{{ formattedWeekRange }}</span>
      <button @click="nextWeek" :disabled="isLastWeek" class="nav-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <!-- Calendario Settimanale -->
    <div class="calendar" v-if="currentWeekDates.length > 0">
      <div class="calendar-grid">
        <div v-for="date in currentWeekDates" :key="date.date" class="calendar-date">
          <span>{{ date.date }}</span>
          <div v-for="time in date.times" :key="time.time" :class="{
            'interview-green': !time.requestedBy ,
            'interview-red': time.requestedBy
          }">
            <div v-if="!time.requestedBy">
              <p>Creatore: {{ time.creator }}</p>
              <p>Orario Inizio: {{ time.time.split(' - ')[0] }}</p>
              <p>Orario Fine: {{ time.time.split(' - ')[1] }}</p>
              <button @click="bookDate(date.date, time.time, time.creator, time.id)">
                Prenota 
              </button>
            </div>

            <div v-else>
              <p>Creatore: {{ time.creator }}</p>
              <p v-if="time.requestedBy">Richiedente: {{ time.requestedBy }}</p>
              <p>Orario Inizio: {{ time.time.split(' - ')[0] }}</p>
              <p>Orario Fine: {{ time.time.split(' - ')[1] }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <p v-if="message" :class="{ error: errorMessage }">{{ message }}</p>
  </div>
</template>


<script setup>
import { useAdminStore } from '@/store/AdminStore'; // Importa lo store
import { addDays, endOfWeek, format, startOfWeek } from 'date-fns';
import { computed, onMounted, ref, watch } from 'vue';

// Inizializza lo store
const adminStore = useAdminStore();

// Variabili di stato
const people = ref([]);
const selectedPerson = ref(''); // Valore iniziale è una stringa vuota
const availableDates = ref({});
const message = ref('');
const errorMessage = ref(false);
const currentDate = ref(new Date());

// Metodi per gestire i colloqui dallo store
const loadInterviews = async () => {
  try {
    await adminStore.loadInterviews();
    populateCreators(); // Popola la lista dei creatori
  } catch (error) {
    console.error('Errore nel caricamento dei colloqui', error);
  }
};

const bookDate = async (date, time, creator, id) => {
  await adminStore.updateInterview({id: id, creatore: creator, richiedente: localStorage.getItem("username"), dataInizio: date + "T" + time.split(' - ')[0] , dataFine: date + "T" + time.split(' - ')[1] });
  await loadInterviews();
  populateAvailableDates();
};


// Popola le date disponibili dai colloqui caricati
const populateAvailableDates = () => {
  availableDates.value = {};

  // Se nessuna persona è selezionata, mostra tutte le interviste
  const filteredInterviews = selectedPerson.value
    ? adminStore.interviews.filter(interview => interview.creatore === selectedPerson.value)
    : adminStore.interviews; // Mostra tutte le interviste se non c'è una persona selezionata

  filteredInterviews.forEach(interview => {
    const interviewStartDate = new Date(interview.dataInizio);
    const interviewEndDate = new Date(interview.dataFine);

    // Controlla se le date di inizio e fine sono valide
    if (isNaN(interviewStartDate) || isNaN(interviewEndDate)) {
      console.error('Data non valida trovata:', interview.dataInizio, interview.dataFine);
      return; // Salta questo record se una delle date non è valida
    }

    // Format della data per uso nel calendario
    const formattedDate = format(interviewStartDate, 'yyyy-MM-dd');

    // Estrazione dell'ora dalla data di inizio e fine
    const startTime = format(interviewStartDate, 'HH:mm');
    const endTime = format(interviewEndDate, 'HH:mm');

    if (!availableDates.value[formattedDate]) {
      availableDates.value[formattedDate] = [];
    }

    // Aggiungi tutte le fasce orarie disponibili tra startTime e endTime
    availableDates.value[formattedDate].push({
      time: `${startTime} - ${endTime}`,
      requestedBy: interview.richiedente, // Aggiungi il creatore e lo stato della richiesta
      creator: interview.creatore,
      id: interview.id
    });
    console.log(`Aggiunta data: ${formattedDate}, orario: ${startTime} - ${endTime}, richiesto da: ${interview.richiedente}`);
  });
};

// Popola i creatori senza duplicati
const populateCreators = () => {
  const creatorSet = new Set(); // Utilizziamo un Set per evitare duplicati
  adminStore.interviews.forEach(interview => {
    if (interview.creatore) {
      creatorSet.add(interview.creatore);
    }
  });

  // Converti il Set in un array per usarlo nel v-for
  people.value = Array.from(creatorSet).map((creatore, index) => ({
    id: index + 1, // Creiamo un ID fittizio per evitare problemi nel v-for
    name: creatore
  }));
};

const fetchAvailableDates = async () => {
  // Nessuna persona selezionata
  errorMessage.value = false;
  message.value = '';

  if (adminStore.interviews.length === 0) {
    await loadInterviews();
  }

  // Filtra e popola le date disponibili
  populateAvailableDates();
};

// Genera le date della settimana corrente
const generateWeekDates = (startDate) => {
  const weekStart = startOfWeek(startDate, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => format(addDays(weekStart, i), 'yyyy-MM-dd'));
};

const currentWeekDates = computed(() => {
  return generateWeekDates(currentDate.value).map(date => ({
    date,
    times: availableDates.value[date] || []
  }));
});

const prevWeek = () => {
  currentDate.value = addDays(currentDate.value, -7);
};

const nextWeek = () => {
  currentDate.value = addDays(currentDate.value, 7);
};

const formattedWeekRange = computed(() => {
  const start = format(startOfWeek(currentDate.value, { weekStartsOn: 1 }), 'dd MMMM yyyy');
  const end = format(endOfWeek(currentDate.value, { weekStartsOn: 1 }), 'dd MMMM yyyy');
  return `${start} - ${end}`;
});

const isFirstWeek = computed(() => {
  return currentDate.value <= new Date();
});

const isLastWeek = computed(() => {
  const futureDate = addDays(new Date(), 28); // Limita a 4 settimane nel futuro
  return currentDate.value >= futureDate;
});



/*
// Metodo per prenotare un colloquio
const bookDate = (date, time) => {
  message.value = `Colloquio prenotato per il ${date} alle ${time}`;
  errorMessage.value = false;
  // Aggiungi logica per creare o aggiornare il colloquio
};



*/



watch(selectedPerson, fetchAvailableDates, { immediate: true });

onMounted(async () => {
  await loadInterviews();
});
</script>

<style scoped>
.prenota-colloquio {
  margin: 0 auto;
  padding: 20px;
}

.person-selection {
  margin-bottom: 20px;
}

.calendar-nav {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.nav-button {
  background-color: transparent;
  border: none;
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-button:disabled {
  cursor: not-allowed;
}

.nav-button svg {
  width: 24px;
  height: 24px;
  color: #000000; /* Colore delle frecce */
}

.nav-button:hover svg {
  color: #bbb8b8; /* Colore delle frecce al passaggio del mouse */
}

.calendar-nav span {
  font-size: 1.5em;
  margin: 0 20px;
}

.calendar {
  margin-top: 20px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.calendar-date {
  padding: 10px;
  height: 75vh;
  border-right: 1px solid;
  text-align: center;
}

.calendar-date span {
  font-size: 1.2em;
  border-bottom: 1px solid;
}

.calendar-grid>.calendar-date:first-child {
  border-left: 1px solid;
}

.calendar-date button {
  padding: 10px 20px;
  margin-bottom: 3px;
  border: none;
  border-top: 1px solid;
  border-bottom: 1px solid;
  border-radius: 4px;
  background-color: #ffffff;
  color: rgb(0, 0, 0);
  cursor: pointer;
}

.calendar-date button:hover {
  background-color: #0056b3;
}

/* Colori delle interviste */
.interview-green {
  border-top: 3px solid green;
  border-bottom: 3px solid green;
  border-radius: 6px;
  color: #155724;
  margin-top: 5px;
}

.interview-green button {
  background-color: rgba(0, 128, 0, 0.315);
  border-radius: 8px;
  border: 3px;
}

.interview-red {
  border-top: 3px solid red;
  border-bottom: 3px solid red;
  border-radius: 6px;
  color: #721c24;
  padding: 5px;
  margin-top: 5px;
}

p {
  font-weight: bold;
}

p.error {
  color: red;
}
</style>

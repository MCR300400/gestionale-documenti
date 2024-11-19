import { useAuthStore } from '@/store/AuthStore';
import { usePopupStore } from '@/store/PopupStore';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

export const useAdminStore = defineStore('admin', () => {
  const users = ref([]);
  const products = ref([]);
  const interviews = ref([]);

  const filters = ref({
    name: '',
    type: '',
    producer: '',
    price: 99999,
    availability: ''
  });

  const popupStore = usePopupStore();
  const authStore = useAuthStore();
  const router = useRouter();


  // Carica gli utenti dal server
  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/admin/users', {
        headers: {
          'Authorization': token // Invia il token nell'intestazione senza 'Bearer'
        }
      });
      if (!response.ok) {
        authStore.logout();
        router.push("/");
        throw new Error(`Failed to fetch users: ${response.statusText}`);

        
      }
      users.value = await response.json();
      console.log("users: " + users.value)

    } catch (error) {
      console.error('Error loading users:', error);
      popupStore.showPopup('Failed to load users.', '#ff4d4f', '#fff');  // Popup di fallimento
      throw error;
    }
  };

  // Carica i prodotti (eventi) dal server
  const loadEvents = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/event/load', {
        headers: {
          'Authorization': token // Invia il token nell'intestazione senza 'Bearer'
        }
      });
      if (!response.ok) {
        authStore.logout();
        router.push("/");
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(data)
      products.value = Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error loading events:', error);
      popupStore.showPopup('Failed to load events.', '#ff4d4f', '#fff');  // Popup di fallimento
      throw error;
    }
  };

  // Carica i colloqui dal server
  const loadInterviews = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/colloquio/load', {
        headers: {
          'Authorization': token
        }
      });
      if (!response.ok) {
        authStore.logout();
        router.push("/");
        popupStore.showPopup('Session expired.', '#ff4d4f', '#fff');
      }
      interviews.value = await response.json();
    } catch (error) {
      console.error('Error loading interviews:', error);
      popupStore.showPopup('Failed to load interviews.', '#ff4d4f', '#fff');
      throw error;
    }
  };
  

  // Imposta i filtri per i prodotti
  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters };
  };

  // Filtra i prodotti in base ai filtri impostati
  const filteredProducts = computed(() => {
    const { name, type, producer, price, availability } = filters.value;

    const allFiltersEmpty = [name, type, producer, availability].every(value => value === '') && (price === 99999 || price === '');

    if (allFiltersEmpty) {
      return products.value;
    }

    return products.value.filter(product => {
      const nameMatch = name === '' || product.nome.toLowerCase().includes(name.toLowerCase());
      const typeMatch = type === '' || product.tipologia.toLowerCase().includes(type.toLowerCase());
      const producerMatch = producer === '' || product.produttore.toLowerCase().includes(producer.toLowerCase());
      const priceMatch = price === 99999 || product.prezzo <= price;
      const availabilityMatch = availability === '' || product.disponibilita === availability;

      return nameMatch && typeMatch && producerMatch && priceMatch && availabilityMatch;
    });
  });

  // Cerca gli utenti in base al nome o alla email
  const searchUsers = (query) => {
    if (!query) return users.value;
    const lowerCaseQuery = query.toLowerCase();
    return users.value.filter(user => {
      const nameMatch = user.name ? user.name.toLowerCase().includes(lowerCaseQuery) : false;
      const emailMatch = user.email ? user.email.toLowerCase().includes(lowerCaseQuery) : false;
      return nameMatch || emailMatch;
    });
  };

  // Cerca i prodotti in base al nome, all'ID e alla disponibilità
  const searchProducts = (query, availability) => {
    const lowerCaseQuery = query ? query.toLowerCase() : '';
    return products.value.filter(product => {
      if (!product) {
        return false;
      }

      const idMatch = query === '' || product.id.toString().includes(lowerCaseQuery);
      const nameMatch = lowerCaseQuery === '' || product.nome.toLowerCase().includes(lowerCaseQuery);
      const availabilityMatch = availability === '' || product.disponibilita === availability;

      return (idMatch || nameMatch) && availabilityMatch;
    });
  };

  // Cerca i colloqui in base al nome o alla data
  const searchInterviews = (query) => {
    const lowerCaseQuery = query ? query.toLowerCase() : '';
    return interviews.value.filter(interview => {
      if (!interview) {
        return false;
      }

      const nameMatch = lowerCaseQuery === '' || interview.nome.toLowerCase().includes(lowerCaseQuery);
      const dateMatch = lowerCaseQuery === '' || interview.data.toLowerCase().includes(lowerCaseQuery);

      return nameMatch || dateMatch;
    });
  };

  // Crea un nuovo utente
  const createUser = async (user) => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch('/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify(user)
      });
      if (!response.ok) {
        authStore.logout();
        router.push("/");
        popupStore.showPopup('Session expired.', '#ff4d4f', '#fff');
      }
      await loadUsers();
      popupStore.showPopup('User created successfully!', '#52c41a', '#fff');  // Popup di successo
    } catch (error) {
      console.error('Error creating user:', error);
      popupStore.showPopup('Failed to create user.', '#ff4d4f', '#fff');  // Popup di fallimento
    }
  };

  // Modifica un utente esistente
  const updateUser = async (user) => {
    console.log(user)
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch('/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' ,'Authorization': token },
        body: JSON.stringify({id: user.id, email: user.email, password: user.password, role: user.role})
      });
      if (!response.ok) {
        authStore.logout();
        router.push("/");
        throw new Error(`Failed to update user: ${response.statusText}`);
      }
      await loadUsers(); // Ricarica gli utenti
      popupStore.showPopup('User updated successfully!', '#52c41a', '#fff');  // Popup di successo
    } catch (error) {
      console.error('Error updating user:', error);
      popupStore.showPopup('Failed to update user.', '#ff4d4f', '#fff');  // Popup di fallimento
    }
  };

  // Elimina un utente
  const deleteUser = async (email) => {
    try {
      const token = localStorage.getItem("authToken")
      console.log("email: " + email)
      const response = await fetch(`/admin/users/${email}`, {
        method: 'DELETE',
        headers: { 'Authorization': token },
      });
      if (!response.ok) {
        authStore.logout();
        router.push("/");
        throw new Error(`Failed to delete user: ${response.statusText}`);
      }
      await loadUsers(); // Ricarica gli utenti
      popupStore.showPopup('User deleted successfully!', '#52c41a', '#fff');  // Popup di successo
    } catch (error) {
      console.error('Error deleting user:', error);
      popupStore.showPopup('Failed to delete user.', '#ff4d4f', '#fff');  // Popup di fallimento
    }
  };

  // Crea un nuovo prodotto (evento)
  const createEvent = async (event) => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch('/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify(event)
      });
      if (!response.ok) {
        authStore.logout();
        router.push("/");
        throw new Error(`Failed to create event: ${response.statusText}`);
      }
      await loadEvents();
      popupStore.showPopup('Event created successfully!', '#52c41a', '#fff');  // Popup di successo
    } catch (error) {
      console.error('Error creating event:', error);
      popupStore.showPopup('Failed to create event.', '#ff4d4f', '#fff');  // Popup di fallimento
    }
  };

  // Modifica un prodotto (evento) esistente
  const updateEvent = async (event) => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch('/admin/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' ,'Authorization': token },
        body: JSON.stringify(event)
      });
      if (!response.ok) {
        authStore.logout();
        router.push("/");
        throw new Error(`Failed to update event: ${response.statusText}`);
      }
      await loadEvents();
      popupStore.showPopup('Event updated successfully!', '#52c41a', '#fff');  // Popup di successo
    } catch (error) {
      console.error('Error updating event:', error);
      popupStore.showPopup('Failed to update event.', '#ff4d4f', '#fff');  // Popup di fallimento
    }
  };



  // Elimina un prodotto (evento)
  const deleteEvent = async (id) => {
    try {
      const token = localStorage.getItem("authToken")
      console.log("id: " + id)
      const response = await fetch(`/admin/events/${id}`, {
        method: 'DELETE',
        headers: {'Authorization': token },
      });
      if (!response.ok) {
        authStore.logout();
        router.push("/");
        throw new Error(`Failed to delete event: ${response.statusText}`);
      }
      await loadEvents();
      popupStore.showPopup('Event deleted successfully!', '#52c41a', '#fff');  // Popup di successo
    } catch (error) {
      console.error('Error deleting event:', error);
      popupStore.showPopup('Failed to delete event.', '#ff4d4f', '#fff');  // Popup di fallimento
    }
  };


  // Crea un nuovo colloquio
  const createInterview = async (interview) => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch('/admin/colloquio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify(interview)
      });
      if (!response.ok) {
        authStore.logout();
        router.push("/");
        throw new Error(`Failed to create interview: ${response.statusText}`);
      }
      await loadInterviews();
      popupStore.showPopup('Interview created successfully!', '#52c41a', '#fff');  // Popup di successo
    } catch (error) {
      console.error('Error creating interview:', error);
      popupStore.showPopup('Failed to create interview.', '#ff4d4f', '#fff');  // Popup di fallimento
    }
  };

  // Modifica un colloquio esistente
  const updateInterview = async (interview) => {
    console.log(interview)
    try {
      
      const token = localStorage.getItem("authToken")
      const response = await fetch('/admin/colloquio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify(interview)
      });
      if (!response.ok) {
        authStore.logout();
        router.push("/");
        throw new Error(`Failed to update interview: ${response.statusText}`);
      }
      await loadInterviews();
      popupStore.showPopup('Interview updated successfully!', '#52c41a', '#fff');  // Popup di successo
    } catch (error) {
      console.error('Error updating interview:', error);
      popupStore.showPopup('Failed to update interview.', '#ff4d4f', '#fff');  // Popup di fallimento
    }
  };

  // Elimina un colloquio
  const deleteInterview = async (id) => {
    try {
      const token = localStorage.getItem("authToken")
      console.log("interview id: " + id)
      const response = await fetch(`/admin/colloquio/${id}`, {
        method: 'DELETE',
        headers: {'Authorization': token }
      });
      if (!response.ok) {
        authStore.logout();
        router.push("/");
        throw new Error(`Failed to delete interview: ${response.statusText}`);
      }
      await loadInterviews();
      popupStore.showPopup('Interview deleted successfully!', '#52c41a', '#fff');  // Popup di successo
    } catch (error) {
      console.error('Error deleting interview:', error);
      popupStore.showPopup('Failed to delete interview.', '#ff4d4f', '#fff');  // Popup di fallimento
    }
  };

  return {
    users,
    products,
    interviews,
    filters,
    loadUsers,
    loadEvents,
    loadInterviews,
    setFilters,
    filteredProducts,
    searchUsers,
    searchProducts,
    searchInterviews,
    createUser,
    updateUser,
    deleteUser,
    createEvent,
    updateEvent,
    deleteEvent,
    createInterview,
    updateInterview,
    deleteInterview
  };
});

import { usePopupStore } from '@/store/PopupStore'; // Importa il popup store
import axios from 'axios';
import { defineStore } from 'pinia';
import { useCartStore } from './cartStore';
export const useEmailStore = defineStore('emailStore', {
  state: () => ({
    successMessage: '',
    errorMessage: '',
    isSubmitting: false,
  }),
  actions: {
    async sendMessage(object, sender, body) {
      const popupStore = usePopupStore(); // Usa il popup store
      this.successMessage = '';
      this.errorMessage = '';
      this.isSubmitting = true;

      try {
        // Chiamata API al backend Java
        await axios.post('/api/email/send', {
          from: sender,
          object: object,
          body: body,
        });

        // Mostra il popup di successo
        popupStore.showPopup('Messaggio inviato con successo!', '#4CAF50', '#fff');
      } catch (error) {
        // Mostra il popup di errore
        popupStore.showPopup('Errore durante l\'invio del messaggio. Per favore, riprova.', '#f44336', '#fff');
      } finally {
        this.isSubmitting = false;
      }
    },

    async sendPostSell() {
      const customerName = localStorage.getItem("username");
      const templateId = "acquisto"
      const cartStore = useCartStore()
      console.log(customerName);
      const acquisti = [];
      const assistenza = [];
      const database = [];
      const grafica = [];
      const chiamate = [];
      const prezzo = [];
      const note = [];
      const contatti = [];
    
      cartStore.cartItems.forEach(cart => {
        console.log("name: ")
        console.log("name: " + cart.productName)
        // Aggiungi il nome del prodotto alla lista acquisti


        for (let i = 0; i < cart.quantity; i++) {
          acquisti.push(cart.productName);
    
        // Aggiungi l'assistenza se presente
        if (cart.postSalesSupport) {
          assistenza.push(cart.postSalesSupport);
        }
    
        // Aggiungi il database se presente
        if (cart.databaseManagement) {
          database.push(cart.databaseManagement);
        }

        
    
        // Aggiungi la grafica se presente
        if (cart.graphicDesign) {
          grafica.push(cart.graphicDesign);
        }

        prezzo.push(cart.price.toString());

        contatti.push(cart.contactInfo);
        note.push(cart.notes);
    
        // Aggiungi le chiamate se presenti
        chiamate.push(cart.thirdPartyCalls.toString());
          
        }
        
      })
    
      console.log("Acquisti:", acquisti);
      console.log("Assistenza:", assistenza);
      console.log("Database:", database);
      console.log("Grafica:", grafica);
      console.log("Chiamate:", chiamate);
      console.log("Prezzo:", prezzo);
      console.log("Contatti:", contatti);
      console.log("Note:", note);


    try {
        // Chiamata API al backend Java
        await axios.post('/api/email/postsell', {
          customerName: customerName,
          templateId: templateId,
          acquisti: acquisti,
          assistenza: assistenza,
          database: database,
          chiamate: chiamate,
          grafica: grafica,
          prezzo: prezzo,
          contatti: contatti,
          note: note,
        });
      } catch (error) {
        console.error(error)
      }
    },
    
  },
});

<template>
    <transition name="fade" @before-enter="beforeEnter" @enter="enter" @leave="leave">
      <div v-if="isVisible" :style="popupStyle" class="popup">
        <p class="popup-text">{{ message }}</p>
      </div>
    </transition>
  </template>
  
  <script>
  import { usePopupStore } from '@/store/PopupStore';
import { computed, ref, watch } from 'vue';
  
  export default {
    setup() {
      const popupStore = usePopupStore();
      const isVisible = ref(false);
      const message = ref('');
      const backgroundColor = computed(() => popupStore.backgroundColor || '#333');
      const textColor = computed(() => popupStore.textColor || '#fff');
  
      // Funzione per mostrare il popup
      const showPopup = (msg, bgColor, txtColor) => {
        message.value = msg;
        popupStore.backgroundColor = bgColor;
        popupStore.textColor = txtColor;
        isVisible.value = true;
  
        // Nascondi il popup dopo 3 secondi
        setTimeout(() => {
          isVisible.value = false;
        }, 3000);
      };
  
      // Reattivo alla modifica del popupStore
      watch(() => popupStore.message, (newMsg) => {
        if (newMsg) {
          showPopup(newMsg, popupStore.backgroundColor, popupStore.textColor);
        }
      });
  
      return {
        isVisible,
        message,
        popupStyle: computed(() => ({
          backgroundColor: backgroundColor.value,
          color: textColor.value,
        }))
      };
    },
    methods: {
      beforeEnter(el) {
        el.style.opacity = 0;
      },
      enter(el, done) {
        el.offsetHeight; // trigger reflow
        el.style.transition = 'opacity 1s';
        el.style.opacity = 1;
        done();
      },
      leave(el, done) {
        el.style.transition = 'opacity 1s';
        el.style.opacity = 0;
        done();
      }
    }
  };
  </script>
  
  <style scoped>
  .popup {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    z-index: 9999;
    max-width: 600px;
    width: auto;
    text-align: center;
    font-size: 22px; /* Aumenta la dimensione del testo */
    line-height: 2;
  }
  
  .popup-text {
    margin: 0;
    font-size: 18px; /* Aumenta la dimensione del testo */
  }
  
  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  </style>
  
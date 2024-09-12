import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePopupStore = defineStore('popup', () => {
  const message = ref('');
  const backgroundColor = ref('#333');
  const textColor = ref('#fff');

  const showPopup = (msg, bgColor = '#333', txtColor = '#fff') => {
    message.value = msg;
    backgroundColor.value = bgColor;
    textColor.value = txtColor;
  };

  return {
    message,
    backgroundColor,
    textColor,
    showPopup
  };
});

<template>
  <router-view></router-view>
  <PopupComponent />
</template>

<script>


import { onMounted } from 'vue';
import PopupComponent from "./components/PopupComponent.vue";
import { useAuthStore } from './store/AuthStore';

export default {
  name: 'App',
  components: {
    PopupComponent
  },
   setup() {
    const authStore = useAuthStore();
    onMounted(() => {
      authStore.checkAuthStatus();

    });
   } 
}




  
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

}
</style>

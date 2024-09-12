// src/router/index.js


import AdminView from '@/view/AdminView.vue';
import DocumentInfoView from '@/view/DocumentInfoView.vue';
import DownloadDocumentView from '@/view/DownloadDocumentView.vue';
import EventiAziendaView from '@/view/EventiAziendaView.vue';
import HomeView from '@/view/HomeView.vue';
import LoginView from '@/view/LoginView.vue';
import PrenotaColloquioView from '@/view/PrenotaColloquioView.vue';
import RegisterView from '@/view/RegisterView.vue';
import UploadDocumentView from '@/view/UploadDocumentView.vue';
import { createRouter, createWebHistory } from 'vue-router';
LoginView

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: HomeView,
    beforeEnter: (to, from, next) => {
      const tokenAdmin = localStorage.getItem('authToken');
      if (tokenAdmin) {
        next();
      } else {
        next('/'); // Se non c'è il token, reindirizza al home
      }
    }
  },
  {
    path: '/',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/download-documents',
    name: 'DownloadDocument',
    component: DownloadDocumentView,
    beforeEnter: (to, from, next) => {
      const tokenAdmin = localStorage.getItem('authToken');
      if (tokenAdmin) {
        next();
      } else {
        next('/'); // Se non c'è il token, reindirizza al home
      }
    }
  },
  {
    path: '/upload-documents',
    name: 'UploadDocument',
    component: UploadDocumentView,
    beforeEnter: (to, from, next) => {
      const tokenAdmin = localStorage.getItem('authToken');
      if (tokenAdmin) {
        next();
      } else {
        next('/'); // Se non c'è il token, reindirizza al home
      }
    }
  },
  {
    path: '/document-info',
    name: 'DocumentInfo',
    component: DocumentInfoView,
    beforeEnter: (to, from, next) => {
      const tokenAdmin = localStorage.getItem('authToken');
      if (tokenAdmin) {
        next();
      } else {
        next('/'); // Se non c'è il token, reindirizza al home
      }
    }
  },
  {
    path: '/prenota-colloquio',
    name: 'PrenotaColloquio',
    component: PrenotaColloquioView,
    beforeEnter: (to, from, next) => {
      const tokenAdmin = localStorage.getItem('authToken');
      if (tokenAdmin) {
        next();
      } else {
        next('/'); // Se non c'è il token, reindirizza al home
      }
    }
  },
  {
    path: '/eventi-azienda',
    name: 'EventiAzienda',
    component: EventiAziendaView,
    beforeEnter: (to, from, next) => {
      const tokenAdmin = localStorage.getItem('authToken');
      if (tokenAdmin) {
        next();
      } else {
        next('/'); // Se non c'è il token, reindirizza al home
      }
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    beforeEnter: (to, from, next) => {
      const tokenAdmin = localStorage.getItem('authToken');
      if (tokenAdmin) {
        next();
      } else {
        next('/'); // Se non c'è il token, reindirizza al home
      }
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    beforeEnter: (to, from, next) => {
      const tokenAdmin = localStorage.getItem('token-admin');
      if (tokenAdmin) {
        next();
      } else {
        next('/'); // Se non c'è il token, reindirizza al home
      }
    }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

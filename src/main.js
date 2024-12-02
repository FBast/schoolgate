import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import '@fortawesome/fontawesome-free/css/all.css';
import "vue-multiselect/dist/vue-multiselect.min.css";
import './styles/main.scss';
import i18n from "./utils/i18n.js";
import {createPinia} from "pinia";

// Create a new Vue application instance
const app = createApp(App);

// Initialize state management with Pinia
const pinia = createPinia();
app.use(pinia);

// Register the Vue Router
app.use(router);

// Register the i18n plugin for translations
app.use(i18n);

// Add global properties for debugging
app.config.globalProperties.$log = console.log; // Shortcut for console.log

// Mount the app to the DOM
app.mount('#app');
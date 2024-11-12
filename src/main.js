import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/main.scss';
import i18n from "./utils/i18n.js";

const app = createApp(App);

app.config.globalProperties.$log = console.log;
app.use(i18n);
app.use(router);
app.mount('#app');
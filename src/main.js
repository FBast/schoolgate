import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/main.scss';

const app = createApp(App);

app.config.globalProperties.$log = console.log;

app.use(router).mount('#app');
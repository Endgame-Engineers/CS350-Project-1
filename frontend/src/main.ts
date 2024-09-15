import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import the router
import './assets/global.css';
import './css/custom.css';

createApp(App)
  .use(router)
  .mount('#app');

function mount(arg0: string) {
    throw new Error('Function not implemented.');
}


import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; 
import './assets/scss/custom.scss';
import UserStatsPercentages from './components/UserStatsPercentages.vue';

// Font Awesome imports
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { dom } from '@fortawesome/fontawesome-svg-core';

library.add(fas, far, fab);
dom.watch();

createApp(App)
  .use(router)
  .component('font-awesome-icon', FontAwesomeIcon)
  .component('user-stats-percentages', UserStatsPercentages)
  .mount('#app');

function mount(arg0: string) {
    throw new Error('Function not implemented.');
}
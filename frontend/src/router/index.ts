import { createRouter, createWebHistory } from 'vue-router';
import home from '../views/Home.vue';
import search from '../views/Search.vue';
import diary from '../views/Diary.vue';
import history from '../views/History.vue';
import barscanner from '../views/BarScanner.vue';
import login from '../views/Login.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: home,
  },
  {
    path: '/Search',
    name: 'Search',
    component: search,
  },
  {
    path: '/History',
    name: 'History',
    component: history,
  },
  {
    path: '/Diary',
    name: 'Diary',
    component: diary,
  },
  {
    path: '/BarScanner',
    name: 'BarScanner',
    component: barscanner,
  },
  {
    path: '/Login',
    name: 'Login',
    component: login,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

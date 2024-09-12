import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/home.vue';
import search from '../views/search.vue';
import diary from '../views/diary.vue';
import history from '../views/history.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/search',
    name: 'Search',
    component: search,
  },
  {
    path: '/history',
    name: 'History',
    component: history,
  },
  {
    path: '/diary',
    name: 'Diary',
    component: diary,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

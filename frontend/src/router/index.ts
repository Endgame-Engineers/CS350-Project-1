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

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('user');

  // Debugging logs
  console.log('Navigating to:', to.path);
  console.log('Coming from:', from.path);
  console.log('Is authenticated:', isAuthenticated);

  if (to.path !== '/login' && !isAuthenticated) {
    console.log('Redirecting to /login');
    next('/login');
  } else {
    console.log('Proceeding to:', to.path);
    next();
  }
});

export default router;

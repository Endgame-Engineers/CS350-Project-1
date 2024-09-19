import { createRouter, createWebHistory } from 'vue-router';
import home from '../views/Home.vue';
import search from '../views/Search.vue';
import diary from '../views/Diary.vue';
import history from '../views/History.vue';
import barscanner from '../views/BarScanner.vue';
import login from '../views/Login.vue';
import Profile from '@/views/Profile.vue';

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
  },
  {
    path: '/Profile',
    name: 'Profile',
    component: Profile,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

let previousRoute: string | null = null;

router.beforeEach(async (to, from, next) => {
    if (from.path === '/' && to.path === '/login') {
      previousRoute = null;
    } else {
      previousRoute = typeof from.name === 'string' ? from.name : null;
    }
    console.log('Navigating from', from.fullPath, 'to', to.fullPath);

  const isAuthenticated = await fetch('/api/auth/google/success', { credentials: 'include' })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to authenticate');
      }
    })
    .then((data) => {
      console.log('Authentication status:', data.isAuthenticated);
      return data.isAuthenticated;
    })
    .catch((error) => {
      console.error('Error checking authentication status:', error);
      return false;
    });

  if (to.path !== '/login' && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export function hasPreviousRoute() {
  return previousRoute !== null;
}

export default router;

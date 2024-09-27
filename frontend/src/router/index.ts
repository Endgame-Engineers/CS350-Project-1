import { createRouter, createWebHistory } from 'vue-router';
import home from '../views/Home.vue';
import search from '../views/Search.vue';
import history from '../views/History.vue';
import barscanner from '../views/BarScanner.vue';
import login from '../views/Login.vue';
import Profile from '@/views/Profile.vue';
import welcomescreen from '@/views/WelcomeScreen.vue';
import { createPinia } from 'pinia';
import { useUserStore } from '@/stores/User';

const pinia = createPinia();
const userStore = useUserStore(pinia);


const routes = [
  {
    path: '/',
    name: 'Home',
    component: home,
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
    path: '/barscanner',
    name: 'BarScanner',
    component: barscanner,
  },
  {
    path: '/login',
    name: 'Login',
    component: login,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
  },
  {
    path: '/welcomescreen',
    name: 'WelcomeScreen',
    component: welcomescreen,
    beforeEnter: (to: any, from: any, next: any) => {
      const userStore = useUserStore();
      if (userStore.user.profilecreated) {
        next({ name: 'Home' }); 
      } else {
        next();
      }
    }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});


router.beforeEach(async (to, from, next) => {
  // Reset the userStore on route switch
  userStore.$reset();

  if (!userStore.isAuthenticated) {
    try {
      const response = await fetch('/api/auth/google/success', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        console.log('Authentication status:', data.isAuthenticated);
        userStore.setUser(data.user);
        userStore.setAuthenticated(data.isAuthenticated);
      } else {
        throw new Error('Failed to authenticate');
      }
    } catch (error) {
      console.error('Error checking authentication status:', error);
      userStore.setAuthenticated(false);
    }
  }

  if (userStore.isAuthenticated && userStore.user.profilecreated === false && to.path.toLocaleLowerCase() !== '/welcomescreen') {
    next({ path: '/welcomescreen', query: { redirect: to.fullPath } });
  } else if (to.path.toLocaleLowerCase() !== '/login' && !userStore.isAuthenticated) {
    next({ path: '/login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;

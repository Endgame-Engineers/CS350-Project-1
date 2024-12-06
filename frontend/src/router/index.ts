import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import { useUserStore } from '@/stores/User';

const pinia = createPinia();
const userStore = useUserStore(pinia);


const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import(/* webpackChunkName: "search" */ '../views/Search.vue'),

  },
  {
    path: '/history',
    name: 'History',
    component: () => import(/* webpackChunkName: "history" */ '../views/History.vue'),
  },
  {
    path: '/logs',
    name: 'UserLogs',
    component: () => import(/* webpackChunkName: "logs" */ '../views/Logs.vue'),
  },
  {
    path: '/barscanner',
    name: 'BarScanner',
    component: () => import(/* webpackChunkName: "barscanner" */ '../views/BarScanner.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "profile" */ '../views/Profile.vue'),
  },
  {
    path: '/welcomescreen',
    name: 'WelcomeScreen',
    component: () => import(/* webpackChunkName: "welcomescreen" */ '../views/WelcomeScreen.vue'),
    // eslint-disable-next-line
    beforeEnter: (to: any, from: any, next: any) => {
      const userStore = useUserStore();
      if (userStore.user.profilecreated) {
        next({ name: 'Home' }); 
      } else {
        next();
      }
    }
  },
  {
    path: '/recipe',
    name: 'CreateRecipe',
    component: () => import(/* webpackChunkName: "recipe" */ '../views/CreateRecipe.vue'),
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

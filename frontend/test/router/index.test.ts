// Carlos
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createWebHistory, Router } from 'vue-router';
import { render } from '@testing-library/vue';
import Home from '../../src/views/Home.vue';
import Login from '../../src/views/Login.vue';
import WelcomeScreen from '../../src/views/WelcomeScreen.vue';
import { useUserStore } from '../../src/stores/User';

// Mock the useUserStore
vi.mock('/../../src/stores/User', () => {
  return {
    useUserStore: vi.fn(() => ({
      isAuthenticated: false,
      user: { profilecreated: false },
      $reset: vi.fn(),
      setAuthenticated: vi.fn(),
      setUser: vi.fn(),
    })),
  };
});

describe('Router', () => {
  let userStore: ReturnType<typeof useUserStore>;
  let appRouter: Router;

  beforeEach(() => {
    setActivePinia(createPinia());
    userStore = useUserStore();
    appRouter = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/Home.vue', name: 'Home', component: Home },
        { path: '/login', name: 'Login', component: Login },
        { path: '/welcomescreen', name: 'WelcomeScreen', component: WelcomeScreen },
      ],
    });
  });

  it('should redirect to login if the user is not authenticated', async () => {
    userStore.isAuthenticated = false;

    appRouter.push('/');
    await appRouter.isReady();

    const { getByText } = render(Home, {
      global: { plugins: [appRouter] },
    });

    expect(appRouter.currentRoute.value.path).toBe('/login');
  });


  it('should allow navigation to Home if authenticated and profile is created', async () => {
    userStore.isAuthenticated = true;
    userStore.user.profilecreated = true;

    appRouter.push('/');
    await appRouter.isReady();

    const { getByText } = render(Home, {
      global: { plugins: [appRouter] },
    });

    expect(appRouter.currentRoute.value.path).toBe('/');
  });

  it('should navigate to WelcomeScreen when profile is not created', async () => {
    userStore.isAuthenticated = true;
    userStore.user.profilecreated = false;

    appRouter.push('/welcomescreen');
    await appRouter.isReady();

    const { getByText } = render(WelcomeScreen, {
      global: { plugins: [appRouter] },
    });

    expect(appRouter.currentRoute.value.path).toBe('/welcomescreen');
  });

  it('should redirect to login if accessing a private route without authentication', async () => {
    userStore.isAuthenticated = false;

    appRouter.push('/profile');
    await appRouter.isReady();

    expect(appRouter.currentRoute.value.path).toBe('/login');
  });
});

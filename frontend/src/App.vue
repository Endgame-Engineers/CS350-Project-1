<template>
  <header class="fixed-top bg-dark pt-3 ps-3 pe-3 pb-2">
    <div class="row">
      <div class="col text-start">
        <button v-if="$route.path.toLocaleLowerCase() !== '/login' && canGoBack" @click="goBack"
          class="btn btn-primary">
          <font-awesome-icon :icon="['fas', 'arrow-left']" />
        </button>
      </div>
      <div class="col-auto text-center">
        <a href="/" class="navbar-brand">
          <img src="@/assets/images/CarbioFit.svg" alt="Carbio.fit Logo" height="30">
        </a>
      </div>
      <div class="col text-end">
        <a v-if="$route.path.toLocaleLowerCase() !== '/login'" href="/api/auth/logout" class="btn btn-primary"
          role="button">
          <font-awesome-icon :icon="['fas', 'sign-out-alt']" />
        </a>
      </div>
    </div>
  </header>
  <main v-if="$route.path.toLocaleLowerCase() !== '/welcomescreen' && $route.path.toLocaleLowerCase() !== '/login'" class="container mt-4 pt-5 pb-5 mt-4">
    <div class="container mt-4 pb-3">
      <router-view></router-view>
    </div>
  </main>
  <router-view v-else></router-view>
  <footer class="pb-1 fixed-bottom bg-dark">
    <nav :class="['navbar', 'navbar-expand-lg', 'navbar-dark']">
      <div class="d-flex justify-content-center flex-fill">
        <div class="d-flex w-100 align-items-center">
          <div class="d-flex justify-content-start w-100 d-none d-md-block">
            <a v-if="$route.path.toLocaleLowerCase() !== '/login'" href="/" class="navbar-brand ps-1">
              <img src="@/assets/images/CarbioFit.svg" alt="Carbio.fit Logo" height="30">
            </a>
          </div>
          <div v-if="$route.path.toLocaleLowerCase() !== '/login' && $route.path.toLocaleLowerCase() !== '/welcomescreen'"
            class="d-flex justify-content-center justify-content-md-end justify-content-lg-end w-100">
            <router-link to="/" class="btn btn-outline-primary me-2" type="button">
              <font-awesome-icon :icon="['fas', 'house']" />
            </router-link>
            <router-link to="/history" class="btn btn-outline-primary me-2" type="button">
              <font-awesome-icon :icon="['fas', 'chart-line']" />
            </router-link>
            <router-link to="/meallogs" class="btn btn-outline-primary me-2" type="button">
              <font-awesome-icon :icon="['fas', 'utensils']" />
            </router-link>
            <router-link to="/profile" class="btn btn-outline-primary me-2" type="button">
              <font-awesome-icon :icon="['fas', 'user']" />
            </router-link>
          </div>
        </div>
      </div>
    </nav>
  </footer>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'App',
  computed: {
    canGoBack() {
      return window.history.length > 1;
    }
  },
  setup() {
    const route = useRoute();
    watch(route, (newRoute) => {
      document.title = `${newRoute.name as string} - Carbio.fit`;
    }, { immediate: true });

    return {
    };
  },
  data() {
    return {
      isDarkTheme: true,
      isMobile: window.innerWidth < 768
    };
  },
  mounted() {
    document.body.setAttribute('data-bs-theme', this.isDarkTheme ? 'dark' : 'light');
  },
  methods: {
    toggleTheme() {
      this.isDarkTheme = !this.isDarkTheme;
      document.body.setAttribute('data-bs-theme', this.isDarkTheme ? 'dark' : 'light');
    },
    goBack() {
      this.$router.go(-1);
    }
  }
});
</script>
<template>
  <header class="container-fuild fixed-top bg-dark">
    <div class="row w-100 align-items-center">
      <div class="col text-start">
        <button v-if="$route.path.toLocaleLowerCase() !== '/login' && canGoBack" @click="goBack"
          class="btn btn-primary m-3">
          <font-awesome-icon :icon="['fas', 'arrow-left']" />
        </button>
      </div>
      <div class="col text-center">
        <img src="@/assets/images/CarbioFit.svg" alt="Carbio.fit Logo" height="30">
      </div>
      <div class="col text-end">
        <a v-if="$route.path.toLocaleLowerCase() !== '/login'" href="/api/auth/logout" class="btn btn-primary" role="button">
          <font-awesome-icon :icon="['fas', 'sign-out-alt']" />
        </a>
      </div>
    </div>
  </header>
  <main class="container mt-4 pt-5 pb-5">
    <div class="container mt-4 pb-2">
      <router-view></router-view>
    </div>
  </main>
  <footer class="container-fluid fixed-bottom bg-dark">
    <nav :class="['navbar', 'navbar-expand-lg', 'navbar-dark', { 'pb-4': isMobile }]">
      <div class="container-fluid">

        <div class="d-flex w-100 align-items-center">
          <div class="d-flex justify-content-start w-100 d-none d-md-block">
            <a v-if="$route.path.toLocaleLowerCase() !== '/login'" href="/" class="navbar-brand">
              <img src="@/assets/images/CarbioFit.svg" alt="Carbio.fit Logo" height="30">
            </a>
          </div>
          <div v-if="$route.path.toLocaleLowerCase() !== '/login'"
            class="d-flex justify-content-center justify-content-lg-end w-100">
            <router-link to="/" class="btn btn-outline-primary me-2" type="button">
              <font-awesome-icon :icon="['fas', 'house']" />
            </router-link>
            <router-link to="/history" class="btn btn-outline-primary me-2" type="button">
              <font-awesome-icon :icon="['fas', 'chart-line']" />
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
import { defineComponent, watch, computed } from 'vue';
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
<template>
  <div id="app">
    <footer class="footer bg-light mt-auto py-3">
      <router-link to="/">
        <button class="btn btn-secondary">Home</button>
      </router-link>
      <router-link to="/diary">
        <button class="btn btn-secondary">Diary</button>
      </router-link>
      <router-link to="/history">
        <button class="btn btn-secondary">History</button>
      </router-link>
      <router-link to="/search">
        <button class="btn btn-secondary">Barcode Scan</button>
      </router-link>
    </footer>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
export default {
  name: 'App',
};
</script>

<style>
@import "@/scss/custom.scss"
</style>

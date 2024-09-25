<template>
    <div>
      <h1>Diary Page</h1>
    </div>
    <footer class="footer bg-light mt-auto py-3">
      <router-link to="/">
        <button class="btn btn-secondary">Home</button>
      </router-link>
      <router-link to="/Diary">
        <button class="btn btn-secondary">Diary</button>
      </router-link>
      <router-link to="/History">
        <button class="btn btn-secondary">History</button>
      </router-link>
      <router-link to="/Search">
        <button class="btn btn-secondary">Barcode Scan</button>
      </router-link>
    </footer>
  </template>
  
  <script lang="ts">
  export default {
    name: 'DiaryPage',
  };
  </script>
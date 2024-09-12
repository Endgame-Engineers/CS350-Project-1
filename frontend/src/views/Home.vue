<template>
  <!-- <div class="container">
    <div class="row"></div>
  </div> -->
  <div class="container my-5">
  <!-- Row containing the box -->
  <div class="row justify-content-center">
    <div class="col-md-6">
      <!-- Calories box -->
      <div class="calories-box text-center">
        <h3>Calories</h3>
        <div class="circle">
          <p class="remaining">####</p>
          <p>Remaining</p>
        </div>
      </div>
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
    name: 'HomePage'
  }
  </script>
  
  <style>
  </style>
  
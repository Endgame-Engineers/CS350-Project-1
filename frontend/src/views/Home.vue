<template>
  <!-- Main Container -->
  <div class="container d-flex flex-column min-vh-100 py-5">
    
    <!-- Welcome Row -->
    <div class="row mb-4">
      <div class="col text-center">
        <h1 class="display-4">Welcome, {{ user?.username || 'Guest' }}</h1>
        <p class="lead">Track your calories and manage your nutrition easily.</p>
      </div>
    </div>

    <!-- Calories Box -->
    <div class="row justify-content-center flex-grow-1">
      <div class="col-md-6">
        <div class="calories-box bg-light p-4 rounded text-center shadow-sm">
          <h3 class="mb-4">Calories</h3>
          <div class="circle bg-primary text-white d-flex justify-content-center align-items-center mx-auto mb-3">
            <div>
              <p class="remaining display-4">####</p>
              <p>Remaining</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'HomePage',
  data() {
    return {
      user: {} as { username?: string }
    };
  },
  methods: {
    async getUser() {
      try {
        const response = await axios.get('/api/user');
        return response.data;
      } catch (error) {
        console.error(error);
      }
    }
  },
  async mounted() {
    this.user = await this.getUser();
  }
});
</script>
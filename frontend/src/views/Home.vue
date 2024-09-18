<template>
  <div class="row">
    <div class="col-12 col-md-6 mb-3 text-center">
      <h1>Welcome Back, {{ user?.username || 'Guest' }}</h1>
    </div>
    <div class="col-12 col-md-6 mb-3 text-center">
      <p>Monday, 1st January 2022</p>
      <p>Calorie Goal: 2000</p>
      <p>Calories Consumed: 1500</p>
    </div>
  </div>
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
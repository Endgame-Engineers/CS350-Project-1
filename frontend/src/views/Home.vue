<template>
  <!-- Main Container -->
  <div class="container d-flex flex-column py-5">
    
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
        <div class="calories-box bg-dark p-4 rounded text-center shadow-sm">
          <h3 class="mb-4">Calories</h3>
          <div class="circle bg-primary text-white d-flex justify-content-center align-items-center mx-auto mb-3">
            <div>
              <p class="remaining display-4">0</p>
              <p>Remaining</p>
            </div>
          </div>
          <div class="d-flex justify-content-between">
            <div>
              <p class="display-6">0</p>
              <p>Consumed</p>
            </div>
            <div>
              <p class="display-6">0</p>
              <p>Burned</p>
            </div>
            <div>
              <p class="display-6">{{ userStats.caloriegoal }}</p>
              <p>Goal</p>
            </div> 
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/User';

export default defineComponent({
  name: 'HomePage',
  setup() {
    const userStore = useUserStore();
    const user = userStore.user;

    const userStats = ref({ caloriegoal: 0 });

    const fetchUserStats = async () => {
      try {
        const response = await axios.get('/api/user/stats');
        userStats.value = response.data;
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
      }
    };

    fetchUserStats();

    return {
      user,
      userStats,
    };
  },
});
</script>
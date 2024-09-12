<template>
    <div class="home">
      <header class="header">
        <div class="profile-icon">
          <img src="profile-icon.png" alt="Profile" />
        </div>
        <h1>Future Name</h1>
        <div class="notification-icon">
          <img src="notification-icon.png" alt="Notifications" />
        </div>
      </header>
  
      <main class="main-content">
        <div class="calories">
          <p>Calories</p>
          <div class="calories-circle">
            <p>Remaining</p>
          </div>
        </div>
  
        <div class="base-goal">
          <p>Base Goal</p>
        </div>
  
        <div class="stats">
          <div class="food">
            <p>Food</p>
          </div>
          <div class="weight">
            <p>Weight</p>
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script lang="ts">
  export default {
    name: 'HomePage'
  }
  </script>
  
  <style scoped>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
  }
  
  .main-content {
    padding: 16px;
    text-align: center;
  }
  
  .calories, .base-goal, .stats {
    margin: 10px 0;
  }
  
  .footer {
    display: flex;
    justify-content: space-around;
    padding: 16px;
  }
  
  .icon {
    text-align: center;
    padding: 10px;
    cursor: pointer;
  }
  </style>
  
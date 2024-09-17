<template>
  <div class="container d-flex justify-content-center align-items-center login-page">
    <a href="/api/auth/google" class="btn btn-primary">
      Login with <font-awesome-icon :icon="['fab', 'google']" />
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
  name: 'LoginPage',
});
</script>
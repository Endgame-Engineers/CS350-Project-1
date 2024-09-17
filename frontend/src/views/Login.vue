<template>
  <div class="container d-flex justify-content-center align-items-center login-page">
    <a href="/api/auth/google" class="btn btn-primary">
      Login with <font-awesome-icon :icon="['fab', 'google']" />
    </a>
  </div>
</template>

<script lang="ts">
export default {
  name: 'LoginPage',
}
</script>
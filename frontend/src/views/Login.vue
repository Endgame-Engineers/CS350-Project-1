<template>
<div class="d-flex flex-column align-items-center justify-content-center vh-100">
  <div class="contianer text-center">
    <a :href="googleAuthUrl" class="btn btn-primary">
      Login with <font-awesome-icon :icon="['fab', 'google']" />
    </a>
  </div>
</div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
  name: 'LoginPage',

  setup() {
    // get params from the URL
    const googleAuthUrl = `/api/auth/google`;

    onMounted(() => {
      console.log('Login Page Mounted');
    });

    return {
      googleAuthUrl,
    };
  },

});
</script>script
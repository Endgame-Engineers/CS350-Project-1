<template>
<div class="container d-flex flex-column justify-content-center align-items-center">
    <img src="@/assets/images/CarbioFit.svg" alt="Carbio.fit" class="img-fluid" />
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
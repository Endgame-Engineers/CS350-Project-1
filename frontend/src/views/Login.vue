<template>
  <div class="container d-flex justify-content-center align-items-center login-page">
    <a href="/api/auth/google" class="btn btn-primary">
      Login with <font-awesome-icon :icon="['fab', 'google']" />
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const router = useRouter();

    onMounted(() => {
      if (localStorage.getItem('user')) {
        router.push('/');
      } else {
        fetch('/api/auth/google/success', { credentials: 'include' })
          .then(response => response.json())
          .then(data => {
            if (data.user) {
              localStorage.setItem('user', JSON.stringify(data.user));
              router.push('/');
            }
          });
      }
    });

    return {};
  }
});
</script>
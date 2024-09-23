<template>
    <div class="row">
        <div class="col-12 col-md-4 mb-3">
            <h1>{{ user?.username }}</h1>
            <img :src="user?.profilepic" alt="avatar" class="img-fluid rounded-circle">
            <div v-for="(value, key) in user" :key="key">
                <p>{{ key }}: {{ value }}</p>
            </div>
        </div>
        <div class="col-12 col-md-4 mb-3">
            <h1>Edit Profile</h1>

        </div>
        <div class="col-12 col-md-4 mb-3">
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useUserStore } from '@/stores/User';
import { UserStat } from '@/models/Models';

export default defineComponent({
    name: 'ProfilePage',
    setup() {
        const userStore = useUserStore();
        const user = userStore.user;

        
        if (!user) {
            console.error('User data is not available');
        }

        return {
            user,
        };
    },
});
</script>

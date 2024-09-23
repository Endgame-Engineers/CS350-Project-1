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
            <!-- Weight, height, age, calorie goal, date of birth, activity level, sex -->

            <form @submit.prevent="saveUserStats">
                <div class="mb-3">
                    <label for="weight" class="form-label">Weight</label>
                    <input type="number" class="form-control" id="weight" v-model="userStats.weight">
                </div>
                <div class="mb-3">
                    <label for="height" class="form-label">Height</label>
                    <input type="number" class="form-control" id="height" v-model="userStats.height">
                </div>
                <div class="mb-3">
                    <label for="age" class="form-label">Age</label>
                    <input type="number" class="form-control" id="age" v-model="userStats.age">
                </div>
                <div class="mb-3">
                    <label for="calorieGoal" class="form-label">Calorie Goal</label>
                    <input type="number" class="form-control" id="calorieGoal" v-model="userStats.caloriegoal">
                </div>
                <div class="mb-3">
                    <label for="dob" class="form-label">Date of Birth</label>
                    <input type="date" class="form-control" id="dob" v-model="formattedDateOfBirth">
                </div>
                <div class="mb-3">
                    <label for="activityLevel" class="form-label">Activity Level</label>
                    <select class="form-select" id="activityLevel" v-model="userStats.activitylevel">
                        <option value="1">Sedentary</option>
                        <option value="2">Lightly Active</option>
                        <option value="3">Moderately Active</option>
                        <option value="4">Very Active</option>
                        <option value="5">Super Active</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="sex" class="form-label">Sex</label>
                    <select class="form-select" id="sex" v-model="userStats.sex">
                        <option value="1">Male</option>
                        <option value="2">Female</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">Save</button>
            </form>
        </div>
        <div class="col-12 col-md-4 mb-3">
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useUserStore } from '@/stores/User';
import { UserStat } from '@/models/Models';
import { addUserStats, getUserStats } from '@/services/UserStats';

export default defineComponent({
    name: 'ProfilePage',
    setup() {
        const userStore = useUserStore();
        const user = userStore.user;

        const userStats = ref<UserStat>(
            {
                weight: 0,
                height: 0,
                age: 0,
                caloriegoal: 0,
                dateofbirth: new Date(),
                activitylevel: 0,
                sex: 0,
                updatedon: new Date(),
            }
        );

        const fetchUserStats = async () => {
            const stats = await getUserStats();
            userStats.value = stats;
        };

        const saveUserStats = async () => {
            const userStat = {
                weight: userStats.value.weight,
                height: userStats.value.height,
                age: userStats.value.age,
                caloriegoal: userStats.value.caloriegoal,
                dateofbirth: userStats.value.dateofbirth,
                activitylevel: userStats.value.activitylevel,
                sex: userStats.value.sex
            } as UserStat;

            await addUserStats(userStat);
            await fetchUserStats();
        };

        const formattedDateOfBirth = computed({
            get() {
            if (!userStats.value.dateofbirth) {
                return '';
            }
            const date = new Date(userStats.value.dateofbirth);
            return date.toISOString().split('T')[0];
            },
            set(value: string) {
            userStats.value.dateofbirth = new Date(value);
            }
        });

        return {
            user,
            userStats,
            saveUserStats,
            formattedDateOfBirth,
            fetchUserStats
        };
    },
    mounted() {
        if (!this.user) {
            console.error('User data is not available');
        } else {
            this.fetchUserStats();
        }
    }
});
</script>

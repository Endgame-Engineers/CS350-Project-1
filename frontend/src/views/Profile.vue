<template>
    <div class="row">
        <div class="col-12 col-md-4 mb-3 text-center">
            <h1>{{ user?.username }}</h1>
            <div class="d-flex justify-content-center mb-3">
                <img :src="user?.profilepic" alt="avatar" class="img-fluid rounded-circle">
            </div>
            <div v-for="(value, key) in user" :key="key">
                <p v-if="!excludedKeys.includes(key)"><strong>{{ key }}</strong>: {{ value }}</p>
            </div>
        </div>
        <div class="col-12 col-md-8 mb-3">
            <h1 class="text-center">Edit Profile</h1>
            <!-- Weight, height, age, calorie goal, date of birth, activity level, sex -->

            <form @submit.prevent="saveUserStats">
                <div class="row">
                    <div class="col-12 col-md-6 mb-3">
                        <label for="weight" class="form-label">Weight</label>
                        <input type="number" placeholder="Enter weight in pounds" class="form-control" id="weight" v-model="userStats.weight">
                    </div>
                    <div class="col-12 col-md-6 mb-3">
                        <label for="height" class="form-label">Height</label>
                        <input type="number" placeholder="Enter height in inches" class="form-control" id="height" v-model="userStats.height">
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-md-6 mb-3">
                        <label for="age" class="form-label">Age</label>
                        <input type="number" placeholder="Enter age" class="form-control" id="age" v-model="userStats.age">
                    </div>
                    <div class="col-12 col-md-6 mb-3">
                        <label for="calorieGoal" class="form-label">Calorie Goal</label>
                        <input type="number" placeholder="Enter calorie goal" class="form-control" id="calorieGoal" v-model="userStats.caloriegoal">
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 mb-3">
                        <label for="dob" class="form-label">Date of Birth</label>
                        <input type="date" placeholder="Enter date of birth" class="form-control" id="dob" v-model="formattedDateOfBirth">
                    </div>
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
        <!-- <div class="col-12 col-md-4 mb-3">
        </div> -->
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/User';
import { UserStat } from '@/models/Models';
import { addUserStats, getUserStats } from '@/services/UserStats';

export default defineComponent({
    name: 'ProfilePage',
    setup() {
        const userStore = useUserStore();
        const user = userStore.user;
        const excludedKeys = ref(['id', 'uuid', 'providerid', 'profilepic', 'profilecreated']);

        const userStats = ref<UserStat>({
            weight: 0,
            height: 0,
            age: 0,
            caloriegoal: 0,
            dateofbirth: new Date(),
            activitylevel: 1,
            sex: 1,
            updatedon: new Date(),
        });

        const fetchUserStats = async () => {
            try {
                const stats = await getUserStats();
                if (stats) {
                    userStats.value = stats;
                }
            } catch (error) {
                console.error('Failed to fetch user stats:', error);
            }
        };

        const saveUserStats = async () => {
            try {
                await addUserStats(userStats.value);
                await fetchUserStats();
                console.log('User stats saved successfully');
            } catch (error) {
                console.error('Failed to save user stats:', error);
            }
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

        onMounted(() => {
            fetchUserStats();
        });

        return {
            user,
            userStats,
            saveUserStats,
            formattedDateOfBirth,
            fetchUserStats,
            excludedKeys
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
<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/User';
import { addUserStats, getUserStat, userStats, ProfileStats } from '@/services/UserStats';

export default defineComponent({
    name: 'ProfilePage',
    setup() {
        const userStore = useUserStore();
        const user = userStore.user;
        const excludedKeys = ref(['id', 'uuid', 'providerid', 'profilepic', 'profilecreated']);
        let isEditing = ref(false);


        const fetchUserStats = async () => {
            try {
                const stats = await getUserStat() as ProfileStats
                if (stats && 'weight' in stats && 'height' in stats) {
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
                toggleIsEditing();
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

        const toggleIsEditing = () => {
            isEditing.value = !isEditing.value;
        };

        onMounted(() => {
            fetchUserStats();
        });

        return {
            user,
            userStats,
            saveUserStats,
            formattedDateOfBirth,
            fetchUserStats,
            excludedKeys,
            isEditing,
            toggleIsEditing
        };
    },
});
</script>

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
            <div class="d-flex justify-content-end">
                <button v-if="!isEditing" class="btn btn-outline-primary me-2" @click="toggleIsEditing">
                    <font-awesome-icon :icon="['fas', 'pencil']" />
                </button>
            </div>

            <form @submit.prevent="saveUserStats">
                <div class="row">
                    <div class="col-12 col-md-6 mb-3">
                        <label for="weight" class="form-label">Weight (lbs)</label>
                        <div v-if="!isEditing">{{ userStats.weight }} lbs</div>
                        <input v-else type="number" placeholder="Enter weight in pounds" class="form-control"
                            id="weight" v-model.number="userStats.weight">
                    </div>
                    <div class="col-12 col-md-6 mb-3">
                        <label for="height" class="form-label">Height (inches)</label>
                        <div v-if="!isEditing">{{ userStats.height }} inches</div>
                        <input v-else type="number" placeholder="Enter height in inches" class="form-control"
                            id="height" v-model.number="userStats.height">
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-md-6 mb-3">
                        <label for="calorieGoal" class="form-label">Calorie Goal</label>
                        <div v-if="!isEditing">{{ userStats.caloriegoal }} kcal</div>
                        <input v-else type="number" placeholder="Enter calorie goal" class="form-control"
                            id="calorieGoal" v-model.number="userStats.caloriegoal">
                        <div class="form-text">Recommended calorie goal: {{ userStats.recommendedcaloriegoal }}</div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-md-6 mb-3">
                        <label for="dob" class="form-label">Date of Birth</label>
                        <div v-if="!isEditing">{{ formattedDateOfBirth }}</div>
                        <input v-else type="date" placeholder="Enter date of birth" class="form-control" id="dob"
                            v-model="formattedDateOfBirth">
                    </div>
                    <div class="col-12 col-md-6 mb-3">
                        <label for="goal" class="form-label">Goal</label>
                        <div v-if="!isEditing">
                            <span v-if="userStats.goal = 1">Lose Weight</span>
                            <span v-else-if="userStats.goal = 2">Maintain Weight</span>
                            <span v-else-if="userStats.goal = 3">Gain Weight</span>
                        </div>
                        <input v-else type="number" placeholder="Enter goal" class="form-control" id="goal"
                            v-model.number="userStats.goal">
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-md-6 mb-3">
                        <label for="activitylevel" class="form-label">Activity Level</label>
                        <div v-if="!isEditing">
                            <span v-if="userStats.activitylevel = 1">Sedentary</span>
                            <span v-else-if="userStats.activitylevel = 2">Lightly Active</span>
                            <span v-else-if="userStats.activitylevel = 3">Moderately Active</span>
                            <span v-else-if="userStats.activitylevel = 4">Very Active</span>
                            <span v-else-if="userStats.activitylevel = 5">Super Active</span>
                        </div>
                        <select v-else class="form-select" id="activitylevel" v-model.number="userStats.activitylevel">
                            <option value="1">Sedentary</option>
                            <option value="2">Lightly Active</option>
                            <option value="3">Moderately Active</option>
                            <option value="4">Very Active</option>
                            <option value="5">Super Active</option>
                        </select>
                    </div>
                    <div class="col-12 col-md-6 mb-3">
                        <label for="sex" class="form-label">Sex</label>
                        <div v-if="!isEditing">{{ userStats.sex === 1 ? 'Male' : 'Female' }}</div>
                        <select v-else class="form-select" id="sex" v-model.number="userStats.sex">
                            <option value="1">Male</option>
                            <option value="2">Female</option>
                        </select>
                    </div>
                    <user-stats-percentages :is-editing="isEditing" />
                </div>
                <div class="d-flex justify-content-end">
                    <button v-if="isEditing" type="submit" class="btn btn-primary">Save</button>
                </div>
            </form>
        </div>
    </div>
</template>
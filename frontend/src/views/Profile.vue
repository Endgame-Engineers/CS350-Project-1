<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/User';
import { addUserStats, getUserStat, updateUserStat, userStats, ProfileStats } from '@/services/UserStats';

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
                console.log('Saving user stats:', userStats.value);
                await addUserStats(userStats.value);
                await fetchUserStats();
                console.log('User stats saved successfully');
            } catch (error) {
                console.error('Failed to save user stats:', error);
            }
        };

        const toggleEditingAndSave = () => {
            saveUserStats();
            toggleIsEditing();
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
            toggleIsEditing,
            toggleEditingAndSave,
            updateUserStat,
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
                <button v-if="!isEditing" class="btn btn-outline-primary me-2"
                    @click="toggleIsEditing"><font-awesome-icon :icon="['fas', 'pencil']" /></button>
            </div>

            <form @submit.prevent="saveUserStats">
                <div class="row">
                    <div class="col-12 col-md-6 mb-3">
                        <label for="weight" class="form-label">Weight</label>
                        <input type="number" placeholder="Enter weight in pounds" class="form-control" id="weight"
                            v-model="userStats.weight" :readonly="!isEditing" @change="updateUserStat('weight', $event)">
                    </div>
                    <div class="col-12 col-md-6 mb-3">
                        <label for="height" class="form-label">Height</label>
                        <input type="number" placeholder="Enter height in inches" class="form-control" id="height"
                            v-model="userStats.height" :readonly="!isEditing" @change="updateUserStat('height', $event)">
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-md-6 mb-3">
                        <label for="calorieGoal" class="form-label">Calorie Goal</label>
                        <input type="number" placeholder="Enter calorie goal" class="form-control" id="calorieGoal"
                            v-model="userStats.caloriegoal" :readonly="!isEditing" @change="updateUserStat('caloriegoal', $event)">
                        <div class="form-text">Recommended calorie goal: {{ userStats.recommendedcaloriegoal }}</div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-md-6 mb-3">
                        <label for="dob" class="form-label">Date of Birth</label>
                        <input type="date" placeholder="Enter date of birth" class="form-control" id="dob"
                            v-model="formattedDateOfBirth" :readonly="!isEditing">
                    </div>
                    <div class="col-12 col-md-6 mb-3">
                        <label for="goal" class="form-label">Goal</label>
                        <select class="form-select" id="goal" v-model="userStats.goal" :disabled="!isEditing" @change="updateUserStat('goal', $event)">
                            <option value="1">Lose Weight</option>
                            <option value="2">Maintain Weight</option>
                            <option value="3">Gain Weight</option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-md-6 mb-3">
                        <label for="activityLevel" class="form-label">Activity Level</label>
                        <select class="form-select" id="activityLevel" v-model="userStats.activitylevel"
                            :disabled="!isEditing" @change="updateUserStat('activitylevel', $event)">
                            <option value="1">Sedentary</option>
                            <option value="2">Lightly Active</option>
                            <option value="3">Moderately Active</option>
                            <option value="4">Very Active</option>
                            <option value="5">Super Active</option>
                        </select>
                    </div>
                    <div class="col-12 col-md-6 mb-3">
                        <label for="sex" class="form-label">Sex</label>
                        <select class="form-select" id="sex" v-model="userStats.sex" :disabled="!isEditing" @change="updateUserStat('sex', $event)">
                            <option value="1">Male</option>
                            <option value="2">Female</option>
                        </select>
                    </div>
                </div>
                <user-stats-percentages />
                <div v-if="isEditing" class="d-flex flex-column justify-content-end align-items-end">
                    <button @click="toggleEditingAndSave" type="submit" class="btn btn-primary">Save</button>
                </div>
            </form>
        </div>
    </div>
</template>
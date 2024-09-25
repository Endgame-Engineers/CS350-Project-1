<template>
    <div v-if="step === 1" class="d-flex flex-column align-items-center">
        <h1>Welcome {{ user.username || "Guest" }}!</h1>
        <h3>Let's Get Started</h3>
        <div class="text-end mt-3">
            <button class="btn btn-outline-primary me-2" type="button" @click="nextStep">
                <font-awesome-icon :icon="['fas', 'arrow-right']" />
            </button>
        </div>
    </div>

    <form @submit.prevent="handleSaveAndNext">
        <div v-if="step === 2" class="col-12 mb-3">
            <h1>Enter current Weight</h1>
            <label for="weight" class="form-label">Weight</label>
            <input type="number" placeholder="Enter weight in pounds" id="weight" v-model="userStats.weight">
            <button class="btn btn-outline-primary me-2" @click="prevStep"><font-awesome-icon :icon="['fas', 'arrow-left']" /></button>
            <button class="btn btn-outline-primary me-2" type="submit"><font-awesome-icon :icon="['fas', 'arrow-right']" /></button>
        </div>
    
        <div v-if="step === 3" class="col-12 mb-3">
            <h1>Enter current Height</h1>
            <label for="height" class="form-label">Height</label>
            <input type="number" placeholder="Enter height in inches" id="height" v-model="userStats.height">
            <button class="btn btn-outline-primary me-2" @click="prevStep"><font-awesome-icon :icon="['fas', 'arrow-left']" /></button>
            <button class="btn btn-outline-primary me-2" type="submit"><font-awesome-icon :icon="['fas', 'arrow-right']" /></button>
        </div>
    
        <div v-if="step === 4" class="col-12 mb-3">
            <h1>Enter current Age</h1>
            <label for="age" class="form-label">Age</label>
            <input type="number" placeholder="Enter your age" id="age" v-model="userStats.age">
            <button class="btn btn-outline-primary me-2" @click="prevStep"><font-awesome-icon :icon="['fas', 'arrow-left']" /></button>
            <button class="btn btn-outline-primary me-2" type="submit"><font-awesome-icon :icon="['fas', 'arrow-right']" /></button>
        </div>
    
        <div v-if="step === 5" class="col-12 mb-3">
            <label for="dob" class="form-label">Date of Birth</label>
            <input type="date" placeholder="Enter date of birth" class="form-control" id="dob" v-model="formattedDateOfBirth">
            <button class="btn btn-outline-primary me-2" @click="prevStep"><font-awesome-icon :icon="['fas', 'arrow-left']" /></button>
            <button class="btn btn-outline-primary me-2" type="submit"><font-awesome-icon :icon="['fas', 'arrow-right']" /></button>
        </div>
    
        <div v-if="step === 6" class="col-12 mb-3">
            <h1>Select Activity level</h1>
            <label for="activityLevel" class="form-label">Activity Level</label>
                <select class="form-select" id="activityLevel" v-model="userStats.activitylevel">
                    <option value="1">Sedentary</option>
                    <option value="2">Lightly Active</option>
                    <option value="3">Moderately Active</option>
                    <option value="4">Very Active</option>
                    <option value="5">Super Active</option>
                </select>
            <button class="btn btn-outline-primary me-2" @click="prevStep"><font-awesome-icon :icon="['fas', 'arrow-left']" /></button>
            <button class="btn btn-outline-primary me-2" type="submit"><font-awesome-icon :icon="['fas', 'arrow-right']" /></button>
        </div>
    
        <div v-if="step === 7" class="col-12 mb-3">
            <label for="sex" class="form-label">Sex</label>
            <select class="form-select" id="sex" v-model="userStats.sex">
                <option value="1">Male</option>
                <option value="2">Female</option>
            </select>
            <button class="btn btn-outline-primary me-2" @click="prevStep"><font-awesome-icon :icon="['fas', 'arrow-left']" /></button>
            <router-link to="/">
                <button class="btn btn-primary" type="button">Finish and Submit</button>
            </router-link>
        </div>
    </form>
</template>

<script lang="ts">
import { useUserStore } from '@/stores/User';
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue';
import { UserStat } from '@/models/Models';
import { addUserStats, getUserStats } from '@/services/UserStats';


export default defineComponent({
    name: 'WelcomeScreen',
    setup(){

        const userStore = useUserStore();
        const user = userStore.user;
        const step = ref(1);

        const userStats = ref<UserStat>({
            weight: null,
            height: null,
            age: null,
            caloriegoal: null,
            dateofbirth: new Date(),
            activitylevel: 1,
            sex: 1,
            updatedon: new Date(),
        });

        const nextStep = () => {
            step.value += 1;
        }

        const prevStep = () => {
            step.value -= 1;
        }

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

        const handleSaveAndNext = async () => {
            saveUserStats();
            nextStep();
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

        onUnmounted(() => {
            saveUserStats();
        });

        return{
            step,
            user,
            userStats,
            nextStep,
            prevStep,
            fetchUserStats,
            saveUserStats,
            handleSaveAndNext,
            formattedDateOfBirth,

        }
    }
});

</script>
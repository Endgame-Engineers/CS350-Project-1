<script lang="ts">
import { useUserStore } from '@/stores/User';
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { UserStat } from '@/models/Models';
import { addUserStats, fetchCalorieGoal, ProfileStats } from '@/services/UserStats';
import { useUserWelcomeStore } from '@/stores/Welcome';

export default defineComponent({
    name: 'WelcomeScreen',
    setup() {
        const router = useRouter();
        const userStore = useUserStore();
        const welcomeStore = useUserWelcomeStore();
        const user = userStore.user;
        const step = ref(1);
        const isFormValid = ref(true);
        const userStat = ref<ProfileStats>(welcomeStore.getUserStat() || {
            weight: null,
            height: null,
            dateofbirth: null,
            sex: 0,
            activitylevel: 0,
            goal: 0,
            caloriegoal: null,
            watergoal: null,
            proteinpercentage: 0,
            fatpercentage: 0,
            carbpercentage: 0,
        });


        const handleValidityUpdate = (isValid: boolean) => {
            isFormValid.value = isValid;
        };


        const nextStep = (event: Event) => {
            event.preventDefault();
            if (step.value === 2 && !userStat.value.weight) {
            userStat.value.Error = 'Please enter your weight.';
            } else if (step.value === 3 && !userStat.value.height) {
            userStat.value.Error = 'Please enter your height.';
            } else if (step.value === 4 && !userStat.value.dateofbirth) {
            userStat.value.Error = 'Please enter your date of birth.';
            } else if (step.value === 5 && !userStat.value.sex) {
            userStat.value.Error = 'Please select your sex.';
            } else if (step.value === 6 && !userStat.value.activitylevel) {
            userStat.value.Error = 'Please select your activity level.';
            } else if (step.value === 7 && !userStat.value.goal) {
            userStat.value.Error = 'Please select your goal.';
            } else if (step.value === 8 && !userStat.value.caloriegoal) {
            userStat.value.Error = 'Please enter your calorie goal.';
            } else if (step.value === 9 && !userStat.value.watergoal) {
            userStat.value.Error = 'Please enter your water goal.';
            } else {
            userStat.value.Error = '';
            step.value += 1;
            getRecommendedCalorieGoal();
            }
        }

        const prevStep = (event: Event) => {
            event.preventDefault();
            getRecommendedCalorieGoal();
            if (step.value > 2) step.value--;
        }

        const getRecommendedCalorieGoal = async () => {
            try {
                const calorieGoal = await fetchCalorieGoal(userStat.value as UserStat);
                userStat.value.recommendedcaloriegoal = calorieGoal;
            } catch (error) {
                console.error('Failed to fetch calorie goal:', error);
            }
        };

        const saveUserStats = async () => {
            try {
                await addUserStats(userStat.value);
                console.log('User stats saved successfully');
                welcomeStore.resetWelcomeStore();
                router.push({ name: 'Home' });
            } catch (error) {
                console.error('Failed to save user stats:', error);
            }
        };

        const formattedDateOfBirth = computed({
            get() {
                if (!userStat.value.dateofbirth) {
                    return '';
                }
                const date = new Date(userStat.value.dateofbirth);
                return date.toISOString().split('T')[0];
            },
            set(value: string) {
                userStat.value.dateofbirth = new Date(value);
            }
        });

        onMounted(() => {
            if(welcomeStore.getUserStat().step) {
                step.value = welcomeStore.getUserStat().step ?? 1;
            }
        });

        watch(() => userStat.value, (newValue) => {
            welcomeStore.setUserStat(newValue);
        }, { deep: true });

        watch(() => step.value, (newValue) => {
            welcomeStore.setUserStat({ ...userStat.value, step: newValue });
        }, { deep: true });

        return {
            step,
            user,
            userStat,
            nextStep,
            prevStep,
            saveUserStats,
            formattedDateOfBirth,
            getRecommendedCalorieGoal,
            handleValidityUpdate,
            isFormValid
        }
    }
});

</script>

<template>
    <main class="d-flex flex-column align-items-center justify-content-center vh-100">
        <div class="container">
            <div v-if="step === 1" class="d-flex flex-column align-items-center justify-content-center">
                <h1>Welcome {{ user.username || "Guest" }}!</h1>
                <h3>Let's Get Started</h3>
                <div class="text-end mt-3">
                    <button class="btn btn-primary" type="button" @click="nextStep">Continue</button>
                </div>
            </div>

            <form class="d-flex flex-column align-items-center justify-content-center">
                <div v-if="step === 2" class="col-12 col-md-5 mb-3 text-center">
                    <h1>Enter Current Weight</h1>
                    <label for="weight" class="form-label"></label>
                    <input type="number" placeholder="Enter weight in lbs" id="weight" class="form-control"
                        v-model.number="userStat.weight" @keydown.enter="nextStep">
                    <div class="d-flex justify-content-between mt-3">
                        <button class="btn btn-outline-primary" @click="prevStep">
                            <font-awesome-icon :icon="['fas', 'arrow-left']" />
                        </button>
                        <button class="btn btn-outline-primary" @click="nextStep">
                            <font-awesome-icon :icon="['fas', 'arrow-right']" />
                        </button>
                    </div>
                </div>

                <div v-if="step === 3" class="col-12 col-md-5 mb-3 text-center">
                    <h1>Enter Current Height</h1>
                    <label for="height" class="form-label"></label>
                    <input type="number" placeholder="Enter height in inches" id="height" class="form-control"
                        v-model.number="userStat.height" @keydown.enter="nextStep">
                    <div class="d-flex justify-content-between mt-3">
                        <button class="btn btn-outline-primary" @click="prevStep">
                            <font-awesome-icon :icon="['fas', 'arrow-left']" />
                        </button>
                        <button class="btn btn-outline-primary" @click="nextStep">
                            <font-awesome-icon :icon="['fas', 'arrow-right']" />
                        </button>
                    </div>
                </div>

                <div v-if="step === 4" class="col-12 col-md-5 mb-3 text-center">
                    <h1>Enter Date of Birth</h1>
                    <label for="dob" class="form-label"></label>
                    <input type="date" placeholder="Enter date of birth" class="form-control" id="dob"
                        v-model="formattedDateOfBirth" @keydown.enter="nextStep">
                    <div class="d-flex justify-content-between mt-3">
                        <button class="btn btn-outline-primary" @click="prevStep">
                            <font-awesome-icon :icon="['fas', 'arrow-left']" />
                        </button>
                        <button class="btn btn-outline-primary" @click="nextStep">
                            <font-awesome-icon :icon="['fas', 'arrow-right']" />
                        </button>
                    </div>
                </div>

                <div v-if="step === 5" class="col-12 col-md-5 mb-3 text-center">
                    <h1>Enter Sex</h1>
                    <label for="sex" class="form-label"></label>
                    <select class="form-select" id="sex" v-model.number="userStat.sex" @keydown.enter="nextStep">
                        <option value="1">Male</option>
                        <option value="2">Female</option>
                    </select>
                    <div class="d-flex justify-content-between mt-3">
                        <button class="btn btn-outline-primary" @click="prevStep">
                            <font-awesome-icon :icon="['fas', 'arrow-left']" />
                        </button>
                        <button class="btn btn-outline-primary" @click="nextStep">
                            <font-awesome-icon :icon="['fas', 'arrow-right']" />
                        </button>
                    </div>
                </div>

                <div v-if="step === 6" class="col-12 col-md-5 mb-3 text-center">
                    <h1>Select Activity Level</h1>
                    <label for="activitylevel" class="form-label"></label>
                    <select class="form-select" id="activitylevel" v-model.number="userStat.activitylevel"
                        @keydown.enter="nextStep">
                        <option value="1">Sedentary</option>
                        <option value="2">Lightly Active</option>
                        <option value="3">Moderately Active</option>
                        <option value="4">Very Active</option>
                        <option value="5">Super Active</option>
                    </select>
                    <div class="d-flex justify-content-between mt-3">
                        <button class="btn btn-outline-primary" @click="prevStep">
                            <font-awesome-icon :icon="['fas', 'arrow-left']" />
                        </button>
                        <button class="btn btn-outline-primary" @click="nextStep">
                            <font-awesome-icon :icon="['fas', 'arrow-right']" />
                        </button>
                    </div>
                </div>

                <div v-if="step === 7" class="col-12 col-md-5 mb-3 text-center">
                    <h1>Select Goal</h1>
                    <label for="goal" class="form-label"></label>
                    <select class="form-select" id="goal" v-model.number="userStat.goal" @keydown.enter="nextStep">
                        <option value="1">Lose Weight</option>
                        <option value="2">Maintain Weight</option>
                        <option value="3">Gain Weight</option>
                    </select>
                    <div class="d-flex justify-content-between mt-3">
                        <button class="btn btn-outline-primary" @click="prevStep">
                            <font-awesome-icon :icon="['fas', 'arrow-left']" />
                        </button>
                        <button class="btn btn-outline-primary" @click="nextStep">
                            <font-awesome-icon :icon="['fas', 'arrow-right']" />
                        </button>
                    </div>
                </div>

                <div v-if="step === 8" class="col-12 col-md-5 mb-3 text-center">
                    <h1>Enter Calorie Goal</h1>
                    <label for="calorieGoal" class="form-label"></label>
                    <input type="number" placeholder="Enter calorie goal" class="form-control" id="calorieGoal"
                        v-model.number="userStat.caloriegoal" @keydown.enter="nextStep">
                    <div class="form-text">Your Recommended Calorie Intake is {{ userStat.recommendedcaloriegoal }} per
                        day</div>
                    <div class="d-flex justify-content-between mt-3">
                        <button class="btn btn-outline-primary" @click="prevStep">
                            <font-awesome-icon :icon="['fas', 'arrow-left']" />
                        </button>
                        <button class="btn btn-outline-primary" @click="nextStep">
                            <font-awesome-icon :icon="['fas', 'arrow-right']" />
                        </button>
                    </div>
                </div>

                <div v-if="step === 9" class="col-12 col-md-5 mb-3 text-center">
                    <h1>Enter Water Goal</h1>
                    <label for="waterGoal" class="form-label"></label>
                    <input type="number" placeholder="Enter water goal in ounces" class="form-control" id="waterGoal"
                        v-model.number="userStat.watergoal" @keydown.enter="nextStep">
                    <div class="d-flex justify-content-between mt-3">
                        <button class="btn btn-outline-primary" @click="prevStep">
                            <font-awesome-icon :icon="['fas', 'arrow-left']" />
                        </button>
                        <button class="btn btn-outline-primary" @click="nextStep">
                            <font-awesome-icon :icon="['fas', 'arrow-right']" />
                        </button>
                    </div>
                </div>

                <div v-if="step === 10" class="col-12 col-md-5 mb-3 text-center">
                    <h1>Macronutrient Distribution</h1>
                    <user-stats-percentages :is-editing="true" :user-stats="userStat" :edit-user-stats="userStat"
                        @reset-warning="handleValidityUpdate(false)" @update-validity="handleValidityUpdate" />
                    <div class="d-flex justify-content-between mt-3">
                        <button class="btn btn-outline-primary" @click="prevStep">
                            <font-awesome-icon :icon="['fas', 'arrow-left']" />
                        </button>
                        <button class="btn btn-primary" type="button" @click="saveUserStats" :disabled="!isFormValid">
                            Save and Continue
                        </button>
                    </div>
                </div>

                <div v-if="userStat.Error" class="alert alert-danger mt-3" role="alert">
                    {{ userStat.Error }}
                </div>
            </form>
        </div>
    </main>
</template>
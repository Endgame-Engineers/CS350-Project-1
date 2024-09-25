<template>
    <div v-if="step === 1" class="d-flex flex-column align-items-center justify-content-center">
        <h1>Welcome {{ user.username || "Guest" }}!</h1>
        <h3>Let's Get Started</h3>
        <div class="text-end mt-3">
            <button class="btn btn-primary" type="button" @click="nextStep">Continue</button>
        </div>
    </div>

    <form class="d-flex flex-column align-items-center justify-content-center">
        <div v-if="step === 2" class="col-12 col-md-5 mb-3 text-center">
            <h1>Enter current Weight</h1>
            <label for="weight" class="form-label"></label>
            <input type="number" placeholder="Enter weight in pounds" id="weight" class="form-control"
                v-model="userStats.weight" @change="updateUserStat('weight', $event)">
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
            <h1>Enter current Height</h1>
            <label for="height" class="form-label"></label>
            <input type="number" placeholder="Enter height in inches" id="height" class="form-control"
                v-model="userStats.height" @change="updateUserStat('height', $event)">
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
                v-model="formattedDateOfBirth" @change="updateUserStat('dateofbirth', $event)">
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
            <select class="form-select" id="sex" v-model="userStats.sex" @change="updateUserStat('sex', $event)">
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
            <h1>Select Activity level</h1>
            <label for="activityLevel" class="form-label"></label>
            <select class="form-select" id="activityLevel" v-model="userStats.activitylevel" @change="updateUserStat('activitylevel', $event)">
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
            <h1>Enter Calorie Goal</h1>
            <label for="calorieGoal" class="form-label"></label>
            <input type="number" placeholder="Enter calorie goal" class="form-control" id="calorieGoal"
                v-model="userStats.caloriegoal" @change="updateUserStat('caloriegoal', $event)">
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
            <h1>Select Goal</h1>
            <label for="goal" class="form-label"></label>
            <select class="form-select" id="goal" v-model="userStats.goal" @change="updateUserStat('goal', $event)">
                <option value="1">Lose Weight</option>
                <option value="2">Maintain Weight</option>
                <option value="3">Gain Weight</option>
            </select>
            <div class="d-flex justify-content-between mt-3">
                <button class="btn btn-outline-primary" @click="prevStep">
                    <font-awesome-icon :icon="['fas', 'arrow-left']" />
                </button>
                <button class="btn btn-primary" type="button" @click="saveUserStats">
                    Save and Continue
                </button>
            </div>
        </div>
    </form>
</template>

<script lang="ts">
import { useUserStore } from '@/stores/User';
import { defineComponent, ref, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { UserStat } from '@/models/Models';
import { addUserStats, getUserStats } from '@/services/UserStats';


export default defineComponent({
    name: 'WelcomeScreen',
    setup() {
        const router = useRouter();
        const userStore = useUserStore();
        const user = userStore.user;
        const step = ref(1);

        const userStats = ref<UserStat>({
            weight: null,
            height: null,
            caloriegoal: null,
            dateofbirth: new Date(),
            activitylevel: 1,
            sex: 1,
            updatedon: new Date(),
            goal: 1,
            proteinpercentage: 0,
            fatpercentage: 0,
            carbpercentage: 0,
            proteingrams: 0,
            fatgrams: 0,
            carbgrams: 0,
        });

        const nextStep = () => {
            step.value += 1;
        }

        const prevStep = () => {
            step.value -= 1;
        }

        const updateUserStat = (property: keyof UserStat, event: Event) => {
            const target = event.target as HTMLInputElement | null;
            if (target) {
                const value = target.value;
                let parsedValue: any = value;

                const propertyType = typeof userStats.value[property];

                if (propertyType === 'number') {
                    parsedValue = Number(value);
                    if (isNaN(parsedValue)) {
                        parsedValue = 0;
                    }
                } else if (propertyType === 'boolean') {
                    parsedValue = value === 'true';
                }

                userStats.value[property] = parsedValue;
            }
        };

        const saveUserStats = async () => {
            try {
                await addUserStats(userStats.value);
                console.log('User stats saved successfully');
                router.push({ name: 'Home' });
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

        onUnmounted(() => {
            saveUserStats();
        });

        return {
            step,
            user,
            userStats,
            nextStep,
            prevStep,
            saveUserStats,
            updateUserStat,
            formattedDateOfBirth
        }
    }
});

</script>
<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/User';
import {
  addUserStats,
  getUserStat,
  ProfileStats,
} from '@/services/UserStats';
import UserStatsPercentages from '@/components/UserStatsPercentages.vue';

export default defineComponent({
  name: 'ProfilePage',
  components: {
    UserStatsPercentages
  },
  setup(props, { emit }) { // Correctly destructure emit
    const userStore = useUserStore();
    const user = userStore.user;
    const excludedKeys = ref([
      'id',
      'uuid',
      'providerid',
      'profilepic',
      'profilecreated',
    ]);
    const isEditing = ref(false);

    const userStats = ref<ProfileStats>({} as ProfileStats);
    const editUserStats = ref<ProfileStats>({} as ProfileStats);

    const keyDisplayNames: Record<string, string> = {
      username: 'Username',
      firstname: 'First Name',
      lastname: 'Last Name',
      email: 'Email',
      lastlogin: 'Last Login Date',
      providername: 'Authentication Method'
    };
    const isFormValid = ref(true);

    const handleValidityUpdate = (isValid: boolean) => {
      isFormValid.value = isValid;
    };

    const fetchUserStats = async () => {
      try {
        const stats = await getUserStat() as ProfileStats;
        if (stats && 'weight' in stats && 'height' in stats) {
          userStats.value = stats;
        }
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
      }
    };

    const saveUserStats = async () => {
      try {
        await addUserStats(editUserStats.value);
        // Update userStats with the saved data
        userStats.value = { ...editUserStats.value };
        // Exit editing mode
        isEditing.value = false;
      } catch (error) {
        console.error('Failed to save user stats:', error);
      }
    };

    const formattedDateOfBirth = computed({
      get() {
        const stats = isEditing.value ? editUserStats.value : userStats.value;
        if (!stats.dateofbirth) {
          return '';
        }
        const date = new Date(stats.dateofbirth);
        return date.toISOString().split('T')[0];
      },
      set(value: string) {
        if (isEditing.value) {
          editUserStats.value.dateofbirth = new Date(value);
        }
      },
    });

    const startEditing = () => {
      editUserStats.value = JSON.parse(JSON.stringify(userStats.value));
      isEditing.value = true;
    };

    const cancelEditing = () => {
      isEditing.value = false;
      // Optionally reset editUserStats to an empty object
      editUserStats.value = {} as ProfileStats;
      if (!isEditing.value) {
        // Emit event to reset warning state
        emit('reset-warning');
      }
    };

    onMounted(() => {
      fetchUserStats();
    });

    return {
      user,
      userStats,
      editUserStats,
      saveUserStats,
      formattedDateOfBirth,
      fetchUserStats,
      excludedKeys,
      isEditing,
      isFormValid,
      startEditing,
      cancelEditing,
      keyDisplayNames,
      handleValidityUpdate
    };
  },
});
</script>

<template>
  <div class="row">
    <!-- User Info Card -->
    <div class="col-12 col-md-4 mb-3 d-flex">
      <div class="card flex-fill">
        <div class="card-header">
          <h2 class="mb-0">{{ user?.username }}</h2>
        </div>
        <div class="card-body">
          <div class="d-flex justify-content-center mb-3">
            <img :src="user?.profilepic" alt="avatar" class="img-fluid rounded-circle">
          </div>
          <div v-for="(value, key) in user" :key="key">
            <p v-if="!excludedKeys.includes(key)">
              <strong>{{ keyDisplayNames[key as string] || key.charAt(0).toUpperCase() + key.slice(1) }}</strong>:
              <span v-if="key === 'lastlogin' && value">{{ new Date(value as Date).toLocaleString() }}</span>
              <span v-else>{{ value }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Details Card -->
    <div class="col-12 col-md-8 mb-3 d-flex">
      <div class="card flex-fill">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h2 class="mb-0">Profile Details</h2>
          <div class="d-flex justify-content-end">
            <button v-if="!isEditing" class="btn btn-outline-primary me-2" @click="startEditing">
              <font-awesome-icon :icon="['fas', 'pencil']" />  Edit
            </button>
          </div>
        </div>

        <div class="card-body">
          <form @submit.prevent="saveUserStats">
            <!-- Weight and Height -->
            <div class="row">
              <div class="col-12 col-md-6 mb-3">
                <label for="weight" class="form-label"><strong>Weight</strong> <span v-if="isEditing">(lbs)</span></label>
                <div v-if="!isEditing">{{ userStats.weight }} lbs</div>
                <input v-else type="number" placeholder="Enter weight in pounds" class="form-control" id="weight"
                  v-model.number="editUserStats.weight" />
              </div>
              <div class="col-12 col-md-6 mb-3">
                <label for="height" class="form-label"><strong>Height</strong> <span v-if="isEditing">(inches)</span></label>
                <div v-if="!isEditing">{{ userStats.height }} inches</div>
                <input v-else type="number" placeholder="Enter height in inches" class="form-control" id="height"
                  v-model.number="editUserStats.height" />
              </div>
            </div>

            <!-- Calorie Goal and Date of Birth -->
            <div class="row">
              <div class="col-12 col-md-6 mb-3">
                <label for="calorieGoal" class="form-label"><strong>Calorie Goal</strong></label>
                <div v-if="!isEditing">{{ userStats.caloriegoal }}</div>
                <input v-else type="number" placeholder="Enter calorie goal" class="form-control"
                  id="calorieGoal" v-model.number="editUserStats.caloriegoal">
                <div class="form-text">Recommended calorie goal: {{ userStats.recommendedcaloriegoal }}</div>
              </div>
              <div class="col-12 col-md-6 mb-3">
                <label for="dob" class="form-label"><strong>Date of Birth</strong></label>
                <div v-if="!isEditing">{{ formattedDateOfBirth }}</div>
                <input v-else type="date" placeholder="Enter date of birth" class="form-control" id="dob"
                  v-model="formattedDateOfBirth" />
              </div>
            </div>
            <!-- Goal and Activity Level -->
            <div class="row">
              <div class="col-12 col-md-6 mb-3">
                <label for="goal" class="form-label"><strong>Goal</strong></label>
                <div v-if="!isEditing">
                  <span v-if="userStats.goal == 1">Lose Weight</span>
                  <span v-else-if="userStats.goal == 2">Maintain Weight</span>
                  <span v-else-if="userStats.goal == 3">Gain Weight</span>
                </div>
                <select v-else class="form-select" id="goal" v-model.number="editUserStats.goal">
                  <option value="1">Lose Weight</option>
                  <option value="2">Maintain Weight</option>
                  <option value="3">Gain Weight</option>
                </select>
              </div>
              <div class="col-12 col-md-6 mb-3">
                <label for="activitylevel" class="form-label"><strong>Activity Level</strong></label>
                <div v-if="!isEditing">
                  <!-- Display activity level based on userStats.activitylevel -->
                  <span v-if="userStats.activitylevel == 1">Sedentary</span>
                  <span v-else-if="userStats.activitylevel == 2">Lightly Active</span>
                  <span v-else-if="userStats.activitylevel == 3">Moderately Active</span>
                  <span v-else-if="userStats.activitylevel == 4">Very Active</span>
                  <span v-else-if="userStats.activitylevel == 5">Super Active</span>
                </div>
                <select v-else class="form-select" id="activitylevel" v-model.number="editUserStats.activitylevel">
                  <option value="1">Sedentary</option>
                  <option value="2">Lightly Active</option>
                  <option value="3">Moderately Active</option>
                  <option value="4">Very Active</option>
                  <option value="5">Super Active</option>
                </select>
              </div>
            </div>

            <!-- Sex and Percentages -->
            <div class="row">
              <div class="col-12 col-md-6 mb-3">
                <label for="sex" class="form-label"><strong>Sex</strong></label>
                <div v-if="!isEditing">
                  {{ userStats.sex === 1 ? 'Male' : 'Female' }}
                </div>
                <select v-else class="form-select" id="sex" v-model.number="editUserStats.sex">
                  <option value="1">Male</option>
                  <option value="2">Female</option>
                </select>
              </div>
              <user-stats-percentages :is-editing="isEditing" :user-stats="userStats" :edit-user-stats="editUserStats"
                @reset-warning="handleValidityUpdate(false)" @update-validity="handleValidityUpdate" />
            </div>

            <!-- Buttons -->
            <div class="d-flex justify-content-end">
              <button v-if="isEditing" type="submit" class="btn btn-primary" :disabled="!isFormValid">
                Save Changes
              </button>
              <button v-if="isEditing" type="button" class="btn btn-secondary ms-2" @click="cancelEditing">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
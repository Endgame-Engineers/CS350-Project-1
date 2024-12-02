import { defineStore } from 'pinia';
import { ProfileStats } from '@/services/UserStats';
import { useLocalStorage } from '@vueuse/core';

export const useUserWelcomeStore = defineStore('userWelcome', {
    state: () => ({
        userStat: useLocalStorage<ProfileStats>('userStat', {
            weight: null,
            height: null,
            dateofbirth: null,
            sex: 1,
            activitylevel: 1,
            goal: 1,
            caloriegoal: null,
            watergoal: null,
            proteinpercentage: 0,
            fatpercentage: 0,
            carbpercentage: 0,
        } as ProfileStats),
    }),

    actions: {
        setUserStat(userStat: ProfileStats) {
            // Update the entire reactive object
            this.userStat = userStat;
        },

        getUserStat(): ProfileStats {
            return this.userStat;
        },

        resetWelcomeStore() {
            this.userStat = {
                weight: null,
                height: null,
                dateofbirth: null,
                sex: 1,
                activitylevel: 1,
                goal: 1,
                caloriegoal: null,
                watergoal: null,
                proteinpercentage: 0,
                fatpercentage: 0,
                carbpercentage: 0,
            } as ProfileStats;
            localStorage.removeItem('userStat');
        }
    },
});

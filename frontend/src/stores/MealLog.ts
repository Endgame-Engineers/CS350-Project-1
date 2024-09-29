import { defineStore } from 'pinia';
import { MealLog } from '@/models/Models';

export const useMealLogStore = defineStore('mealLog', {
    state: () => ({
        mealLog: {
            mealtype: '',
            dateadded: '',
            barcode: '',
            servingconsumed: 0,
        } as MealLog,
    }),

    actions: {
        setMealLog(mealLog: MealLog) {
            this.mealLog = mealLog;
        },

        getMealLog() {
            return this.mealLog;
        },

        clearMealLog() {
            this.mealLog = {
                mealtype: '',
                dateadded: '',
                barcode: '',
                servingconsumed: 0,
            } as MealLog
        },
    },
});
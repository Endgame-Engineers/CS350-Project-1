import { defineStore } from 'pinia';
import { MealLog, MealType } from '../models/Models';

export const useMealLogStore = defineStore('mealLog', {
  state: () => ({
    mealLog: {
      mealtype: 'Breakfast' as MealType, // Default to a valid MealType
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
        mealtype: 'Breakfast', // Default to a valid MealType
        dateadded: undefined,
        barcode: '',
        servingconsumed: 0,
      } as MealLog;
    },
  },
});
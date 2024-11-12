import { defineStore } from 'pinia';
import { MealLog, MealType } from '../models/Models';

export const useLogStore = defineStore('mealLog', {
  state: () => ({
    mealLog: {
      mealtype: 'Breakfast' as MealType, // Default to a valid MealType
      barcode: '',
      servingconsumed: 0,
    } as MealLog,
    selectedType: 'Breakfast' as string, // Default to a valid MealType
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

    setSelectedLogType(selectedType: string) {
      this.selectedType = selectedType;
    },

    getSelectedLogType() {
      return this.selectedType;
    },
  },
});
import { defineStore } from 'pinia';
import { MealLog, MealType } from '../models/Models';
import { useLocalStorage } from '@vueuse/core';

export const useLogStore = defineStore('mealLog', {
  state: () => ({
    mealLog: {
      mealtype: 'Breakfast' as MealType, // Default to a valid MealType
      barcode: '',
      servingconsumed: 0,
    } as MealLog,
    selectedType: useLocalStorage<string>('selectedMealType', 'Breakfast' as string), 
    currentDate: useLocalStorage<Date>('currentDate', new Date() as Date),
    selectedGraphType: useLocalStorage<string>('selectedGraphType', 'calories' as string),
    selectedGraphStartDate: useLocalStorage<Date>('selectedGraphStartDate', new Date(new Date().getFullYear(), new Date().getMonth(), 1) as Date),
    selectedGraphEndDate: useLocalStorage<Date>('selectedGraphEndDate', new Date() as Date),
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
      mealtype: this.mealLog.mealtype, // Retain the current meal type
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

    setCurrentDate(currentDate: Date) {
      this.currentDate = currentDate;
    },

    getCurrentDate() {
      return this.currentDate;
    },

    setSelectedGraphType(selectedGraphType: string) {
      this.selectedGraphType = selectedGraphType;
    },

    getSelectedGraphType() {
      return this.selectedGraphType;
    },

    setSelectedGraphStartDate(selectedGraphStartDate: Date) {
      this.selectedGraphStartDate = selectedGraphStartDate;
    },

    getSelectedGraphStartDate() {
      return this.selectedGraphStartDate;
    },

    setSelectedGraphEndDate(selectedGraphEndDate: Date) {
      this.selectedGraphEndDate = selectedGraphEndDate;
    },

    getSelectedGraphEndDate() {
      return this.selectedGraphEndDate;
    },
  },
});
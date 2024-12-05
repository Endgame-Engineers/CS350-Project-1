// TODO: Carlos
import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useLogStore } from '../../src/stores/Log';
import { MealLog } from '../../src/models/Models';

describe('Log Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should set and get the meal log', () => {
    const logStore = useLogStore();

    const newMealLog: MealLog = {
      mealtype: 'Lunch',
      barcode: '123456789',
      servingconsumed: 2,
    };

    logStore.setMealLog(newMealLog);

    const mealLog = logStore.getMealLog();
    expect(mealLog).toEqual(newMealLog);
  });

  it('should clear the meal log while retaining the current meal type', () => {
    const logStore = useLogStore();

    const initialMealLog: MealLog = {
      mealtype: 'Snack',
      barcode: '987654321',
      servingconsumed: 3,
    };

    logStore.setMealLog(initialMealLog);
    logStore.clearMealLog();

    const clearedMealLog = logStore.getMealLog();
    expect(clearedMealLog).toEqual({
      mealtype: 'Snack',
      barcode: '',
      servingconsumed: 0,
    });
  });

  it('should set and get the selected meal type', () => {
    const logStore = useLogStore();

    logStore.setSelectedLogType('Dinner');
    const selectedType = logStore.getSelectedLogType();

    expect(selectedType).toBe('Dinner');
  });

  it('should set and get the current date', () => {
    const logStore = useLogStore();

    const newDate = new Date('2023-12-01');
    logStore.setCurrentDate(newDate);

    const currentDate = logStore.getCurrentDate();
    expect(currentDate).toEqual(newDate);
  });
});

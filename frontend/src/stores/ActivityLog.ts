import { defineStore } from 'pinia';
import { ActivityLog } from '../models/Models';

export const useActivityLogStore = defineStore('activityLog', {
    state: () => ({
        activityLog: [] as ActivityLog[],
    }),

    actions: {
        setActivityLog(activityLog: ActivityLog[]) {
            this.activityLog = activityLog;
        },

        getActivityLog() {
            return this.activityLog;
        },

        clearActivityLog() {
            this.activityLog = [];
        },
    },
});
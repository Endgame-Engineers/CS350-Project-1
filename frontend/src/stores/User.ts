
import { defineStore } from 'pinia';
import { User } from '@/models/Models';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: {
            username: '',
            email: '',
            firstname: '',
            lastname: '',
            uuid: '',
            providername: '',
            providerid: '',
            profilepic: '',
        } as User,
        isAuthenticated: false,
    }),

    actions: {
        setUser(user: User) {
            this.user = user;
        },

        clearUser() {
            this.user = {
                username: '',
                email: '',
                firstname: '',
                lastname: '',
                uuid: '',
                providername: '',
                providerid: '',
                profilepic: '',
            } as User
        },

        setAuthenticated(isAuthenticated: boolean) {
            this.isAuthenticated = isAuthenticated;
        },
    },
});

import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        users: [] as string[],
    }),
    actions: {
        addUser(name: string) {
            this.users.push(name)
        },
    },
})

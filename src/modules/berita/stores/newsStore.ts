import { defineStore } from 'pinia'

export const useNewsStore = defineStore('news', {
    state: () => ({
        news: [] as string[],
    }),
    actions: {
        addNews(title: string) {
            this.news.push(title)
        },
    },
})

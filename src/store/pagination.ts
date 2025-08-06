import { useApiUrl } from '@/composables/apiUtils'
import { defineStore } from 'pinia'

export const usePaginationStore = defineStore('pagination', {
  state: () => ({
    page: 1,
    per_page: 10,
  }),

  getters: {
    getCurrentPage: state => state.page,
    getCurrentPageSize: state => state.per_page,

    getPaginatedApiUrl: (state) => {
      const url = useApiUrl()
      const [_page, _limit] = [state.page.toString(), state.per_page.toString()]

      const params = new URLSearchParams({ _page, _limit })
      url.search = params.toString()

      return url.toString()
    },
  },

  actions: {
    updatePage(n: number) {
      this.page = n
    },

    next() {
      ++this.page
    },

    previous() {
      this.page = Math.min(1, this.page - 1)
    },
  },
})

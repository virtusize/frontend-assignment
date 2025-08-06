<script setup lang="ts">
import { usePaginationStore } from '@/store/pagination'
import { storeToRefs } from 'pinia'
import { useClientStore } from '@/store/client'
import { watchImmediate } from '@vueuse/core'

const paginationStore = usePaginationStore()
const { getCurrentPage, getCurrentPageSize } = storeToRefs(paginationStore)

const clientStore = useClientStore()
const { getClientsLength } = storeToRefs(clientStore)

watchImmediate(getCurrentPage, (currentPage) => {
  clientStore.fetchClientsByPage(currentPage)
})

</script>

<template>
  <ClientTable />
  <UPagination
    :page="getCurrentPage"
    :items-per-page="getCurrentPageSize"
    :total="getClientsLength"
    class="flex w-full items-center justify-center"
    @update:page="paginationStore.updatePage($event)"
  />
</template>

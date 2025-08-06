<template>
  <UTable
    ref="table"
    :data
    :columns
    :column-visibility
    :loading="isFetching"
  />
</template>

<script setup lang="ts">
import ClientModal from '@/components/ClientModal.vue'
import type { TableColumn } from '@nuxt/ui'
import { h, onMounted, resolveComponent, useTemplateRef } from 'vue'
import type { Row, VisibilityState } from '@tanstack/table-core'
import { showModal } from '@/composables/modalUtils'
import { deleteClient, updateClient } from '@/composables/apiUtils'
import { useClientStore } from '@/store/client'
import { storeToRefs } from 'pinia'
import ConfirmationModal from '@/components/ConfirmationModal.vue'

const UAvatar = resolveComponent('UAvatar')
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const clientStore = useClientStore()
const { isFetching, getClientsByCurrentPage: data } = storeToRefs(clientStore)

const columnVisibility: VisibilityState = {
  id: false,
  currency: false,
  registered: false,
}

const columns = [
  {
    accessorKey: 'id',
  },
  {
    accessorKey: 'picture',
    header: '',
    cell: ({ row }) => {
      return h(UAvatar, { src: row.getValue('picture'), alt: row.getValue('name'), size: 'xl' })
    },
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'age',
    header: 'Age',
  },
  {
    accessorKey: 'company',
    header: 'Company',
  },
  {
    accessorKey: 'currency',
  },
  {
    accessorKey: 'registered',
  },
  {
    accessorKey: 'subscriptionCost',
    header: 'Subscription Cost',
    cell: ({ row }) => {
      const n = Number(row.getValue('subscriptionCost'))
      const color = n >= 2_000
        ? 'success'
        : n >= 1_000
          ? 'info'
          : 'neutral'

      return h(UBadge, { color, variant: 'subtle' }, () =>
        new Intl.NumberFormat(undefined,
          {
            style: 'currency',
            currency: row.getValue('currency'),
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(n),
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            'content': {
              align: 'end',
            },
            'items': getRowItems(row),
            'aria-label': 'Actions dropdown',
          },
          () =>
            h(UButton, {
              'icon': 'i-lucide-ellipsis-vertical',
              'color': 'neutral',
              'variant': 'ghost',
              'class': 'ml-auto cursor-pointer',
              'aria-label': 'Actions dropdown',
            }),
        ),
      )
    },
  },
] satisfies TableColumn<Client>[]

const table = useTemplateRef('table')
onMounted(() => {
  if (!table.value?.tableRef) return

  const colgroup = document.createElement('colgroup')
  columns.forEach((column) => {
    if (Object.hasOwn(columnVisibility, column.accessorKey ?? '')) return

    const col = document.createElement('col')
    col.classList.add('w-64')

    colgroup.appendChild(col)
  })

  table.value.tableRef.prepend(colgroup)
})

function getRowItems(row: Row<Client>) {
  return [
    {
      label: 'View details',
      icon: 'i-lucide-user',
      class: 'cursor-pointer',
      onSelect() {
        const modal = showModal(ClientModal, {
          client: row.original,
          onSubmit: async (data) => {
            await updateClient(data)
            modal.close()
          },
        })
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'Delete client',
      color: 'error',
      icon: 'i-lucide-trash-2',
      class: 'cursor-pointer',
      onSelect() {
        const modal = showModal(ConfirmationModal, {
          client: row.original,
          onSubmit: async (data) => {
            await deleteClient(data)
            modal.close()
          },
        })
      },
    },
  ]
}

</script>

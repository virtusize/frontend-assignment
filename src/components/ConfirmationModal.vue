<template>
  <UModal
    :title
    :description
  >
    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        :validate
        class="space-y-4"
        @submit.prevent="onSubmit"
      >
        <UAlert
          color="error"
          variant="outline"
          title="This action cannot be undone."
          icon="i-lucide-octagon-alert"
        >
          <template #description>
            <p class="text-default">
              This will permanently delete the record of <strong class="underline">{{ client.name }}</strong> and remove all their client information assosiations.
            </p>
          </template>
        </UAlert>

        <UInput
          :model-value="client.id"
          type="hidden"
          class="hidden"
        />

        <UInput
          :model-value="client.name"
          type="hidden"
          class="hidden"
        />

        <UFormField
          label="Please type in the name of the client to confirm."
          name="consent"
          required
        >
          <UInput
            v-model="state.consent"
            class="w-full"
          />
        </UFormField>

        <UButton
          type="submit"
          color="error"
          class="w-full cursor-pointer justify-center"
        >
          I understand, delete this client
        </UButton>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import { reactive, toRefs } from 'vue'

export interface ClientModalProps {
  title?: string
  description?: string
  client?: Partial<Client>
}

const props = withDefaults(defineProps<ClientModalProps>(), {
  title: 'Are you sure?',
  description: '',
  client: () => ({ id: 'undefined', currency: 'USD' }),
})
const { client, title, description } = toRefs(props)
const state = reactive({ ...client.value, consent: '' })

const schema = z.object({
  id: z.string(),
  name: z.string(),
  consent: z.string(),
})

export type ConfirmationSchema = z.output<typeof schema>

const validate = (state: Partial<{
  consent: string
}>): FormError[] => {
  const errors = []
  if (state.consent !== client.value.name) errors.push({ name: 'name', message: 'Please enter the correct, underlined name.' })
  return errors
}

const emit = defineEmits<{
  submit: [data: ConfirmationSchema]
}>()

async function onSubmit(event: FormSubmitEvent<ConfirmationSchema>) {
  emit('submit', event.data)
}
</script>

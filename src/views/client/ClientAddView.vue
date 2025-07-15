<template>
  <div>
    <a-spin :spinning="isLoading">
      <form @submit.prevent="onSubmit">
        <Descriptions bordered :column="1" title="Add Client" size="middle">
          <DescriptionsItem label="Picture">
            <div style="display: flex; flex-direction: column; align-items: flex-start">
              <Image
                v-if="client.picture"
                :height="120"
                :src="client.picture"
                style="margin-bottom: 8px"
                @error="onImageError"
              />
              <Upload
                accept="image/*"
                :show-upload-list="false"
                :before-upload="() => false"
                @change="handleImageChange"
              >
                <Button @click="() => $refs.uploadRef && ($refs.uploadRef as any).click()"
                  >Select File</Button
                >
                <input
                  ref="uploadRef"
                  type="file"
                  accept="image/*"
                  style="display: none"
                  @change="onNativeFileChange"
                />
              </Upload>
            </div>
          </DescriptionsItem>
          <DescriptionsItem label="Registered">
            <DateInput
              v-model="client.registered"
              required
              blockSucceedingDates
              id="client-registered"
              format="YYYY-MM-DD"
            />
          </DescriptionsItem>
          <DescriptionsItem label="Name">
            <TextInput v-model="client.name" required id="client-name" />
          </DescriptionsItem>
          <DescriptionsItem label="Company">
            <TextInput v-model="client.company" required id="client-company" />
          </DescriptionsItem>
          <DescriptionsItem label="Gender">
            <DropdownInput
              v-model="client.gender"
              required
              id="client-gender"
              :items="['Male', 'Female']"
              placeholder="Select gender"
            />
          </DescriptionsItem>
          <DescriptionsItem label="Age">
            <NumberInput v-model="client.age" required id="client-age" />
          </DescriptionsItem>

          <DescriptionsItem label="Currency">
            <TextInput v-model="client.currency" required id="client-currency" />
          </DescriptionsItem>
          <DescriptionsItem label="Subscription Cost">
            <NumberInput v-model="client.subscriptionCost" required id="client-subscription-cost" />
          </DescriptionsItem>
        </Descriptions>

        <div class="actions">
          <Button type="primary" html-type="submit" :disabled="isLoading">Add Client</Button>
          <Button :disabled="isLoading" @click="resetForm">Reset</Button>
          <RouterLink to="/clients">
            <Button :disabled="isLoading">Back</Button>
          </RouterLink>
        </div>
      </form>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Descriptions, DescriptionsItem, Button, Image, Upload, Modal } from 'ant-design-vue'
import TextInput from '@/components/inputs/TextInput.vue'
import NumberInput from '@/components/inputs/NumberInput.vue'
import DropdownInput from '@/components/inputs/DropdownInput.vue'
import DateInput from '@/components/inputs/DateInput.vue'
import { addClient as addClientService } from '@/services/clients/addClient.ts'
import { Spin as ASpin } from 'ant-design-vue'
import imageNotFound from '@/assets/images/image-not-found.png'
import { useRouter } from 'vue-router'

const router = useRouter()

const isLoading = ref(false)

const defaultClient = () => ({
  picture: '',
  name: '',
  company: '',
  gender: '',
  age: 0,
  ageString: '0',
  registered: '',
  currency: '',
  subscriptionCost: '0',
})

const client = ref(defaultClient())

async function onSubmit() {
  client.value.age = Number(client.value.ageString) || 0
  client.value.ageString = String(client.value.age)
  isLoading.value = true
  try {
    const [, error] = await addClientService({
      ...client.value,
      age: client.value.age,
      subscriptionCost: String(Number(client.value.subscriptionCost) || 0),
      picture: client.value.picture,
    })
    if (!error) {
      router.push('/clients')
      Modal.success({
        title: 'Client Added',
        content: 'The client has been successfully added.',
      })
    } else {
      Modal.error({
        title: 'Add Client Failed',
        content: error?.message || 'An error occurred while adding the client.',
      })
    }
  } finally {
    isLoading.value = false
  }
}

function resetForm() {
  client.value = defaultClient()
}

function onImageError(e: Event | string) {
  if (typeof e !== 'string' && e?.target) {
    ;(e.target as HTMLImageElement).src = imageNotFound
  }
}

import type { UploadChangeParam } from 'ant-design-vue/es/upload/interface'

function handleImageChange(info: UploadChangeParam) {
  const file = info.file?.originFileObj
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      client.value.picture = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// Handles native file input change event and adapts it to UploadChangeParam
function onNativeFileChange(event: Event) {
  const input = event.target as HTMLInputElement | null
  if (!input || !input.files || input.files.length === 0) return
  const fileObj = input.files[0]
  const uploadFile = {
    originFileObj: fileObj,
    uid: Date.now().toString(),
    name: fileObj.name || 'file',
  }
  handleImageChange({
    file: uploadFile,
    fileList: [uploadFile],
  } as UploadChangeParam)
}
</script>

<style scoped>
.actions {
  margin-top: 16px;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
</style>

<template>
  <div>
    <a-spin :spinning="isLoading">
      <form @submit.prevent="onSubmit">
        <Descriptions bordered :column="1" title="Client Details" size="middle">
          <DescriptionsItem label="Picture">
            <template v-if="editMode">
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
            </template>
            <template v-else>
              <Image :height="200" :src="client.picture" @error="onImageError" />
            </template>
          </DescriptionsItem>
          <DescriptionsItem label="Name">
            <template v-if="editMode">
              <TextInput v-model="client.name" required id="client-name" />
            </template>
            <template v-else>
              {{ client.name }}
            </template>
          </DescriptionsItem>
          <DescriptionsItem label="Company">
            <template v-if="editMode">
              <TextInput v-model="client.company" required id="client-company" />
            </template>
            <template v-else>
              {{ client.company }}
            </template>
          </DescriptionsItem>
          <DescriptionsItem label="Gender">
            <template v-if="editMode">
              <DropdownInput
                v-model="client.gender"
                required
                id="client-gender"
                :items="['Male', 'Female']"
                placeholder="Select gender"
              />
            </template>
            <template v-else>
              {{ client.gender }}
            </template>
          </DescriptionsItem>
          <DescriptionsItem label="Age">
            <template v-if="editMode">
              <NumberInput v-model="client.age" required id="client-age" />
            </template>
            <template v-else>
              {{ client.age }}
            </template>
          </DescriptionsItem>
          <DescriptionsItem label="Registered">
            {{ client.registered }}
          </DescriptionsItem>
          <DescriptionsItem label="Currency">
            <template v-if="editMode">
              <TextInput v-model="client.currency" required id="client-currency" />
            </template>
            <template v-else>
              {{ client.currency }}
            </template>
          </DescriptionsItem>
          <DescriptionsItem label="Subscription Cost">
            <template v-if="editMode">
              <NumberInput
                v-model="client.subscriptionCost"
                required
                id="client-subscription-cost"
              />
            </template>
            <template v-else>
              {{ client.subscriptionCost }}
            </template>
          </DescriptionsItem>
        </Descriptions>

        <div class="actions">
          <Button type="primary" @click="toggleEdit" v-if="!editMode" :disabled="isLoading">
            Edit
          </Button>
          <Button type="primary" html-type="submit" v-else :disabled="isLoading">Save</Button>
          <Button :disabled="!editMode || isLoading" @click="cancelEdit">Cancel</Button>
          <RouterLink to="/clients">
            <Button :disabled="isLoading">Back</Button>
          </RouterLink>
        </div>
      </form>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Descriptions, DescriptionsItem, Button, Image, Modal } from 'ant-design-vue'
import TextInput from '@/components/inputs/TextInput.vue'
import NumberInput from '@/components/inputs/NumberInput.vue'
import DropdownInput from '@/components/inputs/DropdownInput.vue'
import { getClient } from '@/services/clients/getClient'
import { updateClient } from '@/services/clients/updateClient'
import { useRoute } from 'vue-router'
import { Spin as ASpin } from 'ant-design-vue'
import imageNotFound from '@/assets/images/image-not-found.png'

const editMode = ref(false)
const isLoading = ref(false)
const dataSource = ref([])

const route = useRoute()
const clientID = ref(Array.isArray(route.params.id) ? route.params.id[0] : route.params.id)

const client = ref({
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

onMounted(async () => {
  isLoading.value = true
  const [response, error] = await getClient(clientID.value)
  if (error) {
    dataSource.value = []
    isLoading.value = false
    return
  }
  if (response != null) {
    client.value = {
      picture: response?.picture || '',
      name: response.name,
      company: response.company,
      gender: response.gender,
      age: Number(response?.age ?? 0),
      ageString: String(
        typeof response?.age === 'number' ? response?.age : Number(response?.age) || 0,
      ),
      registered: response.registered
        ? new Date(response.registered)
            .toLocaleDateString('sv-SE', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              timeZoneName: 'short',
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            })
            .replace(/\//g, '-')
        : '',
      currency: response?.currency || '',
      subscriptionCost:
        typeof response?.subscriptionCost === 'number'
          ? String(response?.subscriptionCost)
          : String(Number(response?.subscriptionCost) || 0),
    }
  } else {
    dataSource.value = []
  }
  isLoading.value = false
})

async function toggleEdit() {
  editMode.value = true
}

async function onSubmit() {
  if (!editMode.value) return
  // Save: parse ageString to age as number
  client.value.age = Number(client.value.ageString) || 0
  client.value.ageString = String(client.value.age)
  isLoading.value = true

  try {
    const [, error] = await updateClient(clientID.value, {
      ...client.value,
      age: client.value.age,
      subscriptionCost: String(Number(client.value.subscriptionCost) || 0),
      picture: client.value.picture, // This will be base64 if changed
    })
    if (!error) {
      editMode.value = false
      Modal.success({
        title: 'Success',
        content: 'Client updated successfully.',
      })
    } else {
      Modal.error({
        title: 'Error',
        content: error.message || 'Failed to update client. Please try again.',
      })
    }
  } finally {
    isLoading.value = false
  }
}

function cancelEdit() {
  editMode.value = false
}

function onImageError(e: Event | string) {
  if (typeof e !== 'string' && e?.target) {
    ;(e.target as HTMLImageElement).src = imageNotFound
  }
}

// Handles image file selection and updates client.picture with a preview
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

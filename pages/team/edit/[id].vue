<script setup lang="ts">
import { useMutation, useQuery } from '@tanstack/vue-query'
import { v4 as uuid } from 'uuid'
import { COLLECTION_TEAM, DB_ID, STORAGE_ID } from '~/app.constants'
import type { ICustomer } from '~/types/deals.types'
import Swal from 'sweetalert2'
import { useForm } from 'vee-validate';
import * as yup from 'yup';

interface InputFileEvent extends Event {
  target: HTMLInputElement
}

interface ICustomerFormState
    extends Pick<ICustomer, 'avatar_url' | 'email' | 'name' | 'position' | 'role' > {}

useSeoMeta({
  title: `Edit member | INFINITY`,
})

const route = useRoute()
const customerId = route.params.id as string

const { handleSubmit, defineField, setFieldValue, setValues, values, errors } =
    useForm<ICustomerFormState>({
      validationSchema: yup.object({
        name: yup
            .string()
            .min(3)
            .max(40)
            .required(),
        position: yup
            .string()
            .min(3)
            .max(100),
        role: yup
            .string()
            .max(40),
        email: yup
            .string()
            .email()
      }),
    })

const { data, isSuccess } = useQuery({
  queryKey: ['get employee', customerId],
  queryFn: () => DB.getDocument(DB_ID, COLLECTION_TEAM, customerId),
})

watch(isSuccess, () => {
  const initialData = data.value as unknown as ICustomerFormState
  setValues({
    email: initialData.email,
    avatar_url: initialData.avatar_url,
    position: initialData.position,
    role: initialData.role,
    name: initialData.name,
  })
})

const [name, nameAttrs] = defineField('name')
const [email, emailAttrs] = defineField('email')
const [role, roleAttrs] = defineField('role')
const [position, positionAttrs] = defineField('position')

const { mutate, isPending } = useMutation({
  mutationKey: ['update customer', customerId],
  mutationFn: (data: ICustomerFormState) =>
      DB.updateDocument(DB_ID, COLLECTION_TEAM, customerId, data),
  onSuccess() {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Your work has been saved",
      showConfirmButton: false,
      timer: 1500
    });
  }
})

const { mutate: uploadImage, isPending: isUploadImagePending } = useMutation({
  mutationKey: ['upload image'],
  mutationFn: (file: File) => storage.createFile(STORAGE_ID, uuid(), file),
  onSuccess(data) {
    const response = storage.getFileDownload(STORAGE_ID, data.$id)
    setFieldValue('avatar_url', response.href)
  },
})

const onSubmit = handleSubmit(values => {
  mutate(values)
})
</script>

<template>
  <div class="p-10">
    <h1 class="font-bold text-2xl mb-10">
      Edit staff member {{ (data as unknown as ICustomerFormState)?.name }}
    </h1>

    <form @submit="onSubmit" class="form">
      <p>Назва</p>
      <UiInput
          placeholder="Назва"
          v-model="name"
          v-bind="nameAttrs"
          type="text"
          class="input"
      />
      <pre class="error">{{ errors.name }}</pre>

      <p>Email</p>
      <UiInput
          placeholder="Email"
          v-model="email"
          v-bind="emailAttrs"
          type="text"
          class="input"
      />
      <pre class="error">{{ errors.email }}</pre>

      <p>Роль</p>
      <UiInput
          placeholder="Роль"
          v-model="role"
          v-bind="roleAttrs"
          type="text"
          class="input"
      />
      <pre class="error">{{ errors.role }}</pre>

      <p>Позиція</p>
      <UiInput
          placeholder="Роль"
          v-model="position"
          v-bind="positionAttrs"
          type="text"
          class="input"
      />
      <pre class="error">{{ errors.position }}</pre>

      <img
          v-if="values.avatar_url || isUploadImagePending"
          :src="values.avatar_url"
          alt=""
          width="50"
          height="50"
          class="rounded-full my-4"
      />
      <div class="grid w-full max-w-sm items-center gap-1.5 input">
        <label>
          <div class="text-sm mb-2">Логотип</div>
          <UiInput
              type="file"
              :onchange="(e:InputFileEvent) => e?.target?.files?.length && uploadImage(e.target.files[0])"
              :disabled="isUploadImagePending"
          />
        </label>
      </div>

      <UiButton :disabled="isPending" variant="secondary" class="mt-3">
        {{ isPending ? 'Завантаження...' : 'Зберегти' }}
      </UiButton>
    </form>
  </div>
</template>

<style scoped>
.input {
  @apply border-[#161c26] mb-4 placeholder:text-[#748092] focus:border-border transition-colors;
}

.error {
  @apply text-red-500;
}
</style>

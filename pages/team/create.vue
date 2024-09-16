<script setup lang="ts">
import {useMutation} from '@tanstack/vue-query'
import {COLLECTION_TEAM, DB_ID, STORAGE_ID} from '~/app.constants'
import type {EnumStatus, ICustomer, IDeal} from "~/types/deals.types";
import {useForm} from "vee-validate";
import * as yup from "yup";
import {v4 as uuid} from "uuid";
import Swal from "sweetalert2";

useSeoMeta({
  title: 'Create employee | INFINITY',
})

const route = useRoute()

interface ICustomerFormState
    extends Pick<ICustomer, 'avatar_url' | 'email' | 'name' | 'position' | 'role' > {}

const { setFieldValue, handleSubmit, defineField, handleReset, errors, values } = useForm<ICustomerFormState>({
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

const [name, nameAttrs] = defineField('name')
const [email, emailAttrs] = defineField('email')
const [position, positionAttrs] = defineField('position')
const [role, roleAttrs] = defineField('role')

const { mutate, isPending } = useMutation({
  mutationKey: ['create a new deal'],
  mutationFn: (data: ICustomerFormState) => DB.createDocument(DB_ID, COLLECTION_TEAM, uuid(), data),
  onSuccess() {
    handleReset(),
    Swal.fire({
      icon: 'success',
      title: 'Успіх!',
      text: 'Картка успішно створена',
    })
  },
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
      Create staff member  {{ (data as unknown as ICustomerFormState)?.name }}
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

      <p>Позиція</p>
      <UiInput
          placeholder="Позиція"
          v-model="position"
          v-bind="positionAttrs"
          type="text"
          class="input"
      />

      <p>Роль</p>
      <UiInput
          placeholder="Роль"
          v-model="role"
          v-bind="roleAttrs"
          type="text"
          class="input"
      />

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

</style>
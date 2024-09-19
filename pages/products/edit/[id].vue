<script setup lang="ts">
import {useMutation, useQuery} from '@tanstack/vue-query'
import {COLLECTION_PRODUCTS, DB_ID} from '~/app.constants'
import Swal from 'sweetalert2'
import {useForm} from 'vee-validate';
import * as yup from 'yup';
import type {IProduct} from "~/types/products.types";
import {format} from "date-fns";

useSeoMeta({
  title: `Edit member | INFINITY`,
})

const route = useRoute()
const customerId = route.params.id as string

const {handleSubmit, defineField, setValues, errors} =
    useForm<IProduct>({
      validationSchema: yup.object({
        name: yup
            .string()
            .min(3)
            .max(40)
            .required(),
        description: yup
            .string()
            .min(3)
            .max(400)
            .required(),
        client: yup
            .string()
            .min(3)
            .max(40)
            .required(),
        status: yup
            .string()
            .min(3)
            .max(20)
            .required(),
        lead: yup
            .string()
            .min(3)
            .max(40)
            .required(),
      }),
    })

const {data, isSuccess} = useQuery({
  queryKey: ['get employee', customerId],
  queryFn: () => DB.getDocument(DB_ID, COLLECTION_PRODUCTS, customerId),
})

watch(isSuccess, () => {
  const initialData = data.value as unknown as IProduct
  setValues({
    name: initialData.name,
    description: initialData.description,
    client: initialData.client,
    status: initialData.status,
    lead: initialData.lead,
    deadline: initialData.deadline,
  })
})

const [name, nameAttrs] = defineField('name')
const [description, descriptionAttrs] = defineField('description')
const [client, clientAttrs] = defineField('client')
const [status, statusAttrs] = defineField('status')
const [lead, leadAttrs] = defineField('lead')
const [deadline, deadlineAttrs] = defineField('deadline', new Date() as any);

const formattedDeadline = computed(() => {
  if (deadline.value && !isNaN(new Date(deadline.value).getTime())) {
    return format(new Date(deadline.value), 'd MMM, yyyy');
  }
  return 'Select a date';
});

const {mutate, isPending} = useMutation({
  mutationKey: ['update product', customerId],
  mutationFn: (data: IProduct) =>
      DB.updateDocument(DB_ID, COLLECTION_PRODUCTS, customerId, data),
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

const onSubmit = handleSubmit(values => {
  mutate(values)
})
</script>

<template>
  <div class="p-10">
    <h1 class="font-bold text-2xl mb-10">
      Edit product
    </h1>

    <form @submit="onSubmit" class="form">
      <p>Name</p>
      <UiInput
          placeholder="Name"
          v-model="name"
          v-bind="nameAttrs"
          type="text"
          class="input"
      />
      <pre class="error">{{ errors.name }}</pre>

      <p class="mt-6">Description</p>
      <UiInput
          placeholder="Description"
          v-model="description"
          v-bind="descriptionAttrs"
          type="text"
          class="input"
      />
      <pre class="error">{{ errors.description }}</pre>

      <p class="mt-6">Client</p>
      <UiInput
          placeholder="Client"
          v-model="client"
          v-bind="clientAttrs"
          type="text"
          class="input"
      />
      <pre class="error">{{ errors.client }}</pre>

      <p class="mt-6">Deadline</p>
      <UPopover :popper="{ placement: 'bottom-start' }">
        <UButton
            icon="i-heroicons-calendar-days-20-solid"
            :label="deadline ? formattedDeadline : 'Select a date'"
        />

        <template #panel="{ close }">
          <DatePicker
              v-model="deadline"
              v-bind="deadlineAttrs"
              is-required
              @close.once="close"
          />
        </template>
      </UPopover>
      <pre class="error">{{ errors.deadline }}</pre>

      <p class="mt-6">Status</p>
      <UiInput
          placeholder="Status"
          v-model="status"
          v-bind="statusAttrs"
          type="text"
          class="input"
      />
      <pre class="error">{{ errors.status }}</pre>

      <p class="mt-6">Lead</p>
      <UiInput
          placeholder="Lead"
          v-model="lead"
          v-bind="leadAttrs"
          type="text"
          class="input"
      />
      <pre class="error">{{ errors.lead }}</pre>


      <UiButton :disabled="isPending" variant="secondary" class="mt-6">
        {{ isPending ? 'Loading...' : 'Save' }}
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

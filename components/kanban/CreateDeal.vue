<script setup lang="ts">
import {useMutation, useQuery} from '@tanstack/vue-query'
import {v4 as uuid} from 'uuid'
import {defineProps} from 'vue'
import {COLLECTION_DEALS, COLLECTION_TEAM, DB_ID} from '~/app.constants'
import type {IDeal, IMember} from '~/types/deals.types'
import Swal from 'sweetalert2';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const isOpenForm = ref(false)

const { data: customers, isLoading } = useQuery({
  queryKey: ['team'],
  queryFn: () => DB.listDocuments(DB_ID, COLLECTION_TEAM),
})
interface IDealFormState extends Pick < IDeal, 'name' | 'description' | 'priority' | 'executants' | 'owner'> {
	customer: {
		email: string
		name: string
	}
	status: string,
}

const props = defineProps({
	status: {
		type: String,
		default: '',
	},
	refetch: {
		type: Function,
	},
})

const { handleSubmit, defineField, handleReset, errors, values } = useForm<IDealFormState>({
	initialValues: {
		status: props.status,
	},
  validationSchema: yup.object({
    name: yup
        .string()
        .min(3)
        .max(40)
        .required(),
    description: yup
        .string()
        .min(3)
        .max(100)
        .required(),
    priority: yup
        .string()
        .max(20),
    executants: yup
        .array(),
    owner: yup
        .string()
        .max(40),
  }),
})

const [name, nameAttrs] = defineField('name')
const [customerEmail, customerEmailAttrs] = defineField('customer.email')
const [customerName, customerNameAttrs] = defineField('customer.name')
const [description, descriptionAttrs] = defineField('description')
const [priority, priorityAttrs] = defineField('priority')
const [executants, executantsAttrs] = defineField('executants')
const [owner, ownerAttrs] = defineField('owner')

const { mutate, isPending } = useMutation({
	mutationKey: ['create a new deal'],
	mutationFn: (data: IDealFormState) => DB.createDocument(DB_ID, COLLECTION_DEALS, uuid(), data),
	onSuccess() {
		props.refetch && props.refetch()
		handleReset(),
    isOpenForm.value = false
    Swal.fire({
      icon: 'success',
      title: 'Успіх!',
      text: 'Картка успішно створена',
    })
	},
})

const onSubmit = handleSubmit(values => {
	mutate(values)
})

</script>

<template>
	<div class="text-center mb-2">
		<button
			class="transition-all opacity-5 hover:opacity-100 hover:text-[#a252c8]"
			@click="isOpenForm = !isOpenForm"
		>
			<Icon
				v-if="isOpenForm"
				name="radix-icons:arrow-up"
				class="fade-in-100 fade-out-0"
				size="35"
			/>
			<Icon
				v-else
				name="radix-icons:plus-circled"
				class="fade-in-100 fade-out-0"
				size="35"
			/>
		</button>
	</div>
	<form v-if="isOpenForm" @submit="onSubmit" class="form">
        <UiInput
          placeholder="Наименование"
          v-model="name"
          v-bind="nameAttrs"
          type="text"
          class="input"
        />
        <pre class="error">{{ errors.name }}</pre>

        <UiInput
                placeholder="Опис"
                v-model="description"
                v-bind="descriptionAttrs"
                type="text"
                class="input"
        />
        <pre class="error">{{ errors.description }}</pre>

        <UiInput
          placeholder="Email"
          v-model="customerEmail"
          v-bind="customerEmailAttrs"
          type="text"
          class="input"
        />

        <UiInput
          placeholder="Компания"
          v-model="customerName"
          v-bind="customerNameAttrs"
          type="text"
          class="input"
        />

        <UiInput
                placeholder="Приорітет"
                v-model="priority"
                v-bind="priorityAttrs"
                type="text"
                class="input"
        />
        <pre class="error">{{ errors.priority }}</pre>

        <div class="my-3">
            <p>Виконавці:</p>
            <USelectMenu
              v-model="executants"
              v-bind="executantsAttrs"
              :options="customers?.documents as unknown as IMember[]"
              placeholder="Select people"
              value-attribute="name"
              option-attribute="name"
              multiple
            />
        </div>

        <UiInput
                placeholder="Відповідальна особа:"
                v-model="owner"
                v-bind="ownerAttrs"
                type="text"
                class="input"
        />
        <pre class="error">{{ errors.owner }}</pre>

		<button class="btn" :disabled="isPending">
			{{ isPending ? 'Загрузка...' : 'Добавить' }}
		</button>
	</form>
</template>

<style scoped>
.error {
  @apply text-red-500;
  font-size: 0.75rem;
}

.input {
	@apply border-[#161c26] mb-2 placeholder:text-[#748092] focus:border-border transition-colors;
}

.btn {
	@apply text-xs border py-1 px-2 rounded border-[#161c26] hover:border-[#482c65] transition-colors text-[#aebed5] hover:text-white;
}

.form {
	@apply mb-3 block;
	animation: show 0.3s ease-in-out;
}

@keyframes show {
	from {
		@apply border-[#a252c83d];
		transform: translateY(-35px);
		opacity: 0.4;
	}

	90% {
		@apply border-[#a252c83d];
	}

	to {
		@apply border-transparent;
		transform: translateY(0);
		opacity: 1;
	}
}
</style>

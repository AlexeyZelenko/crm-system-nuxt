<script setup lang="ts">
import {ref, watch} from 'vue';
import {useMutation, useQuery} from '@tanstack/vue-query';
import {COLLECTION_DEALS, COLLECTION_TEAM, DB_ID} from '~/app.constants';
import type {IDeal, IMember} from '~/types/deals.types';
import {useRoute} from 'vue-router';
import Swal from 'sweetalert2';
import {useForm} from 'vee-validate';
import * as yup from 'yup';

interface IDealFormState extends Pick<IDeal, 'name' | 'description' | 'priority' | 'executants' | 'owner'> {
  customer: {
    email: string;
    name: string;
  };
  status: string;
}

useSeoMeta({
  title: 'Редагування картки | INFINITY',
});

const route = useRoute();
const dealId = route.params.id as string;

const {handleSubmit, defineField, setValues, errors} =
    useForm<IDealFormState>({
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
    });

const {data: customers} = useQuery({
  queryKey: ['team'],
  queryFn: () => DB.listDocuments(DB_ID, COLLECTION_TEAM),
})

const {data, isLoading, refetch} = useQuery({
  queryKey: ['get deal', dealId],
  queryFn: () => DB.getDocument(DB_ID, COLLECTION_DEALS, dealId),
});

const isDataLoaded = ref(false);

watch([data], () => {
  if (data.value) {
    const initialData = data.value as unknown as IDealFormState;
    setValues({
      name: initialData.name,
      description: initialData.description,
      priority: initialData.priority || '',
      executants: initialData.executants,
      owner: initialData.owner,
      status: initialData.status,
    });
    isDataLoaded.value = true;
    refetch();
  }
});

const [name, nameAttrs] = defineField('name');
const [description, descriptionAttrs] = defineField('description');
const [priority, priorityAttrs] = defineField('priority');
const [executants, executantsAttrs] = defineField('executants');
const [owner, ownerAttrs] = defineField('owner');

const {mutate, isPending} = useMutation({
  mutationKey: ['update deal', dealId],
  mutationFn: (data: IDealFormState) =>
      DB.updateDocument(DB_ID, COLLECTION_DEALS, dealId, data),
  onSuccess() {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Your work has been saved",
      showConfirmButton: false,
      timer: 1500
    });
  },
  onError(error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
      footer: '<a href="#">Why do I have this issue?</a>'
    });
    console.error('Error updating deal:', error);
  }
});

const onSubmit = handleSubmit(values => {
  mutate(values);
});
</script>

<template>
  <div class="p-10">
    <h1 class="font-bold text-2xl mb-10">
      Редагування картки - {{ (data as unknown as IDealFormState)?.name }}
    </h1>

    <div v-if="!isDataLoaded">Завантаження даних...</div>
    <form v-if="isDataLoaded" @submit="onSubmit" class="form">
      <div class="grid w-full max-w-sm items-center gap-1.5 input">
        <div class="text-sm mb-2">Назва</div>
        <label>
          <UiInput
              placeholder="Назва"
              v-model="name"
              v-bind="nameAttrs"
              type="text"
              class="input"
          />
        </label>
        <pre class="error">{{ errors.name }}</pre>
      </div>

      <div class="grid w-full max-w-sm items-center gap-1.5 input">
        <div class="text-sm mb-2">Опис</div>
        <label>
          <UiInput
              placeholder="Опис"
              v-model="description"
              v-bind="descriptionAttrs"
              type="text"
              class="input"
          />
        </label>
        <pre class="error">{{ errors.description }}</pre>
      </div>

      <div class="grid w-full max-w-sm items-center gap-1.5 input">
        <div class="text-sm mb-2">Пріоритет</div>
        <label>
          <UiInput
              placeholder="Пріоритет"
              v-model="priority"
              v-bind="priorityAttrs"
              type="text"
              class="input"
          />
        </label>
      </div>

      <div class="grid w-full max-w-sm items-center gap-1.5 input">
        <div class="text-sm mb-2">Виконавці</div>
        <label>
          <USelectMenu
              v-model="executants"
              v-bind="executantsAttrs"
              :options="customers?.documents as unknown as IMember[]"
              placeholder="Select people"
              value-attribute="name"
              option-attribute="name"
              multiple
          />
        </label>
        <pre class="error">{{ errors.executants }}</pre>
      </div>

      <div class="grid w-full max-w-sm items-center gap-1.5 input">
        <div class="text-sm mb-2">Відповідальна особа</div>
        <label>
          <UiInput
              placeholder="Відповідальна особа"
              v-model="owner"
              v-bind="ownerAttrs"
              type="text"
              class="input"
          />
        </label>
        <pre class="error">{{ errors.owner }}</pre>
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

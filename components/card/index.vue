<script setup lang="ts">
import dayjs from "dayjs";
import { COLLECTION_DEALS, DB_ID } from '~/app.constants';
import { useMutation } from "@tanstack/vue-query";
import { useDealSlideStore } from '~/store/deal-slide.store';
import { useKanbanQuery } from "~/components/kanban/useKanbanQuery";
import Swal from 'sweetalert2';

const { data, isLoading, refetch } = useKanbanQuery();
const store = useDealSlideStore();
const showDescription = ref(false);

const props = defineProps({
  card: {
    type: Object,
    default: {},
  },
  status: {
    type: String,
    default: '',
  }
});

const cardRef = ref(props.card);

const { mutate, isPending } = useMutation({
  mutationKey: ['delete a deal'],
  mutationFn: (dealId: string) => DB.deleteDocument(DB_ID, COLLECTION_DEALS, dealId),
  onSuccess: () => {
    refetch();
    Swal.fire({
      title: "Deleted!",
      text: "Your deal has been deleted.",
      icon: "success"
    });
  },
});

const toggleDescription = () => {
  showDescription.value = !showDescription.value;
};

const deleteCard = (dealId: string) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      mutate(dealId);
    }
  });
};

onMounted(() => {
  refetch();
});
</script>

<template>
  <div class="v-card-item card">
    <UiCardHeader role="button" @click="store.set(cardRef)">
      <UiCardTitle class="v-card-item__name">
        <p>{{ cardRef.name }}</p>
        <UIcon name="i-heroicons:paper-airplane-16-solid" class="v-card-item__name--icon w-5 h-5" />
      </UiCardTitle>
    </UiCardHeader>

    <button
        class="v-card-item__button--show text-center p-2"
        @click="toggleDescription"
    >
      {{ showDescription ? 'Collapse' : 'Expand' }}
    </button>

    <section v-if="showDescription">
      <UiCardContent class="text-xs">
        <div>Description:</div>
        {{ cardRef.description }}
      </UiCardContent>
      <UiCardContent class="text-xs">
        <div>Priority:</div>
        {{ cardRef.priority }}
      </UiCardContent>
      <UiCardContent class="text-xs">
        <div>Executors:</div>
        <div
            v-for="item in cardRef.executants"
            :key="item"
        >
          <UIcon name="i-heroicons:check-16-solid" class="w-5 h-5" />
          {{ item }}
        </div>
      </UiCardContent>
      <UiCardContent class="text-xs">
        <div>Responsible Person:</div>
        {{ cardRef.owner }}
      </UiCardContent>
      <UiCardContent class="text-xs">
        <div>Company:</div>
        {{ cardRef.companyName }}
      </UiCardContent>
      <UiCardFooter>
        <p><UBadge>{{ cardRef.status }}</UBadge></p>
        <p>{{ dayjs(cardRef.$createdAt).format('DD MMMM YYYY') }}</p>
      </UiCardFooter>
      <NuxtLink :href="`/deal/edit/${cardRef.id}`">
        <button class="v-card-item__button--edit text-center m-2">
          Edit
        </button>
      </NuxtLink>
      <button
          class="v-card-item__button--delete text-center m-2"
          @click="deleteCard(cardRef.id)"
      >
        Delete
      </button>
    </section>
  </div>
</template>

<style scoped lang="scss">
.v-card-item {
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;

  &__name {
    display: flex;
    justify-content: space-between;
    align-items: center;

    p {
      margin: 0 5px;
    }

    &--icon {
      color: #a252c8;
      width: 2.25rem;
      height: 2.25rem;
    }
  }

  &__button {
    border: none;
    width: 90%;
    cursor: pointer;
    height: 40px;
    margin: 0 auto;
    color: white;

    &:hover {
      color: #f0f0f0;
    }

    &--show {
      width: 100%;
      background-color: #a252c8;
      border-radius: 10px;
      padding: 5px 10px;
      margin: 5px auto;

      &:hover {
        color: #181718;
      }
    }

    &--edit {
      width: 100%;
      background-color: #a252c8;
      border-radius: 10px;
      padding: 5px 10px;
      margin: 5px auto;

      &:hover {
        color: #181718;
      }
    }

    &--delete {
      width: 100%;
      background-color: #c92a77;
      border-radius: 10px;
      padding: 5px 10px;
      margin: 5px auto;

      &:hover {
        color: #181718;
      }
    }
  }
}
</style>

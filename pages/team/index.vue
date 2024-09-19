<script lang="ts" setup>
import {useMutation, useQuery} from '@tanstack/vue-query'
import {COLLECTION_PRODUCTS, COLLECTION_TEAM, DB_ID} from '~/app.constants'
import Swal from "sweetalert2";
import type {ICustomer} from "~/types/teams.types";

useSeoMeta({
  title: 'Team | INFINITY',
})

const {data: customers, isLoading, refetch} = useQuery({
  queryKey: ['team'],
  queryFn: () => DB.listDocuments(DB_ID, COLLECTION_TEAM),
})


const {mutate} = useMutation({
  mutationKey: ['delete a customer of team'],
  mutationFn: (customerId: string) => DB.deleteDocument(DB_ID, COLLECTION_PRODUCTS, customerId),
  onSuccess: () => {
    Swal.fire({
      title: "Deleted!",
      text: "Your customer has been deleted.",
      icon: "success"
    });
    refetch()
  },
  onError: (error) => {
    Swal.fire({
      title: "Error!",
      text: error.message,
      icon: "error"
    });
  }
});
const deleteCustomer = (customerId: string) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete customer!"
  }).then((result) => {
    if (result.isConfirmed) {
      mutate(customerId);
    }
  });
};


onMounted(() => {
  refetch()
})
</script>

<template>
  <div class="p-10">
    <header class="flex mb-10">
      <h1 class="font-bold text-2xl mr-4">Виконавці</h1>
      <NuxtLink :href="`/team/create`">
        <UButton color="white" variant="solid">Додати</UButton>
      </NuxtLink>
    </header>


    <div v-if="isLoading">Loading...</div>
    <UiTable v-else>
      <UiTableHeader>
        <UiTableRow>
          <UiTableHead class="w-[200px]">Зображення</UiTableHead>
          <UiTableHead class="w-[300px]">Найменування</UiTableHead>
          <UiTableHead class="w-[300px]">Позиція</UiTableHead>
          <UiTableHead class="w-[200px]">Email</UiTableHead>
          <UiTableHead class="w-[200px]">Роль</UiTableHead>
          <UiTableHead class="w-[200px]"></UiTableHead>
        </UiTableRow>
      </UiTableHeader>
      <UiTableBody>
        <UiTableRow
            v-for="customer in (customers?.documents as unknown as ICustomer[])"
            :key="customer.$id"
        >
          <UiTableCell>
            <NuxtLink :href="`/customers/edit/${customer.$id}`">
              <NuxtImg
                  :src="customer.avatar_url"
                  :alt="customer.name"
                  width="50"
                  height="50"
                  class="rounded-full"
              />
            </NuxtLink>
          </UiTableCell>

          <UiTableCell class="font-medium">
            {{ customer.name }}
          </UiTableCell>

          <UiTableCell class="font-medium">
            {{ customer.position }}
          </UiTableCell>

          <UiTableCell>{{ customer.email }}</UiTableCell>

          <UiTableCell class="font-medium">
            {{ customer.role }}
          </UiTableCell>

          <UiTableCell class="flex">
            <NuxtLink :to="`/team/edit/${customer.$id}`">
              <UiButton>Edit</UiButton>
            </NuxtLink>
            <UiButton class="ml-1.5" @click="() => deleteCustomer(customer.$id)">Delete</UiButton>
          </UiTableCell>
        </UiTableRow>
      </UiTableBody>
    </UiTable>
  </div>
</template>

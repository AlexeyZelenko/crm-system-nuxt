<script lang="ts" setup>
import {useMutation, useQuery} from '@tanstack/vue-query'
import {COLLECTION_PRODUCTS, DB_ID} from '~/app.constants'
import type {IProduct} from '~/types/products.types'
import dayjs from 'dayjs'
import Swal from "sweetalert2";
import {useKanbanQuery} from "~/components/kanban/useKanbanQuery";

useSeoMeta({
  title: 'Products | INFINITY',
})

const { data: products, isLoading, refetch } = useQuery({
  queryKey: ['products'],
  queryFn: () => DB.listDocuments(DB_ID, COLLECTION_PRODUCTS),
  select: (data) => {
    return {
      documents: data.documents.map((doc) => {
        console.log(doc.$id)
        return {
          ...doc,
          status: {
            value: doc.status,
            class: 'bg-red-500/50 dark:bg-red-400/50 animate-pulse'
          },
          deadline: dayjs(doc.deadline).format('DD MMMM YYYY'),
        }
      })
    }
  }
})

const { mutate, isPending } = useMutation({
  mutationKey: ['delete a product'],
  mutationFn: (productId: string) => DB.deleteDocument(DB_ID, COLLECTION_PRODUCTS, productId),
  onSuccess: () => {
    Swal.fire({
      title: "Deleted!",
      text: "Your product has been deleted.",
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
const deleteProduct = (productId: string) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete product!"
  }).then((result) => {
    if (result.isConfirmed) {
      mutate(productId);
    }
  });
};

const columns = [
  {
    key: 'name',
    label: 'Name'
  },
  {
    key: 'client',
    label: 'Client'
  },
  {
    key: 'deadline',
    label: 'Deadline'
  },
  {
    key: 'status',
    label: 'Status'
  },
  {
    key: 'lead',
    label: 'Lead'
  },
  {
    key: 'actions',
    label: 'Actions'
  }
]
</script>

<template>
  <div class="p-10">
    <header class="flex mb-10">
      <h1 class="font-bold text-2xl mr-4">Products</h1>
      <NuxtLink :href="`/products/create`">
        <UButton color="white" variant="solid">Create</UButton>
      </NuxtLink>
    </header>

    <div v-if="isLoading">Loading...</div>
    <UTable
        v-else
        :rows="(products?.documents as unknown as IProduct[])"
        :columns="columns"
    >
      <template #status-data="{ row }">
        {{ row.status.value }}
      </template>
      <template #actions-data="{ row }">
        <NuxtLink :href="`/products/edit/${row.$id}`">
          <UButton color="white" variant="solid">Edit</UButton>
        </NuxtLink>
        <UButton
            color="white"
            variant="solid"
            @click="() => deleteProduct(row.$id)"
        >Delete</UButton>
      </template>
    </UTable>
  </div>
</template>

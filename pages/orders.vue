<script lang="ts" setup>
import {useQuery} from '@tanstack/vue-query'
import {COLLECTION_DEALS, DB_ID} from '~/app.constants'
import dayjs from 'dayjs'

useSeoMeta({
  title: 'Orders | INFINITY',
})

const ordersArray = ref({});

const {data: orders, isLoading} = useQuery({
  queryKey: ['orders'],
  queryFn: () => DB.listDocuments(DB_ID, COLLECTION_DEALS),
  select: (data) => {
    console.log('data', data)
    const ordersMap = data.documents.map((doc) => {
      return {
        name: doc.name,
        status: doc.status,
        priority: doc.priority,
        lead: doc.owner,
        created: dayjs(doc?.$createdAt).format('DD MMMM YYYY'),
      }
    })
    ordersArray.value = data.documents;
    return ordersMap
  },
})
</script>

<template>
  <div>
    <h1 class="m-6">Orders</h1>
    <div class="m-4">
      <UTable
          :loading="isLoading"
          :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
          :progress="{ color: 'primary', animation: 'carousel' }"
          class="w-full"
          :rows="orders"
      >
        <template #expand="{ row }">
          <div>
            <!--            <pre>{{ ordersArray.find(item => item.name === row.назва) }}</pre>-->
            <pre>Опис:</pre>
            <pre class="mb-4">{{ ordersArray.find(item => item.name === row.name).description }}</pre>

            <pre>Виконавці:</pre>
            <pre class="mb-4">{{ ordersArray.find(item => item.name === row.name).executants.join(', ') }}</pre>
          </div>
        </template>
      </UTable>
    </div>
  </div>
</template>

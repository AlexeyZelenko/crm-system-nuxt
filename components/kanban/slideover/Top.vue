<script setup lang="ts">
import dayjs from 'dayjs'
import {useDealSlideStore} from '~/store/deal-slide.store'
import { computed } from 'vue';

const store = useDealSlideStore()

const daysSinceCreation = computed(() => {
  const createdAt = store.card?.$createdAt;
  if (createdAt) {
    return dayjs().diff(dayjs(createdAt), 'day');
  }
  return 0;
});
</script>

<template>
	<div class="border-border bg-black/20 rounded p-3">
		<div class="uppercase bold text-xl mb-4">Про завдання</div>
		<KanbanSlideoverLabel label-text="Назва">
			<h2>
				{{ store.card?.name }}
			</h2>
		</KanbanSlideoverLabel>
		<KanbanSlideoverLabel label-text="Опис">
			{{ store.card?.description }}
		</KanbanSlideoverLabel>
		<KanbanSlideoverLabel label-text="Статус">
      <UBadge size="sm">{{ store.card?.status }}</UBadge>
		</KanbanSlideoverLabel>
		<KanbanSlideoverLabel label-text="Виконавці">
      <div v-for="item in store.card?.executants" :key="item">
        *{{ item }}*
      </div>
    </KanbanSlideoverLabel>
    <KanbanSlideoverLabel label-text="Відповідальний">
      {{ store.card?.owner }}
    </KanbanSlideoverLabel>

    <KanbanSlideoverLabel label-text="Дата створення">
      <UChip :text="daysSinceCreation " size="2xl">
        {{ dayjs(store.card?.$createdAt).format('DD MMMM YYYY') }}
      </UChip>
    </KanbanSlideoverLabel>
	</div>
</template>

<script setup lang="ts">
import type { BomBook } from "@/interfaces";
import { useScriptureStore } from "@/stores/scripture";
import { computed } from "vue";

const scriptureStore = useScriptureStore();

interface Props {
  book: BomBook;
  chapter: number;
  verse: number;
  active: boolean;
}
const props = defineProps<Props>();

const hydrateVerse = computed(() => {
  return `<span class="verse-number">${props.verse+1} </span> ${scriptureStore.bookOfMormon[props.book]!.content[props.chapter]![props.verse]}`;
});
</script>
<template>
  <p v-html="hydrateVerse" :class="{ 'active-verse': props.active }"></p>
</template>
<style lang="scss">
.verse-number {
  font-weight: bold;
}
.active-verse {
  border-left: 2px solid teal;
  padding-left: 2px;
}
</style>
<script setup lang="ts">
import { useUtilsStore } from "@/stores/util";
import { emitter } from "@/eventBus";
import type { BomBook } from "@/interfaces";

interface Props {
  verse: string;
  breaker: boolean
}

const { verse, breaker } = defineProps<Props>();

const utilsStore = useUtilsStore();
const clickVerse = (verse: string) => {
  console.log("Clicked verse:", verse);
  const info = verse.match(/([\w\s]+) (\d+):(\d+(-\d+)?)/);
  console.log(info);
  if (info) {
    const verses = info[3]?.split("-").map(Number).map((v) => v - 1);
    console.log(verses)
    utilsStore.selection = {
      book: info[1] as BomBook,
      chapter: parseInt(info[2] || "1") - 1,
      verses: verses || [-1],
    };
    emitter.emit("readVerse");
  }
  console.log("here");
  console.log(utilsStore.selection);
  // Implement your logic to handle the verse click event here
};
</script>
<template>
  <span @click="clickVerse(verse)">{{ verse }}</span>
  <br v-if="breaker" /><template v-else>; </template>
</template>

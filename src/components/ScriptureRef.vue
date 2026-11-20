<script setup lang="ts">
import { useUtilsStore } from "@/stores/util";
import { emitter } from "@/eventBus";
import type { BomBook } from "@/interfaces";
import { bomBooks } from "@/constant";

interface Props {
  verse: string;
  breaker: boolean
}

const { verse, breaker } = defineProps<Props>();

const utilsStore = useUtilsStore();
const clickVerse = (verse: string) => {
//   console.log("Clicked verse:", verse);
  const info = verse.match(/([\w\s]+) (\d+):(\d+(-\d+)?)/);
//   console.log(info, bomBooks);
  if (info && bomBooks.includes(info[1]! as BomBook)) {
    const verses = info[3]?.split("-").map(Number).map((v) => v - 1);
    // console.log(verses)
    utilsStore.selection = {
      book: info[1] as BomBook,
      chapter: parseInt(info[2] || "1") - 1,
      verses: verses || [-1],
    };
    emitter.emit("readVerse");
  } else if (info && !bomBooks.includes(info[1]! as BomBook)) {
    console.log('scripture ref not in bom')
  }
};
</script>
<template>
  <span @click="clickVerse(verse)" class="fake-link">{{ verse }}</span>
  <br v-if="breaker" /><template v-else>; </template>
</template>
<style lang="scss" scoped>
.fake-link {
  color: teal;
  text-decoration: underline;
  cursor: pointer;
}
</style>
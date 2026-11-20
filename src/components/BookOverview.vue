<script setup lang="ts">
import { useSearchStore } from "@/stores/search.ts";
import { useScriptureStore } from "@/stores/scripture";
import PieChart from "./PieChart.vue";
import { computed } from "vue";
import type { BomBook } from "@/interfaces.ts";

const searchStore = useSearchStore();
const scriptureStore = useScriptureStore();

interface Props {
  book: {
    title: BomBook;
    content: string[][];
    tags: string[][][];
    notes: {
      start: number;
      end: number;
      content: string[];
      style?: string;
    }[][][];
  };
}
const props = defineProps<Props>();

const searchResultsForChapter = (chapterIndex: number) => {
  return searchResults.value.map((result) => {
    const verses = result.verses?.filter((loc) =>
      loc.reference.includes(` ${chapterIndex}:`),
    );
    return { ...result, verses };
  });
};

const areSearchTerms = computed(() => {
  return searchStore.input?.length || false;
});
const searchResults = computed(() => {
  return Object.values(searchStore.searchResults[props.book.title]);
});
</script>

<template>
  <el-row :gutter="20">
    <el-col :span="6">
      <div>
        {{ book.title }}
      </div>
    </el-col>
    <el-col :span="16">
      <el-row v-if="areSearchTerms" :gutter="searchStore.graphSpacing">
        <template
          v-for="(chapter, idx) in scriptureStore.bookOfMormon[book.title]
            .content">
            <pie-chart
              :chapter="idx+1"
              :items="searchResultsForChapter(idx + 1)"
              :size="searchStore.graphSize"></pie-chart>
        </template>
      </el-row>
    </el-col>
  </el-row>
</template>

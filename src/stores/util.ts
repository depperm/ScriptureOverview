import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { BomBook } from "@/interfaces";
import { bomBooks } from "@/constant";

export const useUtilsStore = defineStore("utils", () => {
  const selection = ref<{ book: BomBook; chapter: number , verses: number[]}>({
    book: bomBooks[0],
    chapter: 0,
    verses: [-1]
  });
  // const doubleCount = computed(() => count.value * 2)
  // function increment() {
  //   count.value++
  // }

  return { selection };
});

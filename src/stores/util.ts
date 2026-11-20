import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { BomBook } from "@/interfaces";
import { bomBooks } from "@/constant";

export const useUtilsStore = defineStore("utils", () => {
  const selection = ref<{ book: BomBook; chapter: number; verses: number[] }>({
    book: bomBooks[0],
    chapter: 0,
    verses: [-1],
  });
// https://hexcolor.ie/random-color-generator/
  const colorThemes = ref({
    random: [
      "#e30cf0",
      "#ff9ed7",
      "#051366",
      "#8aec16",
      "#d61d37",
      "#057da1",
      "#00a5f7",
      "#ba906c",
      "#6013b1",
      "#f07d14",
      "#d61d37",
      "#84fff6",
      "#ecae40",
    ],
  });
  const chosenTheme = ref<keyof typeof colorThemes.value>('random')
  // const doubleCount = computed(() => count.value * 2)
  // function increment() {
  //   count.value++
  // }

  return { selection, colorThemes, chosenTheme };
});

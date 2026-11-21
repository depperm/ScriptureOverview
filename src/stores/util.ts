import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { BomBook } from "@/interfaces";
import { bomBooks } from "@/constant";

export const useUtilsStore = defineStore(
  "utils",
  () => {
    const selection = ref<{ book: BomBook; chapter: number; verses: number[] }>(
      {
        book: bomBooks[0],
        chapter: 0,
        verses: [-1],
      },
    );
    // https://hexcolor.ie/random-color-generator/
    // https://coolors.co/palettes/popular/7%20colors
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
      rainbow: [
        "#9400D3",
        "#4B0082",
        "#0000FF",
        "#00FF00",
        "#FFFF00",
        "#FF7F00",
        "#FF0000",
      ],
      sunset: [
        "#f94144",
        "#f3722c",
        "#f8961e",
        "#f9c74f",
        "#90be6d",
        "#43aa8b",
        "#577590",
      ],
      earthy: [
        "#797d62",
        "#9b9b7a",
        "#d9ae94",
        "#f1dca7",
        "#ffcb69",
        "#d08c60",
        "#997b66",
      ],
      spectrum: [
        "#8ecae6",
        "#219ebc",
        "#126782",
        "#023047",
        "#ffb703",
        "#fd9e02",
        "#fb8500",
      ],
      green: [
        "#fafa00",
        "#e3e902",
        "#ccd904",
        "#b5c806",
        "#9eb708",
        "#87a70a",
        "#70960c",
      ],
      neon: [
        "#0ad2ff",
        "#2962ff",
        "#9500ff",
        "#ff0059",
        "#ff8c00",
        "#b4e600",
        "#0fffdb",
      ],
    });
    const chosenTheme = ref<keyof typeof colorThemes.value>("random");
    const opacity = ref(false);
    const caseSensitive = ref(false);

    return { selection, colorThemes, chosenTheme, opacity, caseSensitive };
  },
  { persist: true },
);

<script setup lang="ts">
import { alphabet } from "@/constant";
import type { BomBook } from "@/interfaces";
import { useScriptureStore } from "@/stores/scripture";
import { useUtilsStore } from "@/stores/util";
import { computed } from "vue";

const scriptureStore = useScriptureStore();
const utilStore = useUtilsStore();

interface Props {
  book: BomBook;
  chapter: number;
  verse: number;
  active: boolean;
  detailed: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  detailed: false,
});

const loadNotes = () => {
  utilStore.selection.verses = [props.verse];
};

const hydrateVerse = computed(() => {
  let verseText =
    scriptureStore.bookOfMormon[props.book]!.content[props.chapter]![
      props.verse
    ]!;
  if (props.detailed) {
    for (
      let i = 0;
      i <
      scriptureStore.bookOfMormon[props.book]!.footnotes[props.chapter]![
        props.verse
      ]!.length;
      i++
    ) {
      const words =
        scriptureStore.bookOfMormon[props.book]!.footnotes[props.chapter]![
          props.verse
        ]![i]!.words;
      verseText = verseText.replace(
        words,
        `<a class="footnote"><sup>${alphabet[i]}</sup>${words}</a>`,
      );
    }
  }

  return `<span class="verse-number">${props.verse + 1} </span> ${verseText}`;
});
</script>
<template>
  <p
    @click="loadNotes()"
    v-html="hydrateVerse"
    :class="{ 'active-verse': props.active }"></p>
</template>
<style lang="scss">
.verse-number {
  font-weight: bold;
}
.active-verse {
  border-left: 2px solid aqua;
  padding-left: 4px;
}
</style>

import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

import { bomBooks } from "../constant.ts";
import type { BomBook } from "@/interfaces.ts";
// import rawBom from "../bom.json" with { type: "json" };
import { useScriptureStore } from "./scripture.ts";
import type { IResult, IVerseMatch } from "@/interfaces.ts";

export const useSearchStore = defineStore("search", () => {
  const scriptureStore = useScriptureStore();
  // settings
  const graphSize= ref<number>(100);
  const graphSpacing= ref<number>(4);
  // state
  const input = ref<string[]>([]);

  const termItems = ref<string[]>([]);
  const tagItems = ref<string[]>([]);

  const termResults = ref<IResult[][]>([]);
  const tagResults = ref<IResult[][]>([]);

  const termSearch = (termToFind: string) => {
    const lastIndex = termResults.value.length - 1;
    for (let book of bomBooks) {
      const verses: IVerseMatch[] = [];
      let totalCount = 0;

      scriptureStore.bookOfMormon[book].content.forEach(
        (chapter, chapterNum) => {
          chapter.forEach((verse, verseNum) => {
            let sanitizedTerm =
              termToFind.length === 1
                ? termToFind.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
                : termToFind; // Escape special characters for regex
            sanitizedTerm = `(\\b[^ ]*${sanitizedTerm}[^ ]*\\b)` // for getting word it is a part of (test: testament, testified, etc)
            const matches =
              verse.match(new RegExp(sanitizedTerm, "gi"));
            const count = matches?.length ?? 0

            if (count > 0) {
              totalCount += count;
              const verse: IVerseMatch = {
                reference: `${book} ${chapterNum + 1}:${verseNum + 1} (${matches!.join(', ')})`,
                occurrences: count
              };

              verses.push(verse);
            }
          });
        },
      );
      if (totalCount > 0) {
        termResults.value[lastIndex]!.push({
          title: termToFind,
          value: totalCount,
          verses,
          book,
        });
      }
    }
  };
  const tagSearch = (tagToFind: string) => {
    const lastIndex = tagResults.value.length - 1;
    for (let book of bomBooks) {
      scriptureStore.bookOfMormon[book].tags.forEach((chapter, chapterNum) => {
        chapter.forEach((verse, verseNum) => {
          // console.log(`${book} ${chapterNum + 1}:${verseNumber + 1}`);
          const count = verse.includes(tagToFind) ? 1 : 0;
          if (count > 0) {
            // console.log(
            //   "FOUND",
            //   `${book} ${chapterNum + 1}:${verseNumber + 1}`,
            // );
            tagResults.value[lastIndex]!.push({
              title: `[${tagToFind}]`,
              verses: [
                {
                  reference: `${book} ${chapterNum + 1}:${verseNum + 1}`,
                  occurrences: 1,
                },
              ],
              value: count,
              book,
            });
          }
        });
      });
    }
  };

  watch(input, (newValue, oldValue) => {
    if (newValue.length === 0) {
      // CLEAR search
      termItems.value = [];
      tagItems.value = [];
      termResults.value = [];
      tagResults.value = [];
    } else if (newValue.length > oldValue.length) {
      // ADD to search
      const lastItem = input.value[input.value.length - 1]!.toLowerCase();
      if (lastItem.startsWith("[") && lastItem.endsWith("]")) {
        tagItems.value.push(lastItem);
        tagResults.value.push([]);
        tagSearch(lastItem.replaceAll(/^\[|\]$/g, ""));
      } else {
        termItems.value.push(lastItem);
        termResults.value.push([]);
        termSearch(lastItem);
      }
      console.log(tagResults.value);
    } else {
      // REMOVE from search
      const setB = new Set(newValue);

      const difference = oldValue.filter((item) => !setB.has(item))[0]!; //Array.from(setA.difference(setB))
      if (difference.startsWith("[") && difference.endsWith("]")) {
        const index = tagItems.value.indexOf(difference);
        tagItems.value.splice(index, 1);
        tagResults.value.splice(index, 1);
      } else {
        const index = termItems.value.indexOf(difference);
        termItems.value.splice(index, 1);
        termResults.value.splice(index, 1);
      }
    }
    console.log(termResults.value);
    console.log(tagResults.value);
  });

  const searchResults = computed(() => {
    let result = {} as Record<
      BomBook,
      Record<string, IResult>
    >;
    for (let book of bomBooks) {
      result[book] = {};
      termResults.value.forEach((terms: IResult[], index) => {
        result[book][termItems.value[index] as string] = //terms
          terms.reduce(
            (acc, item) => {
              if (item.book !== book) return acc;

              acc.value += item.value;
              acc.verses = acc.verses!.concat(item.verses!);

              return acc;
            },
            {
              title: termItems.value[index]!,
              value: 0,
              verses: [] as IVerseMatch[],
              book,
            } as IResult,
          );
      });
      tagResults.value.forEach((tags: IResult[], index) => {
        result[book][tagItems.value[index] as string] = tags.reduce(
          (acc, item) => {
            if (item.book !== book) return acc;

            acc.value += item.value;
            acc.verses = acc.verses!.concat(item.verses!);

            return acc;
          },
          {
            title: tagItems.value[index]!,
            value: 0,
            verses: [] as IVerseMatch[],
            book,
          } as IResult,
        );
      });
    }
    console.log(result);
    console.log(termResults.value);
    return result;
  });

  return {
    input,
    searchResults,
    graphSize,
    graphSpacing,
  };
}, {persist: true});

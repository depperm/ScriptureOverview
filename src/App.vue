<script setup lang="ts">
import { onMounted, ref, computed, onUnmounted, watch, nextTick } from "vue";
import { useSearchStore } from "./stores/search";
import { useScriptureStore } from "./stores/scripture";
import { useUtilsStore } from "./stores/util";
import BookOverview from "./components/BookOverview.vue";
import ScriptureViewer from "./components/ScriptureViewer.vue";
import { bomBooks } from "./constant.ts";
import { type BomBook } from "./interfaces.ts";
import { emitter } from "./eventBus.ts";
import ScriptureRef from "./components/ScriptureRef.vue";
import TgLink from "./components/TgLink.vue";
import type { InputInstance } from "element-plus";

const searchStore = useSearchStore();
const scriptureStore = useScriptureStore();
const utilStore = useUtilsStore();

const menuRef = ref();

watch(
  () => utilStore.selection,
  (selection) => {
    const bookIndex = String(bomBooks.indexOf(selection.book) + 1);

    menuRef.value?.open(bookIndex);
  },
  { deep: true, immediate: true },
);

const chapterContent = ref<string[]>([]);
const scriptOrder = ref<keyof typeof orderMap>("normal");
const primaryActiveTab = ref("search");
const inputValue = ref("");
const inputVisible = ref(false);
const InputRef = ref<InputInstance>();

const orderOptions = [
  {
    value: "normal",
    label: "Normal (Print)",
  },
  {
    value: "translated",
    label: "Translated",
  },
  {
    value: "chronological",
    label: "Chronological",
  },
];

const orderMap = {
  normal: [...bomBooks],
  translated: [...bomBooks.slice(7), ...bomBooks.slice(0, 7)],
  chronological: [
    bomBooks[13]!, // Ether
    ...bomBooks.slice(0, 13),
    bomBooks[14]!, // Moroni
  ],
} satisfies Record<string, BomBook[]>;

onMounted(() => {
  // Adds the class to the <html> tag
  document.documentElement.classList.add("dark");
  loadChapter(bomBooks[0]!, 0);

  emitter.on("readVerse", () => {
    primaryActiveTab.value = "read";
  });
});
onUnmounted(() => {
  emitter.off("readVerse", () => {});
});

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value!.input!.focus();
  });
};
const handleInputConfirm = () => {
  if (inputValue.value) {
    //dynamicTags.value.push(inputValue.value)
    //todo update tags in scriptureStore and save
  }
  inputVisible.value = false;
  inputValue.value = "";
};
const loadChapter = (book: BomBook, chapterIndex: number, verses = [-1]) => {
  // console.log(book, chapterIndex);
  utilStore.selection = { book, chapter: chapterIndex, verses };
  chapterContent.value =
    scriptureStore.bookOfMormon[book].content[chapterIndex] ?? ([] as string[]);
};
const removeTag = (tag: string) => {
  const { book, chapter, verses } = utilStore.selection;
  const verseIndex = verses[0]!;
  const tags =
    scriptureStore.bookOfMormon[book].tags[chapter]![verseIndex] ??
    ([] as string[]);
  const tagIndex = tags.indexOf(tag);
  if (tagIndex > -1) {
    tags.splice(tagIndex, 1);
  }
  scriptureStore.bookOfMormon[book].tags[chapter]![verseIndex] = tags;
  scriptureStore.saveJSON();
};
const addTag = () => {
  const { book, chapter, verses } = utilStore.selection;
  const verseIndex = verses[0]!;
  const tags =
    scriptureStore.bookOfMormon[book].tags[chapter]![verseIndex] ??
    ([] as string[]);
  if (!tags.includes(inputValue.value)) {
    tags.push(inputValue.value);
  }
  scriptureStore.bookOfMormon[book].tags[chapter]![verseIndex] = tags;

  inputValue.value = "";
  inputVisible.value = false;

  scriptureStore.saveJSON();
};

const books = computed(() => {
  return orderMap[scriptOrder.value] as BomBook[];
});
const activeChapter = computed(
  () => `${utilStore.selection.book}-${utilStore.selection.chapter}`,
);
</script>

<template>
  <el-container>
    <el-header>
      <h1>Book of Mormon Overview</h1>
    </el-header>
    <el-tabs
      tab-position="right"
      v-model="primaryActiveTab">
      <el-tab-pane
        label="Search"
        name="search"
        class="ml-2">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item
              label="Book Order"
              label-position="top">
              <el-select
                v-model="scriptOrder"
                placeholder="Select"
                style="width: 240px">
                <el-option
                  v-for="item in orderOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item
              label="Search Terms"
              label-position="top">
              <el-input-tag
                v-model="searchStore.input"
                clearable
                @clear="searchStore.input = []"
                tag-effect="dark">
                <template #prefix>
                  <el-tooltip
                    content="Enter a word, phrase, or [tag] and press 'Enter' to add to the search<ul><li>partial words search is supported, ie test will find testimony, testament, etc.</li><li>regex is also supported (single characters will act as normal characters, don't recommend . instead [^ ] is preferred)</li><li>searches are scoped to verses</li></ul>"
                    placement="bottom"
                    raw-content>
                    <el-icon><InfoFilled /></el-icon>
                  </el-tooltip>
                </template>
              </el-input-tag>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item
              label="Graph Size"
              label-position="top">
              <el-input-number
                name="graph size"
                controls-position="right"
                v-model="searchStore.graphSize"
                :min="10"
                :max="100" />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item
              label="Graph Spacing"
              label-position="top">
              <el-input-number
                name="graph spacing"
                controls-position="right"
                v-model="searchStore.graphSpacing"
                :min="0"
                :max="100" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-main>
          <book-overview
            v-for="book in books"
            :key="book"
            :book="scriptureStore.bookOfMormon[book]"></book-overview>            
        </el-main>
      </el-tab-pane>
      <el-tab-pane
        label="Read"
        name="read">
        <!-- {{ selection }} -->
        <el-row :gutter="8">
          <el-col :span="3">
            <el-menu
              :default-active="activeChapter"
              ref="menuRef">
              <el-sub-menu
                v-for="(book, index) in books"
                :key="book"
                :index="String(index + 1)">
                <template #title>{{ book }}</template>
                <el-menu-item
                  v-for="(_, cidx) in scriptureStore.bookOfMormon[book].content"
                  :key="cidx"
                  :index="`${book}-${cidx}`"
                  @click="loadChapter(book, cidx)">
                  Chapter {{ cidx + 1 }}
                </el-menu-item>
              </el-sub-menu>
            </el-menu>
          </el-col>
          <el-col
            :span="15"
            v-if="utilStore.selection.chapter >= 0">
            <!-- {{ chapterContent }} -->
            <scripture-viewer
              v-for="(verses, verse) in scriptureStore.bookOfMormon[
                utilStore.selection.book
              ].content[utilStore.selection.chapter]"
              :key="verse"
              :book="utilStore.selection.book"
              :chapter="utilStore.selection.chapter"
              :active="utilStore.selection.verses.includes(verse)"
              :verse="verse"
              :detailed="true"></scripture-viewer>
          </el-col>
          <el-col
            :span="5"
            v-if="
              utilStore.selection.verses.length &&
              utilStore.selection.verses[0]! >= 0
            ">
            <div class="sticky-box">
              {{ utilStore.selection.book }}
              {{ utilStore.selection.chapter + 1 }}:{{
                utilStore.selection.verses[0]! + 1
              }}
              <h4>Footnotes:</h4>
              <ol>
                <li
                  type="a"
                  v-for="foot in scriptureStore.bookOfMormon[
                    utilStore.selection.book
                  ]!.footnotes[utilStore.selection.chapter]![
                    utilStore.selection.verses[0]!
                  ]">
                  <scripture-ref
                    v-for="script in foot.scriptures"
                    :key="script"
                    :verse="script"
                    :breaker="false" />
                  <br v-if="foot.scriptures.length" />
                  <template v-if="foot.tg.length">
                    TG <tg-link :tg-links="foot.tg"></tg-link>
                  </template>
                </li>
              </ol>
              <h4>Tags:</h4>
              <el-tag
                v-for="tag in scriptureStore.bookOfMormon[
                  utilStore.selection.book
                ]!.tags[utilStore.selection.chapter]![
                  utilStore.selection.verses[0]!
                ]"
                :key="tag"
                type="primary"
                class="mr-1"
                @close="removeTag(tag)"
                closable>
                {{ tag }}
              </el-tag>
              <el-input
                v-if="inputVisible"
                ref="InputRef"
                v-model="inputValue"
                class="w-20"
                size="small"
                @keyup.enter="addTag"
                @blur="addTag" />
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput">
                + New Tag
              </el-button>
              <h4>Notes:</h4>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </el-container>
</template>

<style scoped>
.sticky-box {
  position: fixed;
  top: 5rem;
  padding: 1rem;
}
/* header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
} */
</style>

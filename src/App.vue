<script setup lang="ts">
// import rawBom from "./bom.json" with { type: "json" };
import { onMounted, ref } from "vue";
import { useSearchStore } from "./stores/search";
import { useScriptureStore } from "./stores/scripture";
import BookOverview from "./components/BookOverview.vue";
import { bomBooks } from "./constant.ts";

const searchStore = useSearchStore();
const scriptureStore = useScriptureStore();

const scriptOrder = ref<keyof typeof orderMap>("normal");

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

const orderMap: Record<string, Array<(typeof bomBooks)[number]>> = {
  normal: [...bomBooks],
  translated: [...bomBooks.slice(7), ...bomBooks.slice(0, 7)],
  chronological: [
    bomBooks[13]!, // Ether
    ...bomBooks.slice(0, 13),
    bomBooks[14]!, // Moroni
  ],
};

onMounted(() => {
  // Adds the class to the <html> tag
  document.documentElement.classList.add("dark");
});
</script>

<template>
  <el-container>
    <el-header>
      <h1>Book of Mormon Overview</h1>
    </el-header>
    <el-tabs tab-position="right">
      <el-tab-pane
        label="Search"
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
                    content="Enter a word, phrase, or [tag] and press 'Enter' to add to the search<ul><li>partial words search is supported, ie test will find testimony, testament, etc.</li><li>regex is also supported (single characters will act as normal characters)</li><li>searches are scoped to verses</li></ul>"
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
            v-for="book in orderMap[scriptOrder]"
            :key="book"
            :book="scriptureStore.bookOfMormon[book]"></book-overview>
        </el-main>
      </el-tab-pane>
      <el-tab-pane label="Read"></el-tab-pane>
    </el-tabs>
  </el-container>
</template>

<style scoped>
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

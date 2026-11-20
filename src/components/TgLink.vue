<script setup lang="ts">
import { computed } from "vue";
import { h } from "vue";

interface Props {
  tgLinks: string[];
}
const props = defineProps<Props>();

const hydratedLinks = computed(() => {
  return props.tgLinks.map((topic) => {
    let sanTopic = topic.toLowerCase().replaceAll(",", "").replaceAll(" ", "-");
    return h(
      "a",
      {
        target: "_",
        href: `https://www.churchofjesuschrist.org/study/scriptures/tg/${sanTopic}`,
      },
      topic,
    );
  });
});
</script>
<template>
  <template v-for="(link, lidx) in tgLinks">
    <component :is="hydratedLinks[lidx]"></component>
    <span>; </span>
  </template>
</template>

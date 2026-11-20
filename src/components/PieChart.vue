<script setup lang="ts">
import type { IResult } from "@/interfaces";
import { computed, ref } from "vue";
import ScriptureRef from "./ScriptureRef.vue";
import { useUtilsStore } from "@/stores/util.ts";

const utilStore = useUtilsStore();

interface Props {
  items?: IResult[];
  size?: number;
  chapter: number;
}

const { items = [], size = 100, chapter } = defineProps<Props>();
const visible = ref(false);
const tooltipContent = ref<{ title: string; verses: string[] }>();
const triggerRef = ref<HTMLElement | null>(null);
// Math.floor(Math.random() * 100) + 1

const polarToCartesian = (cx: number, cy: number, angleInDegrees: number) => {
  const radians = ((angleInDegrees - 90) * Math.PI) / 180;

  return {
    x: cx + radius.value * Math.cos(radians),
    y: cy + radius.value * Math.sin(radians),
  };
};

const showTooltip = (
  event: MouseEvent,
  slice: { title: string; verses: string[] },
) => {
  triggerRef.value = event.currentTarget as HTMLElement;
  tooltipContent.value = slice;
  visible.value = true;
};

const radius = computed(() => size / 2);
const total = computed(() =>
  items.reduce(
    (total, item) =>
      total +
      item.verses!.reduce((occTotal, verse) => occTotal + verse.occurrences, 0),
    0,
  ),
);
// const total = computed(() => items.reduce((a, b) => a + b.value, 0));

const slices = computed<
  {
    fullCircle: boolean;
    title: string;
    value: number;
    color: string;
    verses: string[];
    path?: string;
  }[]
>(() => {
  if (items.length === 1) {
    return [
      {
        title: items[0]!.title,
        value: items[0]!.value,
        verses: items[0]!.verses?.map((verse) => verse.reference) || [],
        fullCircle: true,
        color: utilStore.colorThemes[utilStore.chosenTheme][0] ?? "#000000",
      },
    ];
  }
  let startAngle = 0;

  return items.map((item, index) => {
    const angle =
      (item.verses!.reduce(
        (occTotal, verse) => occTotal + verse.occurrences,
        0,
      ) /
        total.value) *
      360;
    const endAngle = startAngle + Math.min(angle, 359.999);

    const start = polarToCartesian(radius.value, radius.value, startAngle);

    const end = polarToCartesian(radius.value, radius.value, endAngle);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const path = [
      `M ${radius.value} ${radius.value}`,
      `L ${start.x} ${start.y}`,
      `A ${radius.value} ${radius.value} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
      "Z",
    ].join(" ");

    // console.log("###", startAngle, endAngle);
    startAngle = endAngle;

    return {
      title: item.title,
      value: item.value,
      verses: item.verses?.map((verse) => verse.reference) || [],
      path,
      color: utilStore.colorThemes[utilStore.chosenTheme][index % utilStore.colorThemes[utilStore.chosenTheme].length],//colorPalette[index % colorPalette.length] ?? "#000000",
      fullCircle: false,
    };
  });
});
const isEmpty = computed(
  () => items.length === 0 || (items && items[0]!.verses?.length === 0),
);
</script>

<template>
  <el-col class="col-shrink">
    <!-- {{ total }}
    <br />
    {{ slices }}
    <br /> -->
    <svg
      :viewBox="`0 0 ${size} ${size}`"
      :height="size"
      :width="size">
      <!-- Empty state -->
      <defs>
        <filter
          id="inner-glow"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%">
          <!-- 1. Blur the original shape's alpha -->
          <feGaussianBlur
            in="SourceAlpha"
            stdDeviation="8"
            result="blur" />

          <!-- 2. Subtract the blur FROM the original alpha (k2="1" k3="-1") -->
          <feComposite
            in="SourceAlpha"
            in2="blur"
            operator="arithmetic"
            k2="1"
            k3="-1"
            result="innerMask" />

          <!-- 3. Color the inner mask -->
          <feFlood
            flood-color="black"
            flood-opacity="1"
            result="glowColor" />
          <feComposite
            in="glowColor"
            in2="innerMask"
            operator="in"
            result="innerGlow" />

          <!-- 4. Layer the inner glow on top of the circle -->
          <feComposite
            in="innerGlow"
            in2="SourceGraphic"
            operator="over" />
        </filter>
      </defs>
      <circle
        v-if="isEmpty"
        :cx="radius"
        :cy="radius"
        :r="radius"
        fill="#f3f4f6"
        filter="url(#inner-glow)" />
      <template
        v-else
        v-for="(slice, index) in slices"
        :key="index">
        <!-- <el-tooltip
          :content="listOfVerses(slice.title).join(', ')"
          placement="right"
          :disabled="listOfVerses(slice.title).length === 0"> -->
        <circle
          v-if="slice.fullCircle"
          :cx="radius"
          :cy="radius"
          :r="radius"
          :fill="slice.color"
          @pointerenter="showTooltip($event, slice)"
          @pointerleave="visible = false" />
        <path
          v-else
          :d="slice.path"
          :fill="slice.color"
          @pointerenter="showTooltip($event, slice)"
          @pointerleave="visible = false" />
        <!-- </el-tooltip> -->
      </template>
    </svg>
    <el-tooltip
      v-model:visible="visible"
      :virtual-ref="triggerRef"
      virtual-triggering
      placement="bottom">
      <template #content>
        <b>{{ tooltipContent?.title }}</b>
        <br />
        <scripture-ref
          v-for="verse in tooltipContent?.verses"
          :key="verse"
          :verse="verse"
          :breaker="true" />
        <!-- <template v-for="verse in tooltipContent?.verses">
          <span @click="clickVerse(verse)">{{ verse }}</span>
          <br />
        </template> -->
      </template>
    </el-tooltip>
  </el-col>
</template>
<style lang="scss" scoped>
.col-shrink {
  flex: 0 0 auto;
  width: auto;
  max-width: none;
}

.col-grow {
  flex: 1 1 0%;
  width: auto;
  max-width: none;
}
</style>

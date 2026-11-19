import { defineStore } from "pinia";

import { bomBooks } from "../constant.ts";
import rawBom from "../bom.json" with { type: "json" };

export const useScriptureStore = defineStore("scripture", () => {
  // state
  const bom = rawBom as Record<
    (typeof bomBooks)[number],
    {
      title: (typeof bomBooks)[number];
      content: string[][];
      tags: string[][][];
      notes: {
        start: number;
        end: number;
        content: string[];
        style?: string;
      }[][][];
      footnotes: {
        start: number;
        end: number;
        tg: string[];
        scriptures: string[];
      }[][][];
      link: {
        start: number;
        end: number;
        scriptures: string[];
      }[][][];
    }
  >;

  return {
    bookOfMormon: bom,
  };
});

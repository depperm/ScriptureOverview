import { defineStore } from "pinia";

import type { BomBook } from "@/interfaces";
import rawBom from "../bom.json" with { type: "json" };

export const useScriptureStore = defineStore("scripture", () => {
  // state
  type Note = {
    start: number;
    end: number;
    content: string[];
    style?: string;
  };
  type Footnote = {
    // 1 nephi 1:13 has 2 word phrase
    start?: number;
    end?: number;
    words: string;
    tg: string[];
    scriptures: string[];
  };
  type Link = {
    start: number;
    end: number;
    scriptures: string[];
  };
  type BomData<T extends BomBook> = {
    title: T;
    content: string[][];
    tags: string[][][];
    notes: Note[][][];
    footnotes: Footnote[][][];
    link: Link[][][];
  };
  type Bom = {
    [K in BomBook]: BomData<K>;
  };
  const bom = rawBom as Bom;

  const saveJSON = async () => {
    if ("showSaveFilePicker" in window) {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: "bom.json",
        types: [
          {
            description: "JSON Files",
            accept: {
              "application/json": [".json"],
            },
          },
        ],
      });

      const writable = await handle.createWritable();

      await writable.write(JSON.stringify(bom, null, 2));

      await writable.close();
    } else {
      const blob = new Blob([JSON.stringify(bom, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "bom.json";
      a.click();

      URL.revokeObjectURL(url);
    }
  };

  return {
    bookOfMormon: bom,
    saveJSON,
  };
});

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
    start: number;
    end: number;
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

  return {
    bookOfMormon: bom,
  };
});

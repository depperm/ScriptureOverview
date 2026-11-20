import { bomBooks } from "./constant.ts";

export type BomBook = (typeof bomBooks)[number];
export interface IVerseMatch {
  reference: string;
  occurrences: number;
}
export interface IResult {
  title: string; // search term
  value: number; // times result occurs in verse
  total?: number; // total results in scripture
  verses?: IVerseMatch[];
  book: string;
}

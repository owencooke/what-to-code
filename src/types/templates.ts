// src/types/template.ts

export type Template = {
  id: number;
  url: string;
  embedding: number[];
};

export type TemplateMatch = {
  id: number;
  url: string;
  similarity: number;
};

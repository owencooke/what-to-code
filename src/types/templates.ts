// src/types/template.ts

export type Template = {
  id: number;
  url: string;
  embedding: number[];
};

export type TemplateMatch = {
  url: string;
  similarity: number;
};

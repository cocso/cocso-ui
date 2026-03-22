import { type InferPageType, loader } from "fumadocs-core/source";
import { docs } from "~/.source";
import { i18n } from "./i18n";

export const source = loader({
  baseUrl: "/",
  source: docs.toFumadocsSource(),
  i18n,
});

export type Page = InferPageType<typeof source>;

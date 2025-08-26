import { type InferPageType, loader } from 'fumadocs-core/source';
import { docs } from '~/.source';

export const source = loader({
  baseUrl: '/',
  source: docs.toFumadocsSource(),
});

export type Page = InferPageType<typeof source>;

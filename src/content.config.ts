import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    /** 지식 맵에 앞세울 순서. 값이 없는 글은 후보에서 빠진다. */
    mapOrder: z.number().int().positive().optional(),
    /** 지식 맵 노드에 붙는 영역 이름. 태그와 별개다. */
    category: z.string().optional(),
  }),
});

export const collections = { posts };

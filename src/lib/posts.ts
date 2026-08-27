import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/** 초안 글은 개발 서버에서만 노출한다. */
function isVisible(post: Post): boolean {
  return !post.data.draft || !import.meta.env.PROD;
}

/** 발행일 내림차순으로 정렬한 노출 대상 글 목록을 돌려준다. */
export async function getVisiblePosts(): Promise<Post[]> {
  const posts = await getCollection('posts', isVisible);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** 발행일과 파일명으로 `2026/08/hello-blog` 형태의 주소 조각을 만든다. */
export function toSlugPath(post: Post): string {
  const year = String(post.data.date.getFullYear());
  const month = String(post.data.date.getMonth() + 1).padStart(2, '0');
  return `${year}/${month}/${post.id}`;
}

/** 글 본문 페이지의 절대 경로를 돌려준다. */
export function toPostUrl(post: Post): string {
  return `/posts/${toSlugPath(post)}`;
}

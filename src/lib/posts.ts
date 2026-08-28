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

/** 지식 맵에 올릴 글의 최대 개수. 시안의 격자가 다섯 칸이다. */
const MAP_NODE_LIMIT = 5;

/**
 * 지식 맵에 올릴 글을 돌려준다.
 * `mapOrder`를 적은 글을 오름차순으로 고르고, 하나도 없으면 최신 글로 채운다.
 * 일부만 적혀 있으면 최신 글로 채우지 않는다. 앞세울 글을 고르는 일이 작성자의 판단이기 때문이다.
 */
export async function getMapPosts(): Promise<Post[]> {
  const posts = await getVisiblePosts();
  const ordered = posts.filter((post) => post.data.mapOrder !== undefined);

  if (ordered.length === 0) {
    return posts.slice(0, MAP_NODE_LIMIT);
  }

  // getVisiblePosts가 이미 발행일 내림차순이므로, 순번이 같으면 그 순서가 남는다.
  return ordered
    .sort((a, b) => a.data.mapOrder! - b.data.mapOrder!)
    .slice(0, MAP_NODE_LIMIT);
}

/** 분당 읽는 글자 수. 기술 글을 천천히 읽는 상황에 맞춘 값이다. */
const CHARS_PER_MINUTE = 500;

/** 본문에서 읽기 시간에 셈하지 않을 Markdown 기호와 공백. */
const IGNORED_IN_BODY = /(```[\s\S]*?```|`[^`]*`|!?\[[^\]]*\]\([^)]*\)|[#>*_~\-|\s])/g;

/** 글 하나를 읽는 데 걸리는 시간을 분 단위로 돌려준다. 항상 1 이상이다. */
export function getReadingMinutes(post: Post): number {
  const letters = (post.body ?? '').replace(IGNORED_IN_BODY, '').length;
  return Math.max(1, Math.ceil(letters / CHARS_PER_MINUTE));
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

/** 검색에 쓰는 글 하나의 정보. 화면의 글자가 아니라 이 값으로 검색한다. */
export interface SearchEntry {
  /** 목록 항목을 찾는 식별자. `PostCard`의 `data-od-id`와 짝을 이룬다. */
  id: string;
  /** 제목, 요약, 태그를 소문자로 합친 검색 대상 문자열. */
  text: string;
  /** 발행일을 밀리초로 담은 값. 정렬 기준으로 쓴다. */
  time: number;
}

/** 글 목록을 검색과 정렬에 필요한 값만 남긴 배열로 바꾼다. */
export function toSearchEntries(posts: Post[]): SearchEntry[] {
  return posts.map((post) => ({
    id: post.id,
    text: [post.data.title, post.data.summary, ...post.data.tags].join(' ').toLowerCase(),
    time: post.data.date.valueOf(),
  }));
}

---
title: 블로그를 시작하며
date: 2026-08-27
summary: 마크다운으로 글을 쓰고 정적 페이지로 내보내는 환경을 만들었다.
tags:
  - 기록
  - astro
draft: false
keyPoint: true
---

## 왜 정적 페이지인가

글을 쓰는 일과 배포하는 일이 분리되어 있으면 글쓰기에 마음이 덜 쓰인다. 마크다운 파일 하나를 더하는 것으로 발행이 끝나는 구조가 필요했다.

## 지금 되는 것

- `src/content/posts/`에 파일을 두면 목록에 나타난다.
- 프론트매터는 빌드할 때 검증된다.
- `draft: true`인 글은 개발 서버에서만 보인다.

![글 폴더와 이미지가 나란히 놓인 구조](./folder-structure.png)

```ts
const posts = await getCollection('posts');
```

읽어 주셔서 고맙습니다.

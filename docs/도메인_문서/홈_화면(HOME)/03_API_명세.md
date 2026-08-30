# 홈 화면(HOME) — API 명세

## 엔드포인트 목록

| 메서드 | 경로 | 설명 | 인증 |
| --- | --- | --- | --- |
| `GET` | `/` | 홈 화면. 머리말, 지식 맵, 최신 글 세 영역을 그린다 | 불필요 |

## `GET /`

빌드 시점에 `getMapPosts`와 `getRecentPosts`를 호출해 정적 HTML 한 편을 만든다. 클라이언트 스크립트는 테마 전환 외에 붙지 않는다.

### 요청

파라미터를 받지 않는다.

```
GET /
```

### 응답

정적 HTML을 돌려준다. 화면을 구성하는 값은 다음과 같다.

| 영역 | 값 | 출처 |
| --- | --- | --- |
| 눈썹 문구 | `A map of making` | `index.astro` 리터럴 |
| 제목 | `만들면서 배운 것을 다시 찾을 수 있게.` | 같은 파일 |
| 설명 | `웹과 제품을 만들며 발견한 질문, 선택, 시행착오를 한 편의 글로 기록합니다. 글 사이의 연결을 따라가며 생각의 맥락을 발견해 보세요.` | 같은 파일. `<title>`의 `기록의 지도`와 함께 `description` 메타에도 쓴다 |
| 최근 생각 | 섹션 제목과 `${mapPosts.length}편` | `getMapPosts()` |
| 최신 글 | 다섯 편의 제목과 날짜, `전체 보기` 링크 | `getRecentPosts()` |

```html
<section>
  <h2>최근 생각</h2><span data-od-id="section-note">5편</span>
  <div class="grid grid-cols-2 border-y border-border wide:grid-cols-[1.45fr_1fr_1fr]" data-od-id="knowledge-map">
    <a href="/posts/hello-blog" aria-labelledby="map-node-title-hello-blog" data-od-id="map-node-hello-blog">
      <span>01 / 중심 글</span>
      <h3 id="map-node-title-hello-blog">블로그를 시작하며</h3>
      <span>기록 · 3분 읽기</span>
    </a>
    …
  </div>
</section>
```

### 컴포넌트 계약

| 컴포넌트 | props | 설명 |
| --- | --- | --- |
| `KnowledgeMap` | `posts: Post[]` | 다섯 칸 격자를 그린다. 빈 배열이면 아무것도 그리지 않는다 |
| `MapNode` | `post`, `index`, `featured?`, `edgeClass?` | 칸 하나. `index`는 배치 순서이고 `edgeClass`는 격자가 계산해 넘긴다 |
| `RecentPostList` | `posts: Post[]` | 한 줄 목록. 빈 배열이면 아무것도 그리지 않는다 |

### 조작 식별자

| `data-od-id` | 요소 |
| --- | --- |
| `knowledge-map` | 격자 컨테이너 |
| `map-node-<post.id>` | 노드 링크 |
| `recent-post-list` | 최신 글 목록 |
| `post-line-<post.id>` | 목록 항목 링크 |
| `recent-post-list-more` | 「전체 보기」 링크 |

### 에러 코드

해당 없음. 정적 페이지라 런타임 오류 응답이 없다. 넘겨받은 글이 없는 경우는 오류가 아니라 섹션을 그리지 않는 정상 동작이다. 빌드 시점의 실패는 [`콘텐츠(CONTENT)`](../콘텐츠(CONTENT)/03_API_명세.md)의 스키마 검증에서 드러난다.

## 이벤트 메시징

해당 없음. 메시지 브로커를 쓰지 않는다.

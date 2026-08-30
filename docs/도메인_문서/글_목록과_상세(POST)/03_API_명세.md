# 글 목록과 상세(POST) — API 명세

## 엔드포인트 목록

| 메서드 | 경로 | 설명 | 인증 |
| --- | --- | --- | --- |
| `GET` | `/posts` | 발행한 글 전체 목록. 검색·정렬·무한 스크롤을 얹는다 | 불필요 |
| `GET` | `/posts/<post.id>` | 글 한 편의 본문 화면 | 불필요 |

## `GET /posts`

`getVisiblePosts()`의 결과 전부를 마크업으로 내보내고, 같은 목록을 `toSearchEntries()`로 축약해 페이지에 함께 싣는다. 이후의 좁히기와 정렬은 브라우저에서 일어난다.

### 요청

파라미터를 받지 않는다. 검색어와 정렬 방향은 주소에 남지 않는다.

```
GET /posts
```

### 응답

| 영역 | 값 |
| --- | --- |
| 눈썹 문구 | `Archive` |
| 제목 | `모든 글` |
| 설명 | `혹시 아나요? 진짜로 도움이 되는 글이 있을지` |
| 섹션 제목 | `전체 기록` |
| 결과 요약 | `총 <글 수>편` |

```json
[
  { "id": "hello-blog", "text": "블로그를 시작하며 왜 다시 블로그를 여는지, 무엇을 기록할지 적어 둔다. 회고 블로그", "time": 1787788800000 },
  { "id": "2026/08/News-4weeks", "text": "2026년 8월 뉴스 네 주치 지난 네 주 동안 눈에 띈 소식을 모았다. 뉴스", "time": 1788134400000 }
]
```

### 클라이언트 동작 계약

| 입력 | 상태 변화 | 화면 변화 |
| --- | --- | --- |
| 검색 폼 제출 | `query`를 소문자·공백 제거 값으로, `visible`을 20으로 | 일치하는 항목만 드러나고 요약이 갱신된다 |
| 정렬 버튼 클릭 | `oldestFirst` 반전, `visible`을 20으로 | 순서가 뒤집히고 보이는 화살표가 바뀐다 |
| 감시 요소 진입 | `visible`을 10 늘린다(전체 수를 넘지 않는다) | 다음 묶음이 드러난다 |
| 스크립트 로드 완료 | 없음 | 검색 폼과 정렬 버튼이 나타난다 |

### 에러 코드

해당 없음. 서버 응답이 없는 정적 페이지다. 잘못된 상태 대신 아래 표시로 사용자에게 알린다.

| 상황 | 표시 |
| --- | --- |
| 발행한 글이 없다 | `아직 발행한 글이 없습니다.` |
| 검색 결과가 없다 | `검색 결과가 없습니다.` |

## `GET /posts/<post.id>`

`getStaticPaths`가 `getVisiblePosts()`의 결과마다 경로 하나를 만든다. 경로 조각은 `toSlugPath(post)`, 곧 `post.id`이므로 폴더 구조가 그대로 주소가 된다.

### 요청

| 위치 | 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- | --- |
| path | `slug` | `string` | 예 | `post.id`. 슬래시를 포함한 여러 조각이 올 수 있다 |

```
GET /posts/hello-blog
GET /posts/2026/books/소프트웨어 설계의 결합 균형
```

### 응답

```html
<article class="mx-auto max-w-[680px]" data-od-id="article-view">
  <header data-od-id="post-header">
    <p data-od-id="post-eyebrow">기록 · 3분 읽기</p>
    <h1>블로그를 시작하며</h1>
    <p>왜 다시 블로그를 여는지, 무엇을 기록할지 적어 둔다.</p>
    <div data-od-id="post-meta">
      <time datetime="2026-08-27T00:00:00.000Z">2026년 8월 27일</time>
      <ul aria-label="이 글의 태그"><li>회고</li><li>블로그</li></ul>
    </div>
  </header>
  <nav aria-label="본문 목차" data-od-id="post-toc">
    <strong>이 글의 구성</strong>
    <ol><li><a href="#왜-다시-쓰는가">왜 다시 쓰는가</a><ol><li><a href="#기록의-대상">기록의 대상</a></li></ol></li></ol>
  </nav>
  <div class="prose" data-od-id="prose">…</div>
  <aside data-od-id="related-post"><p>다음으로 읽기</p><a href="/posts/…">다음 글 제목 →</a></aside>
</article>
```

### 컴포넌트 계약

| 컴포넌트 | props | 설명 |
| --- | --- | --- |
| `PostList` | `posts: Post[]` | 비면 `EmptyState`를 그린다 |
| `PostCard` | `post: Post` | 항목 하나. 날짜는 `2026.08.27` 형태 |
| `PostHeader` | `post: Post` | 눈썹·제목·요약·날짜·태그 |
| `PostToc` | `headings: MarkdownHeading[]` | 비면 아무것도 그리지 않는다 |
| `RelatedPost` | `post?: Post` | 값이 없으면 영역과 구분선이 함께 사라진다 |
| `Prose` | 기본 슬롯 | 본문 조판. 규칙은 [`본문_렌더링(RENDER)`](../본문_렌더링(RENDER)/01_도메인_개요.md)에 있다 |

### 에러 코드

해당 없음. 정적 경로만 존재하므로 없는 글의 주소는 응답 오류가 아니라 파일 부재로 나타난다. 빌드 시점의 실패 조건은 [`콘텐츠(CONTENT)`](../콘텐츠(CONTENT)/03_API_명세.md)에 있다.

## 이벤트 메시징

해당 없음. 메시지 브로커를 쓰지 않는다. 화면 안의 전달은 DOM 이벤트(`submit`, `click`, `IntersectionObserver`)로만 이뤄진다.

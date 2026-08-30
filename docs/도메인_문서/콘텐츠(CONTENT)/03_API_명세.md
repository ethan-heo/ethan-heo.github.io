# 콘텐츠(CONTENT) — API 명세

HTTP API가 없는 정적 사이트이므로, 이 문서는 다른 도메인이 호출하는 모듈 함수를 계약으로 적는다. 모두 `src/lib/posts.ts`에 있다.

## 엔드포인트 목록

| 메서드 | 경로 | 설명 | 인증 |
| --- | --- | --- | --- |
| `GET` | `/posts/<post.id>` | 글 본문 페이지. 빌드 시점에 정적으로 생성한다 | 불필요 |

HTTP 엔드포인트는 위 하나뿐이며 경로 생성 규칙은 [`글_목록과_상세(POST)`](../글_목록과_상세(POST)/03_API_명세.md)에 있다. 아래는 이 도메인이 노출하는 함수 계약이다.

### 함수 계약

| 함수 | 시그니처 | 설명 |
| --- | --- | --- |
| `getVisiblePosts` | `() => Promise<Post[]>` | 노출 대상 글을 발행일 내림차순으로 돌려준다 |
| `getRecentPosts` | `() => Promise<Post[]>` | 위 결과의 앞 5편 |
| `getMapPosts` | `() => Promise<Post[]>` | `keyPoint` 표시 글 최대 5편. 없으면 최신 5편 |
| `getReadingMinutes` | `(post: Post) => number` | 읽기 시간(분). 항상 1 이상 |
| `getRelatedPost` | `(post: Post) => Promise<Post \| undefined>` | 이어 볼 글. 없으면 `undefined`, 참조가 깨지면 예외 |
| `toSlugPath` | `(post: Post) => string` | 주소 조각. `post.id`와 같다 |
| `toPostUrl` | `(post: Post) => string` | `/posts/${toSlugPath(post)}` |
| `toSearchEntries` | `(posts: Post[]) => SearchEntry[]` | 검색과 정렬용 축약 배열 |

## `GET /posts/<post.id>`

노출 대상 글마다 하나씩 생성하는 정적 페이지다. `getStaticPaths`가 `getVisiblePosts`의 결과를 그대로 경로로 바꾸므로, 초안 글의 경로는 운영 빌드에 존재하지 않는다.

### 요청

| 위치 | 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- | --- |
| path | `slug` | `string` | 예 | `post.id`. 슬래시를 포함한 여러 조각이 올 수 있다 |

```
GET /posts/2026/books/소프트웨어 설계의 결합 균형
```

### 응답

정적 HTML을 돌려준다. 아래는 그 페이지를 만들 때 쓰는 `Post` 자료의 실제 형태다.

```json
{
  "id": "hello-blog",
  "data": {
    "title": "블로그를 시작하며",
    "date": "2026-08-27T00:00:00.000Z",
    "summary": "왜 다시 블로그를 여는지, 무엇을 기록할지 적어 둔다.",
    "tags": ["회고", "블로그"],
    "draft": false,
    "keyPoint": true,
    "category": "기록"
  }
}
```

`toSearchEntries`가 돌려주는 항목의 형태는 다음과 같다.

```json
{
  "id": "hello-blog",
  "text": "블로그를 시작하며 왜 다시 블로그를 여는지, 무엇을 기록할지 적어 둔다. 회고 블로그",
  "time": 1787788800000
}
```

### 에러 코드

HTTP 상태 코드를 다루지 않는다. 잘못된 상태는 응답이 아니라 빌드 실패로 드러난다.

| 시점 | 증상 | 발생 조건 |
| --- | --- | --- |
| 스키마 검증 | 빌드 중단. 파일 경로와 필드 이름을 알린다 | `title`, `date`, `summary` 중 하나가 없거나 타입이 어긋난다 |
| `getRelatedPost` | `Error: <id>의 related가 가리키는 글을 찾을 수 없다: <대상 id>` | `related`가 컬렉션에 없는 글을 가리킨다 |

공통 에러 규약은 [`공통_에러_코드.md`](../../공통_인프라_및_컨벤션/공통_에러_코드.md)를 참조한다.

## 이벤트 메시징

해당 없음. 메시지 브로커를 쓰지 않는다. 도메인 사이의 전달은 모두 빌드 시점의 직접 함수 호출로 이뤄진다.

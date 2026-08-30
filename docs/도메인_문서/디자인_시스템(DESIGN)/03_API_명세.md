# 디자인 시스템(DESIGN) — API 명세

## 엔드포인트 목록

해당 없음. 이 도메인은 HTTP 엔드포인트를 만들지 않는다. 화면이 호출하는 계약은 컴포넌트의 props이므로 그것을 대신 적는다.

| 컴포넌트 | props | 설명 | 인증 |
| --- | --- | --- | --- |
| `BaseLayout` | `title`, `description?` | 페이지 골격. `<title>`과 `description` 메타를 채운다 | 불필요 |
| `PageIntro` | `eyebrow`, `heading`, `description` | 화면 머리말 세 줄 | 불필요 |
| `SectionHead` | `title`, `note?`, `slot="action"` | 섹션 제목 줄. 오른쪽에 개수와 조작을 붙인다 | 불필요 |
| `Tag` | `name` | 태그 하나. 링크가 아니다 | 불필요 |
| `TagList` | `tags`, `label?` | 태그 묶음. 비면 아무것도 그리지 않는다 | 불필요 |
| `EmptyState` | `title`, `actionHref?`, `actionLabel?` | 빈 목록 안내 | 불필요 |
| `SiteHeader` | 없음 | 브랜드와 아이콘 조작 두 개 | 불필요 |
| `SiteBrand` | 없음 | 사이트 이름과 태그라인 | 불필요 |
| `SiteFooter` | 없음 | 저작권 줄 | 불필요 |
| `ThemeToggle` | 없음 | 테마 전환 버튼 | 불필요 |

## `BaseLayout`

모든 페이지를 감싸는 골격이다. 전역 스타일을 들이고, 폰트를 연결하며, 테마 초기화 스크립트를 `<head>`에 넣고, 헤더와 푸터 사이에 본문 슬롯을 둔다.

### 요청

| 위치 | 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- | --- |
| props | `title` | `string` | 예 | `<title>`에 그대로 들어간다 |
| props | `description` | `string` | 아니오 | 있을 때만 `description` 메타를 만든다 |
| slot | 기본 슬롯 | — | 예 | `<main>` 안에 놓인다 |

```jsx
<BaseLayout title="기록의 지도" description="웹과 제품을 만들며 발견한 질문, 선택, 시행착오를 한 편의 글로 기록합니다.">
  <PageIntro eyebrow="A map of making" heading="만들면서 배운 것을 다시 찾을 수 있게." description="…" />
</BaseLayout>
```

### 응답

```html
<html lang="ko" data-theme="dark">
  <head>
    <title>기록의 지도</title>
    <meta name="description" content="웹과 제품을 만들며 발견한 질문, 선택, 시행착오를 한 편의 글로 기록합니다.">
  </head>
  <body>
    <div class="mx-auto flex min-h-screen w-[min(100%-40px,70rem)] flex-col …">
      <header data-od-id="site-header">…</header>
      <main class="flex-1 pt-[clamp(3.5rem,9vw,7rem)] pb-24">…</main>
      <footer data-od-id="site-footer">© 2026 블로그 · 읽고 만든 것을 기록한다.</footer>
    </div>
  </body>
</html>
```

## `ThemeToggle`

현재 테마를 뒤집고 결과를 저장한다. 초기 테마 판정은 `BaseLayout`의 인라인 스크립트가 맡고, 이 컴포넌트는 전환만 담당한다.

### 요청

props를 받지 않는다. 클릭이 유일한 입력이다.

### 응답

| 대상 | 변화 |
| --- | --- |
| `<html data-theme>` | `light` ↔ `dark` |
| `localStorage.theme` | 바뀐 값. 저장이 막히면 남기지 않는다 |
| `aria-label` | `라이트 테마로 전환` ↔ `다크 테마로 전환` |
| `.theme-toggle-state` | `현재 테마: 라이트` ↔ `현재 테마: 다크` |

### 에러 코드

| 상황 | 처리 |
| --- | --- |
| `localStorage` 읽기가 막혔다 | 저장 값을 `null`로 두고 시스템 설정을 따른다 |
| `localStorage` 쓰기가 막혔다 | 이 세션 안에서만 전환을 유지한다 |

## 조작 식별자 목록

| `data-od-id` | 요소 | 쓰는 곳 |
| --- | --- | --- |
| `site-header` | 헤더 | 배치 검증 |
| `site-brand` | 홈 링크 | 접근 가능한 이름 검증 |
| `articles-link` | 모든 글 링크 | 헤더 조작 |
| `theme-toggle` | 테마 버튼 | 전환 스크립트 |
| `site-footer` | 푸터 | 배치 검증 |
| `page-intro` | 머리말 | 문구 검증 |
| `section-note` | 섹션 개수 표시 | 목록 스크립트가 글 수를 갱신한다 |
| `empty-state` | 빈 목록 안내 | 목록 검증 |

## 이벤트 메시징

해당 없음. 메시지 브로커를 쓰지 않는다. 테마 전환은 DOM 속성과 `localStorage`로만 전달된다.

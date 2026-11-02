---
title: 2026년 44주차에 배운 내용
category: 기술 학습
date: 2026-10-31
summary: 이번 주에 이해한 프런트엔드와 AI 개념을 실행 경계, 데이터 흐름, 판단 주체라는 기준으로 정리했다.
tags:
  - 기술학습
  - 프론트엔드
  - AI
draft: false
keyPoint: false
---
AI와 함께 작성한 글입니다.

이번 주에는 WebGL, 스크롤 기반 애니메이션, 외부 스크립트, HTML과 DOM, SSR과 CSR, Knip, AI 에이전트와 워크플로, RAG를 공부했다. 공통된 질문은 **무엇이 상태와 동작을 결정하고, 그 결정은 어느 실행 경계에서 이루어지는가?**였다.

## 화면을 그리는 일과 화면의 규칙은 다르다

WebGL은 JavaScript에서 GPU의 그래픽 가속을 활용해 `<canvas>`에 2D·3D 그래픽을 그리는 API다. 그래픽 가속은 화면을 만드는 계산에 GPU를 활용한다는 뜻이며, 게임의 물리 규칙이나 충돌 처리를 제공하는 기능은 아니다.

게임 코드가 “자동차를 이 위치에 놓아라”라고 계산하면 WebGL은 그 결과를 화면에 그린다. 충돌 판단 코드가 벽을 통과한 위치를 계산했다면 WebGL은 그 위치에 자동차를 그릴 수 있다. 따라서 자동차가 벽을 통과해 보인다는 사실만으로 WebGL의 문제라고 판단할 수 없다. 그래픽 API와 애플리케이션의 상태 계산을 나눠 확인해야 한다.

이번 주에 이해한 기준은 화면을 그리는 일과 화면에 그릴 상태를 계산하는 일을 구분하는 것이다.

출처: [JavaScript Weekly #808](https://javascriptweekly.com/issues/808), [GTA.js 소개](https://www.bram.us/2026/10/22/gta-js/), [MDN WebGL API](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)

## 스크롤은 애니메이션의 진행률을 정할 수도 있고, 시작만 시킬 수도 있다

스크롤 기반 애니메이션은 경과 시간이 아니라 스크롤 기반 타임라인으로 진행률을 결정한다. 읽기 진행 막대가 스크롤 위치에 연결되어 있다면 스크롤을 멈췄을 때 막대도 멈추고, 위로 되돌리면 줄어든다.

반대로 스크롤이 애니메이션을 시작하는 계기일 뿐이라면 시작 뒤의 진행률은 시간이 결정한다. 화면에 들어온 카드가 1초 동안 나타나는 경우에는 스크롤을 멈췄다고 애니메이션이 자동으로 멈추거나 되감기지 않는다.

“스크롤 애니메이션”이라는 이름보다 진행률을 누가 결정하는지가 중요하다. 이번 주에는 사용자가 위로 스크롤하면 진행 막대가 현재 위치에 맞춰 줄어든다고 설명하면서 이 차이를 이해했다.

출처: [Frontend Focus #764](https://frontendfoc.us/issues/764), [MDN Scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations)

## 외부에서 받은 코드도 현재 페이지의 권한으로 실행될 수 있다

`<script src="…">`로 받은 외부 스크립트는 출처가 다르더라도 현재 페이지의 실행 환경에서 실행되며, 현재 페이지의 DOM에 접근할 수 있다. 반면 다른 출처의 `<iframe>`은 별도의 문서이므로 동일 출처 정책에 따라 부모 페이지 DOM에 직접 접근하는 것이 제한된다.

쇼핑몰에 오래된 통계 스크립트 태그가 남아 있고 그 도메인을 공격자가 다시 소유했다고 가정하자. 같은 URL에서 다른 코드를 제공하면 그 코드는 쇼핑몰 페이지 안에서 실행된다. 외부에서 내려받았다는 사실이 별도의 안전한 상자에서 실행된다는 뜻은 아니다.

외부 스크립트와 iframe은 모두 외부 콘텐츠처럼 보이지만 실행 경계가 다르다. URL의 외부 여부보다 어떤 문서의 실행 환경과 권한으로 들어오는지를 확인해야 한다. 이번 주에는 외부 스크립트를 iframe처럼 생각하면 안 된다는 점을 이해했다.

출처: [Frontend Focus #764](https://frontendfoc.us/issues/764), [Executing cross-site JavaScript](https://web.dev/learn/privacy/third-parties#executing-cross-site-javascript), [MDN Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy#cross-origin_script_api_access)

## HTML, DOM, SSR과 CSR은 같은 것을 가리키지 않는다

원본 HTML은 서버가 보낸 문서이고, DOM은 브라우저가 HTML을 해석해 만든 객체 트리다. JavaScript는 DOM을 변경할 수 있지만 DOM 자체를 만드는 데 JavaScript가 필요한 것은 아니다.

SSR은 서버에서 콘텐츠를 HTML로 생성하는 방식이고, CSR은 브라우저의 JavaScript가 콘텐츠를 DOM에 만드는 방식이다. React의 하이드레이션은 서버가 만든 HTML에 React를 연결해 상태와 상호작용을 관리하는 과정이다.

상품 리뷰가 원본 HTML에 있으면 JavaScript가 실행되지 않아도 HTML을 읽는 도구는 리뷰를 볼 수 있다. 리뷰가 JavaScript 실행 뒤에 DOM으로 추가된다면 원본 HTML에는 리뷰가 없을 수 있다. SSR로 리뷰가 보이더라도 JavaScript 다운로드에 실패하면 좋아요 버튼 같은 React 동작은 작동하지 않을 수 있다.

따라서 “화면에 보인다”와 “상호작용할 수 있다”는 같은 시점이 아니다. 이번 주에는 하이드레이션을 DOM 생성보다 빠르게 만드는 과정이 아니라, 이미 만들어진 HTML에 동작을 연결하는 과정으로 구분했다.

출처: [요즘IT 관련 원문](https://yozm.wishket.com/magazine/detail/4006), [Chrome DevTools DOM](https://developer.chrome.com/docs/devtools/dom/#appendix), [Rendering on the Web](https://web.dev/articles/rendering-on-the-web), [React hydrateRoot](https://react.dev/reference/react-dom/client/hydrateRoot)

## Knip의 경고는 실행 여부가 아니라 연결 가능성을 분석한 결과다

Knip은 인식한 진입점에서 import 관계를 따라 JavaScript·TypeScript 프로젝트의 미사용 파일, export, 의존성을 분석한다. 기본 규칙과 프레임워크 플러그인으로 진입점을 자동 탐색할 수 있지만, 진입점이 누락되면 실제 사용하는 코드도 미사용으로 보고될 수 있다.

배치 시작 파일이 `report.ts`를 import하지만 Knip이 그 시작 파일을 진입점으로 모르면 `report.ts`가 미사용으로 표시될 수 있다. 반대로 사용하지 않는 파일을 진입점으로 등록해도 경고는 사라질 수 있으므로, 경고가 없다는 사실만으로 실제 실행을 증명할 수는 없다.

이번 주에 이해한 내용은 “오래된 파일인가”가 아니라 “현재 분석에서 진입점으로부터 도달 가능한가”가 Knip의 판단 기준이라는 점이다. 분석 결과를 신뢰하려면 실제 실행 진입점을 정확히 알려야 한다.

출처: [React Status #494](https://react.statuscode.com/issues/494), [Knip 분석 방식](https://knip.dev/explanations/how-knip-works), [Knip 진입점 탐색](https://knip.dev/explanations/entry-files), [발표자 원문](https://tkdodo.eu/blog/dead-code-shouldnt-exist)

## 워크플로와 에이전트는 다음 행동의 선택 주체가 다르다

워크플로는 사람이 미리 정한 흐름에 따라 LLM과 도구를 실행한다. 에이전트는 목표와 실행 결과를 바탕으로 LLM이 다음 행동과 도구 사용을 선택한다. 단계가 많거나 도구를 사용한다는 사실만으로 에이전트가 되는 것은 아니다.

문서 검색 → 요약 → 번역을 항상 같은 순서로 실행하면 워크플로다. 검색 결과를 읽은 LLM이 자료가 부족하다고 판단해 추가 검색을 선택하고 충분하면 답변으로 넘어간다면 에이전트에 가깝다.

에이전트에도 검색 횟수 제한이나 승인 절차를 둘 수 있다. 핵심은 규칙의 유무가 아니라 정해진 범위 안에서 다음 행동을 누가 선택하는지다. 이번 주에는 사용자가 “고정된 재검색 규칙은 이미 정해진 매뉴얼”이라고 설명하면서 워크플로와 에이전트를 구분했다.

출처: [요즘IT 관련 원문](https://yozm.wishket.com/magazine/detail/4010), [Building effective agents](https://www.anthropic.com/research/building-effective-agents)

## RAG는 모델을 다시 학습시키는 일이 아니라 답변할 때 자료를 넣는 방식이다

RAG는 질문과 관련된 외부 자료를 검색하고 그 내용을 모델의 입력에 포함해 답변을 생성하는 방식이다. 검색한 자료가 바뀌는 것과 모델 자체를 다시 학습시키는 것은 다르다.

출시일을 미룬 이유를 묻고 관련 회의록을 검색해 답을 만들었다면 바뀐 것은 모델이 아니라 참고 자료다. 수정된 회의록을 검색하면 새로운 근거로 답할 수 있지만, 폐기된 옛 회의록을 검색하면 현재와 맞지 않는 답을 만들 수 있다.

RAG를 사용했다는 사실만으로 정확성이 보장되지는 않는다. 오래된 자료라도 여전히 유효할 수 있고 최신 자료라도 질문과 맞지 않을 수 있다. 이번 주에 사용자는 RAG를 “질문에 필요한 자료를 외부에서 찾아 답변을 만들어 제공하는 것”으로 설명했고, 모델과 참고 자료의 변화를 구분했다.

출처: [요즘IT 관련 원문](https://yozm.wishket.com/magazine/detail/4010), [Amazon Bedrock Knowledge Bases 작동 방식](https://docs.aws.amazon.com/bedrock/latest/userguide/kb-how-it-works.html)

## 이번 주에 남은 공통 기준

이번 주 학습에서 가장 중요했던 것은 기술 이름을 외우는 일이 아니라 같은 현상을 보고도 어느 층위의 문제인지 나누는 기준을 얻은 것이다.

- 화면이 이상하면 그리는 API와 상태·규칙 계산을 나눈다.
- “스크롤 기반”이라는 이름보다 진행률을 결정하는 주체가 스크롤인지 시간인지 확인한다.
- 외부 코드라면 URL보다 어떤 실행 환경과 권한으로 들어오는지 확인한다.
- HTML에 보이는 콘텐츠와 JavaScript가 연결한 상호작용을 나눈다.
- 정적 분석의 경고는 도구가 아는 진입점과 연결 관계 안에서 해석한다.
- AI 시스템은 다음 행동을 누가 선택하는지, 답변에 어떤 자료를 넣는지를 나누어 본다.

결국 기술을 이해한다는 것은 이름을 설명하는 데서 끝나지 않는다. 그 기술이 무엇을 결정하고 무엇은 결정하지 않는지, 그리고 경계가 어디에 있는지를 말할 수 있어야 한다.

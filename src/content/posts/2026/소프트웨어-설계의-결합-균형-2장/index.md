---
title: 복잡성과 커네빈 프레임워크, 소프트웨어 설계의 결합 균형 2장
category: 소프트웨어 설계
date: 2026-10-03
summary: 문서 없는 레거시 배정 API를 관찰해 규칙을 찾고, 타입과 변환 함수, 확인 조회로 다음 변경의 결과를 예측할 수 있게 만들었다.
tags:
  - 독서
  - 소프트웨어_설계
  - 복잡성
  - 커네빈_프레임워크
  - typescript
draft: false
keyPoint: true
---
AI와 함께 작성한 글입니다.

복잡한 시스템을 만났을 때 처음부터 정답을 설계하려고 하면 오히려 위험하다. 먼저 바꾼 결과를 예측할 수 있는지 확인하고, 예측할 수 없다면 관찰과 실험으로 규칙을 찾아야 한다.

커네빈 프레임워크를 이 상황에 적용하면 문서 없는 레거시 API는 원인과 결과를 바로 알 수 있는 명확 도메인이 아니다. 직접 호출하고 결과를 관찰해야 하는 복잡 도메인에 가깝다. 이번 글의 질문은 다음과 같다.

> 실험으로 알아낸 암묵적 규칙을 어떻게 코드에 명시할까?

## 규칙을 발견하기 전의 API

티켓을 상담원이나 팀에 배정하는 API가 있다고 가정한다. 문서는 없고, 호출이 실패해도 HTTP `200 OK`를 반환한다.

```ts
export function assignTicket(ticketId: string, target: string) {
  return httpClient.post(`/legacy/assign/${ticketId}`, { target });
}
```

호출부는 문자열의 의미와 형식을 모두 알고 있어야 한다.

```tsx
assignTicket(ticket.id, agent.email);
assignTicket(ticket.id, team.code);
```

이 상태에서는 다음을 컴파일러가 확인해 주지 못한다.

- 상담원 이메일은 소문자여야 한다.
- 팀 코드는 `TEAM:` 접두사와 대문자 형식을 사용해야 한다.
- `200 OK`가 실제 등록 성공을 뜻하지 않을 수 있다.

실습에서는 API를 여러 번 호출해 대상마다 다른 형식과 조용한 실패 조건을 확인했다고 가정했다. 중요한 점은 이 규칙을 호출부의 주석으로 남기는 데 그치지 않는 것이다. 다음 호출도 같은 시행착오를 반복하지 않도록 타입과 변환 함수가 규칙을 강제하게 만들었다.

## 관찰한 규칙을 타입으로 좁히기

실험으로 구분한 상담원과 팀을 태그드 유니온으로 표현한다.

```ts
type Target =
  | { kind: "agent"; email: string }
  | { kind: "team"; code: string };

function toTarget(target: Target): string {
  switch (target.kind) {
    case "agent":
      return target.email.toLowerCase();
    case "team":
      if (!target.code) throw new Error("팀 코드가 필요합니다.");
      return `TEAM:${target.code.toUpperCase()}`;
  }
}
```

호출부는 더 이상 API 문자열 형식을 조립하지 않는다.

```tsx
assignTicket(ticket.id, { kind: "agent", email: agent.email });
assignTicket(ticket.id, { kind: "team", code: team.code });
```

타입은 호출할 수 있는 대상의 종류를 보여 주고, `toTarget`은 서버가 요구하는 문자열 형식을 한곳에서 관리한다. 형식 규칙이 바뀌면 호출부가 아니라 변환 함수를 확인하면 된다.

처음 함수가 `string`을 받을 때는 이메일과 팀 코드가 같은 종류처럼 보였다. `Target`으로 나누자 호출부에서 무엇을 배정하는지 드러났고, 접두사와 대소문자 규칙은 `toTarget` 한곳으로 모였다. 타입을 추가한 목적은 값을 꾸미는 것이 아니라 잘못된 호출의 범위를 줄이는 데 있었다.

## 성공을 다시 확인하기

이 API는 형식이 틀려도 성공 상태 코드를 반환할 수 있다. 따라서 HTTP 요청이 끝났다는 사실과 티켓이 실제로 등록됐다는 사실을 같은 것으로 보면 안 된다.

```ts
export async function assignTicket(ticketId: string, target: Target) {
  await httpClient.post(`/legacy/assign/${ticketId}`, {
    target: toTarget(target),
  });

  const { data } = await httpClient.get(`/tickets/${ticketId}/assignment`);
  if (!data.registered) {
    throw new Error(`티켓 배정에 실패했습니다: ${ticketId}`);
  }
}
```

확인 조회는 단순한 방어 코드가 아니다. 레거시 API에서 무엇을 성공으로 보는지 코드에 명시한다. 다음에 같은 API를 만나는 사람은 상태 코드만 믿지 않고 실제 등록 여부까지 확인해야 한다는 사실을 알 수 있다.

## 다시 볼 기준

- 지금 내가 아는 규칙은 문서에서 온 것인가, 실험으로 확인한 것인가?
- 문자열이나 `unknown`으로 남겨 둔 값 중 종류를 타입으로 표현할 수 있는 것은 무엇인가?
- 변환 규칙을 호출부마다 반복하지 않고 한곳에 둘 수 있는가?
- HTTP 성공과 실제 배정 성공을 같은 뜻으로 사용하고 있지는 않은가?

복잡성이 사라진 것은 아니다. 다만 실험으로 발견한 규칙을 타입, 변환 함수, 확인 조회에 남겨 다음 변경의 결과를 더 예측할 수 있게 만들었다.

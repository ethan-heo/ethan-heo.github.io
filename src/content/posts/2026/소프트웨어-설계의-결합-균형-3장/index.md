---
title: 결합으로 자유도를 줄이기, 소프트웨어 설계의 결합 균형 3장
category: 소프트웨어 설계
date: 2026-10-15
summary: 복잡한 상호작용이 생기는 이유를 숨은 지식과 자유도로 보고, 규칙을 한곳에 모으고 값의 범위를 제한하는 방법을 티켓 콘솔 예제로 정리했다.
tags:
  - 독서
  - 소프트웨어_설계
  - 복잡성
  - 자유도
  - typescript
draft: false
keyPoint: true
related: 2026/소프트웨어-설계의-결합-균형-4장
---
AI와 함께 작성한 글입니다.

복잡성은 파일이나 구성요소의 수만으로 정해지지 않는다. 서로 독립적으로 바꿀 수 있는 값과 규칙이 많을수록 시스템이 표현할 수 있는 상태가 늘고, 그중 원하지 않는 상태도 함께 늘어난다.

이번 글에서는 티켓 콘솔의 여러 문제를 하나의 질문으로 묶었다.

> 어떤 자유도를 없애야 변경 결과를 더 쉽게 예측할 수 있을까?

## 숨은 상호작용은 검색에 잡히지 않는다

티켓 필터 형식을 문자열에서 JSON으로 바꾸면서 import 관계를 찾았다고 가정한다. 에디터의 참조 검색으로 필터 모듈을 사용하는 코드는 찾았지만, 최근 검색 위젯은 `localStorage`의 `ticket-filter` 키를 직접 읽고 있었다.

```ts
// 필터 모듈을 import하지 않아 참조 검색에 잡히지 않는다.
const raw = localStorage.getItem("ticket-filter");
const filter = JSON.parse(raw ?? "{}");
```

이 위젯은 필터 모듈과 직접 연결되지 않았지만 저장 키의 형식이라는 지식을 공유한다. 한쪽만 바꾸면 다른 쪽이 깨지는 암묵적 결합이다.

이런 관계를 줄이는 방법은 저장소 접근을 함수로 감싸고, 두 모듈이 그 함수를 import하게 만드는 것이다. 연결 수는 늘어날 수 있지만 변경 경로가 코드에 드러난다. 숨은 상호작용을 명시적인 결합으로 바꾸면 영향 범위를 찾기 쉬워진다.

실습에서는 변경 영향을 `traceable`과 `hidden`으로 나눴다. import를 따라 찾은 모듈은 `traceable`, import 없이 `storage:ticket-filter`라는 가정을 공유한 모듈은 `hidden`에 넣었다. 이 구분을 구현하고 나니 참조 검색 결과가 틀린 것이 아니라, 검색할 수 없는 관계가 설계에 남아 있었다는 점이 보였다.

파일을 합치거나 쪼개는 실습도 같은 결론으로 이어졌다. 호출 13개를 한 파일에 모으면 파일 사이 호출은 0이지만 파일 안 호출은 13개가 됐고, 함수마다 파일을 나누면 반대가 됐다. 복잡성은 사라지지 않고 위치만 바뀌었다.

## 규칙을 여러 곳에 복사하면 자유도가 늘어난다

목록과 상세 화면이 같은 긴급 티켓 규칙을 각각 구현한다고 하자.

```ts
// 목록
const isUrgent = ticket.status === "open"
  && ticket.priority === "high"
  && hoursOpen(ticket) >= 4;

// 상세
const tone = ticket.priority === "high"
  && ticket.status !== "closed"
  && elapsed(ticket) >= 4 * 60 * 60 * 1000
    ? "danger"
    : "normal";
```

두 구현이 우연히 같은 결과를 낼 수도 있고 서로 다른 결과를 낼 수도 있다. 같은 규칙을 유지하려면 두 곳을 항상 함께 관리해야 한다.

```ts
export function isUrgent(ticket: Ticket, now: Date): boolean {
  return ticket.status === "open"
    && ticket.priority === "high"
    && hoursOpen(ticket, now) >= 4;
}

export function detailHeaderTone(ticket: Ticket, now: Date) {
  return isUrgent(ticket, now) ? "danger" : "normal";
}
```

`import`가 하나 늘었지만 두 화면의 판정이 어긋나는 상태는 사라졌다. 결합을 줄이는 것보다 먼저, 같은 지식이 여러 구현으로 복제되어 있는지 확인해야 한다.

구현 중에는 `switch`의 `default`에서 예외를 던지면 더 안전하다고 생각했다. 하지만 `default`가 있으면 새로운 상태를 추가해도 처리 누락이 컴파일 오류로 드러나지 않았다. `default`를 없애고 반환 타입이 빠진 상태를 알려 주게 하면서, 제약은 실행 중 검사뿐 아니라 타입 검사에도 둘 수 있다는 점을 확인했다.

## 값의 범위를 타입과 생성 함수로 제한하기

기간을 `{ from, to }` 객체로만 표현하면 `from`이 `to`보다 늦은 기간이나 90일을 넘는 기간도 만들 수 있다.

```ts
export interface Period {
  readonly from: string;
  readonly to: string;
  readonly days: number;
}

export function createPeriod(from: string, to: string): Period {
  const start = Temporal.PlainDate.from(from);
  const end = Temporal.PlainDate.from(to);
  const days = start.until(end).days + 1;

  if (days < 1 || days > 90) {
    throw new Error("기간은 1일 이상 90일 이하여야 합니다.");
  }

  return Object.freeze({ from, to, days });
}
```

이제 날짜를 바꾸는 함수도 `createPeriod`를 다시 호출해야 한다. 공개 필드를 직접 바꾸는 통로를 막고, 유효한 기간을 만드는 통로만 남긴다. 자유도가 줄어든 만큼 컴포넌트마다 같은 검사를 반복할 필요도 줄어든다.

현재 구현은 날짜 유효성과 일수 계산을 모두 `Temporal.PlainDate`로 처리하고, 제한값을 상수로 둔다. 검증 수단과 규칙을 한곳에 모아야 “규칙은 한곳에 둔다”는 판단과 일치한다.

## 경계가 맡을 지식의 범위를 정하기

서버 필드 이름을 화면이 직접 알게 하면 저장소 변경이 여러 화면으로 퍼진다.

```ts
export interface TicketRepository {
  allTickets(tenantId: string): Ticket[];
  openedBefore(tenantId: string, date: Date): Ticket[];
  matchingStatus(tenantId: string, status: TicketStatus): Ticket[];
}
```

조회 목록을 필요한 메서드로 제한하면 화면은 `opened_on`이나 서버의 필터 문법을 알 필요가 없다. 범용 Query 객체를 공개하면 미래의 모든 조회를 표현할 수 있지만, 그만큼 화면이 필드 이름과 연산자를 더 많이 알아야 한다.

실습에서는 유연성을 일부 포기하고 지금 필요한 조회를 명시했다. 새로운 조회가 반복해서 추가된다면 실제 변경 사례를 근거로 범위를 다시 넓힌다. “언젠가 필요할 것 같다”는 이유만으로 인터페이스의 자유도를 넓히지는 않는다.

저장소를 구현한 뒤에는 서버 필드 이름을 고칠 곳이 정말 한 군데인지 다시 확인했다. `opened_on`은 변환 함수뿐 아니라 필터 조건에도 쓰여 두 군데를 고쳐야 했다. 중요한 것은 수정 지점이 하나라는 말이 아니라, 두 지점이 모두 저장소 경계 안에 있고 화면까지 변경이 퍼지지 않는다는 점이었다.

## 다시 볼 기준

- 참조 검색에 잡히지 않는 공유 키나 형식이 있는가?
- 같은 규칙이 여러 구현에 복사되어 서로 다른 상태를 표현할 수 있는가?
- 유효하지 않은 값을 만드는 통로를 타입이나 생성 함수로 닫을 수 있는가?
- 경계가 지금 필요한 기능보다 더 넓은 선택을 허용하고 있지는 않은가?

파일을 합치거나 나누는 일만으로는 복잡성이 줄지 않는다. 숨은 지식을 드러내고, 중복 규칙을 한곳에 모으고, 표현 가능한 상태의 범위를 제한해야 변경 결과를 더 예측할 수 있다.

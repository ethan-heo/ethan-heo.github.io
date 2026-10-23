---
title: 경계를 넘는 지식으로 결합을 판별하기, 소프트웨어 설계의 결합 균형 5장
category: 소프트웨어 설계
date: 2026-10-22
summary: 모듈 사이에 공유되는 지식의 종류를 기준으로 여섯 결합 수준을 나누고, 고객 패널과 상담원 화면 예제로 결합을 판별해 봤다.
tags:
  - 독서
  - 소프트웨어_설계
  - 결합
  - 모듈성
  - typescript
draft: false
keyPoint: true
---
AI와 함께 작성한 글입니다.

모듈 사이의 연결을 볼 때 “얼마나 많이 연결됐는가?”만 세면 중요한 차이를 놓친다. 같은 연결이라도 전역 상태를 함께 쓰는지, 실행 흐름을 지시하는지, 데이터 구조를 통째로 넘기는지에 따라 변경이 퍼지는 방식이 다르다.

이번에 정리한 기준은 간단하다.

> 결합 수준은 경계를 넘어 공유되는 지식의 종류와 양으로 판별한다.

구조적 설계의 모듈 결합은 높은 수준부터 콘텐츠, 공통, 외부, 제어, 스탬프, 데이터 결합으로 나뉜다. 낮은 수준이라고 해서 연결이 사라지는 것은 아니다. 통합에 필요한 지식을 더 작고 명시적인 계약으로 줄인다.

## 여섯 결합 수준

여섯 수준은 다음처럼 한 줄로 놓을 수 있다.

```text
콘텐츠 > 공통 > 외부 > 제어 > 스탬프 > 데이터
```

왼쪽으로 갈수록 경계 너머에 더 많은 내부 지식이 노출된다.

| 결합 수준 | 경계를 넘어 공유되는 지식 | 프런트엔드에서 볼 수 있는 모습 |
| --- | --- | --- |
| 콘텐츠 | 구현 상세 | 컴포넌트가 다른 모듈의 비공개 필드를 읽거나 내부 DOM을 직접 조작한다 |
| 공통 | 전역 메모리·저장소 | 여러 화면이 전역 작업 공간 전체를 읽고 쓴다 |
| 외부 | 통합에 필요한 전역 메모리·저장소 | 여러 화면이 전역에 저장된 현재 상담원 ID 하나만 공유한다 |
| 제어 | 설계 결정 | 화면이 알림 모듈에 `sms`나 `email`을 넘겨 내부 분기를 고른다 |
| 스탬프 | 데이터 구조 | 자식 컴포넌트가 실제로 쓰지 않는 필드까지 포함한 객체를 받는다 |
| 데이터 | 통합에 필요한 데이터 구조 | 화면이 필요한 상태나 요약만 명시적으로 받는다 |

### 콘텐츠 결합: 공개 인터페이스를 우회한다

콘텐츠 결합은 가장 높은 수준이다. 하위 모듈이 공식 인터페이스를 사용하지 않고 상위 모듈의 구현 세부에 직접 접근한다.

```ts
class TicketStore {
  private tickets = new Map<string, Ticket>();

  get(id: string) {
    return this.tickets.get(id);
  }
}

function urgentBadge(store: TicketStore, id: string) {
  // 공개 메서드가 아니라 비공개 저장소를 직접 읽는다고 가정한다.
  return (store as any).tickets.get(id).priority === 1 ? "긴급" : "";
}
```

이 연결은 `TicketStore`가 저장 방식을 바꾸는 순간 깨진다. 문제는 `urgentBadge`가 공식 인터페이스에 기록되지 않은 지식을 사용한다는 사실을 `TicketStore`가 알기 어렵다는 점이다. 공개 메서드가 있는데도 내부 저장소를 직접 읽는다면 먼저 콘텐츠 결합을 의심할 수 있다.

실습에서는 `store["entries"]`가 컴파일되고 테스트도 통과했다. 그렇더라도 `get`이나 `list`처럼 합의한 인터페이스가 아니므로 저장소 팀은 배지가 내부 값을 읽는다는 사실을 알 수 없다. 타입 검사가 통과한다는 사실과 공식 계약을 사용한다는 사실은 다르다는 점을 확인했다.

### 공통 결합과 외부 결합: 전역 상태를 공유한다

공통 결합은 여러 모듈이 전역 데이터 구조 전체를 읽고 쓰는 경우다.

```ts
export const workspace = {
  tickets: [],
  agents: [],
  drafts: [],
  theme: "light",
};
```

목록 패널, 배정 패널, 일괄 배정 패널이 이 객체를 함께 읽고 쓴다고 하자. 각 패널은 자신이 쓰지 않는 `drafts`와 `theme`까지 알아야 할 수 있다. 데이터 흐름을 따라가기 어렵고, 검증과 동시성 처리도 여러 곳에 흩어진다.

외부 결합도 전역 상태를 사용하지만 공유 범위를 통합에 필요한 데이터로 줄인 경우다.

```ts
window.currentAgentId = "agent-1";
```

현재 상담원 ID 하나만 공유한다면 공통 결합보다 노출되는 지식이 적다. 그래도 전역 상태라는 통로 자체는 남아 있다. 그래서 외부 결합은 공통 결합보다 약하지만, 명시적인 메서드 호출이나 데이터 전달보다 안정적이라고 보기는 어렵다.

공통 결합을 줄이는 실습에서는 전역 `workspace`를 없애고 `createDesk`가 데스크별 상태를 복사해 클로저로 관리하게 했다. 패널은 상태 객체 전체를 읽지 않고 메서드를 호출했다. 필요한 필드만 전역 변수로 나눴다면 외부 결합으로 낮아졌겠지만, 변경 추적과 부작용, 동시성 문제는 여전히 남았을 것이다.

### 제어 결합: 호출자가 실행 흐름을 고른다

화면이 수신 모듈에 플래그나 명령을 넘겨 내부 분기를 고르면 제어 결합이다.

```ts
sendNotification("sms", recipient, message);
```

이 호출을 사용하는 화면은 알림 모듈이 `sms`, `email`, `push`를 지원한다는 사실과 각각의 의미를 알아야 한다. 새 채널을 추가하거나 기존 채널을 없애면 호출부도 확인해야 한다.

문자열을 유니온 타입으로 바꾸는 것만으로는 문제가 완전히 사라지지 않는다.

```ts
type Channel = "sms" | "email" | "push";
sendNotification(channel, recipient, message);
```

값의 오타는 줄지만, 호출자가 채널을 선택하는 책임은 여전히 남아 있다. 제어 결합을 줄이려면 알림 모듈이 수신자 설정과 정책을 보고 전송 방법을 결정하게 해야 한다. 호출자는 “알림을 보내 달라”는 요청만 알면 된다.

실습에서는 `sendNotification`에서 채널 인수를 없애고 수신자의 설정과 연락처를 보고 전송 방식을 고르게 했다. 유니온 타입은 잘못된 채널 문자열을 막았지만, 호출부가 채널을 고르는 책임까지 없애지는 못했다. 타입 안전성과 정보 은닉이 같은 문제는 아니라는 점을 이 과정에서 확인했다.

### 스탬프 결합과 데이터 결합: 필요한 데이터만 남긴다

스탬프 결합은 모듈이 데이터 구조를 주고받되, 실제로 필요한 것보다 많은 필드를 노출하는 경우다.

```ts
type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: "basic" | "vip";
  status: "active" | "suspended";
  internalNotes: string[];
  createdAt: string;
};

function canReply(customer: Customer) {
  return customer.status === "active";
}
```

`canReply`가 실제로 필요한 값은 `status` 하나뿐이다. 그런데 `Customer` 전체를 받으면 이 함수도 이름, 이메일, 내부 메모, 생성일이 포함된 전체 구조를 알아야 한다. CRM 내부 저장 구조를 바꾸려면 이 객체를 받는 모든 코드를 살펴야 한다.

실습에서는 사용하는 쪽이 필요한 값만 공개 인터페이스로 받도록 바꿨다.

```ts
interface StatusSource {
  getStatus(id: string): "active" | "suspended";
}

interface SummarySource {
  getSummary(id: string): {
    displayName: string;
    tier: "basic" | "vip";
  };
}

function canReply(directory: StatusSource, id: string) {
  return directory.getStatus(id) === "active";
}

function customerHeader(directory: SummarySource, id: string) {
  const summary = directory.getSummary(id);
  return `${summary.displayName} (${summary.tier})`;
}
```

이제 `CustomerDirectory`가 내부 레코드를 사용하든, `ProfileDirectoryV2`가 `account.state`와 `account.plan`을 사용하든 호출하는 쪽은 같은 인터페이스를 사용할 수 있다. 공개 계약은 내부 저장 구조보다 작고 안정적이다.

`canReply`와 `customerHeader`의 인자 타입을 필요한 동작만 담은 `StatusSource`와 `SummarySource`로 좁히면 두 저장 구조를 같은 호출부에서 사용할 수 있다. 실행 로직뿐 아니라 타입도 필요한 계약에 맞춰야 구체적인 저장소와의 결합이 줄어든다.

가장 낮은 수준인 데이터 결합은 통합에 필요한 최소한의 데이터를 명시적으로 주고받는다. 통합 전용 DTO를 사용하면 내부 객체와 외부 계약이 서로 영향을 덜 받으며 바뀔 수 있다.

## 결합 수준을 코드에서 판별하는 순서

실습에서는 연결을 다음 네 가지 신호로 표현했다.

```ts
interface Integration {
  bypassesPublicInterface: boolean;
  globalSharing: "none" | "whole" | "needed-only";
  passesControlInfo: boolean;
  dataShape: "minimal" | "whole-structure";
}
```

한 연결이 여러 신호를 동시에 가질 수도 있다. 예를 들어 비공개 구현에 접근하면서 전역 상태와 큰 객체도 함께 사용한다면 가장 높은 수준인 콘텐츠 결합으로 분류한다. 실습의 판별 순서는 다음과 같다.

```ts
if (integration.bypassesPublicInterface) return "content";
if (integration.globalSharing === "whole") return "common";
if (integration.globalSharing === "needed-only") return "external";
if (integration.passesControlInfo) return "control";
if (integration.dataShape === "whole-structure") return "stamp";
return "data";
```

이 순서는 “한 연결에 문제가 하나만 있다”는 뜻이 아니다. 여러 문제가 겹칠 때 변경 위험이 큰 지식부터 드러내려고 실습에서 정한 분류 규칙이다.

분류 함수는 여러 신호가 겹칠 때도 콘텐츠부터 데이터까지 정한 순서로 판별한다. 각 수준의 핵심 조건을 우선순위에 따라 검사해야 비공개 구현 접근과 큰 데이터 구조가 함께 있는 연결도 일관되게 분류할 수 있다. 우선순위 자체가 분류 규칙의 일부다.

## 코드베이스를 읽을 때 던질 질문

이 장을 읽고 나서 결합을 볼 때 다음 세 질문을 먼저 던지려고 한다.

1. 데이터베이스나 전역 저장소를 공유하는 구성요소가 있는가? 전체를 공유하는가, 통합에 필요한 값만 공유하는가?
2. 데이터 구조를 교환하는 인터페이스가 있는가? 받는 쪽이 실제로 쓰는 필드보다 더 많은 정보를 받는가?
3. 공식 인터페이스가 아니라 다른 구성요소의 구현 세부 정보에 의존하는가?

세 질문은 각각 공통 결합과 외부 결합, 스탬프 결합과 데이터 결합, 콘텐츠 결합의 경계를 찾는 데 도움을 준다. 결합 수준의 이름을 외우는 것보다, 어떤 지식이 경계를 넘어가고 그 지식의 변경이 어디까지 퍼지는지를 확인하는 편이 실제 코드 리뷰에 더 유용하다.

## 정리

모듈 결합은 연결을 없애는 문제가 아니다. 화면과 저장소, 컴포넌트와 훅, 서비스와 데이터베이스가 함께 동작하려면 어느 정도의 지식 공유가 필요하다. 설계에서 조절할 수 있는 것은 그 지식의 종류와 범위다.

이번 실습에서 가장 먼저 개선하고 싶었던 것은 공통 결합이었다. 전역 상태 전체를 공유하면 여러 구성요소가 같은 내부 지식을 알아야 하고, 한 변경이 많은 구성요소에 퍼질 수 있기 때문이다. 다만 실제 코드에서는 콘텐츠 결합이나 제어 결합처럼 더 높은 수준의 문제가 있는지 먼저 확인해야 한다.

결합을 판단할 때는 “이 함수가 다른 함수를 호출하는가?”에서 멈추지 않고 다음을 확인해야 한다.

- 내부 구현을 직접 읽는가?
- 전역 상태를 함께 읽고 쓰는가?
- 호출자가 실행 흐름을 고르는가?
- 필요한 것보다 큰 데이터 구조를 넘기는가?

이 질문에 답하면 결합 수준과 변경 전파 범위를 함께 볼 수 있다. 다음에 코드를 리뷰할 때는 모듈 이름이나 파일 수보다, 경계를 넘어 공유되는 지식부터 찾아보려고 한다.

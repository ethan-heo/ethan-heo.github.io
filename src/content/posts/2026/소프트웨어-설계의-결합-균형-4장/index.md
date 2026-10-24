---
title: 무엇을 숨기고 어디까지 열까, 소프트웨어 설계의 결합 균형 4장
category: 소프트웨어 설계
date: 2026-10-16
summary: 모듈의 공개 계약과 숨겨야 할 결정을 구분하고, 티켓 검색과 알림 예제로 정보 은닉의 범위를 정했다.
tags:
  - 독서
  - 소프트웨어_설계
  - 모듈성
  - 정보_은닉
  - 응집도
  - typescript
draft: false
keyPoint: true
related: 2026/소프트웨어-설계의-결합-균형-5장
---
AI와 함께 작성한 글입니다.

모듈을 나눌 때 “무엇을 숨길까?”만 물으면 인터페이스가 지나치게 작아질 수 있다. 사용하는 쪽이 알아야 하는 기능과 맥락은 공개해야 하고, 바뀔 가능성이 높은 구현 결정은 숨겨야 한다.

3장에서는 변경을 어렵게 만드는 불필요한 자유도를 줄이는 방법을 보았다. 4장에서는 반대로, 필요한 변경의 자유도를 모듈 경계 안에 어떻게 남길지 살펴본다.

이번 글의 중심 질문은 다음과 같다.

> 모듈은 무엇을 공개하고, 선택의 폭은 어디까지 열어 두어야 할까?

## 기능·로직·맥락을 나누기

모듈을 설명할 때 세 가지를 구분하면 공개 범위를 정하기 쉽다.

| 구분 | 의미 | 공개 여부 |
| --- | --- | --- |
| 기능 | 모듈이 제공하는 목표 | 공개한다 |
| 로직 | 기능을 구현하는 방식 | 숨긴다 |
| 맥락 | 올바르게 사용하기 위한 환경과 가정 | 필요한 만큼 알린다 |

예를 들어 알림 모듈의 기능은 “새 티켓 알림을 보낸다”이다. 웹소켓을 쓰는지, 재시도하는지, 어떤 엔드포인트를 호출하는지는 로직이다. 로그인 상태나 알림 Provider 안에서 실행해야 한다는 조건은 맥락이다. 전송이 실시간으로 끝났는지 나중에 처리되는지는 화면이 판단에 사용할 수 있는 결과 계약이다.

필드를 지운다고 정보 은닉이 끝나지는 않는다. 화면이 내리던 결정을 모듈 안으로 옮겨야 변경 범위가 실제로 줄어든다.

### 실습 1: 모듈 조건 판별기

현재 구현은 모듈을 네 가지 조건으로 평가한다. 호출할 수 있는 공개 기능이 있는지, 사용에 필요한 맥락이 하나 이상 공개되어 있는지, 로직이 숨겨져 있는지, 독립적으로 분리·교체할 수 있는지를 확인한다. 조건을 만족하지 못하면 `missing`에 누락 항목을 기록하고, 공개해야 하는 기능과 맥락은 `publicKnowledge`에 모은다.

각 조건에서 `isModule`을 바로 판정하지 않고 모든 검사가 끝난 뒤 `missing.length === 0`으로 한 번만 계산한다. 따라서 검사 순서와 관계없이 모든 누락 항목을 반환할 수 있다. 아래 코드는 개념을 보여 주기 위한 축약 예시이며, 타입 정의는 생략했다.

```ts
export function assessModule(descriptor: ModuleDescriptor): ModuleAssessment {
  const missing: MissingModuleProperty[] = [];
  const publicKnowledge: string[] = [];

  if (descriptor.publicFunction?.callable) {
    publicKnowledge.push(descriptor.publicFunction.name);
  } else {
    missing.push("function");
  }

  if (descriptor.context?.length) {
    publicKnowledge.push(...descriptor.context);
  } else {
    missing.push("context");
  }

  if (!descriptor.isLogicHidden) missing.push("hiddenLogic");
  if (!descriptor.independentlyReplaceable) missing.push("replaceability");

  return { isModule: missing.length === 0, missing, publicKnowledge };
}
```

모든 검사를 마친 뒤 `missing.length === 0`으로 `isModule`을 한 번만 계산한다. 이제 검사 순서를 바꿔도 판정과 누락 목록이 어긋나지 않는다. 여러 속성이 동시에 빠졌을 때도 모든 누락 항목을 반환해야 하므로 첫 실패에서 바로 반환하지 않았다. 이 변경은 실습 테스트 6개와 4장 타입 검사를 통과했다.

## 화면이 전송 결정을 내리지 않게 하기

### 실습 2: 알림 모듈의 결정 숨기기

화면이 전송 방식과 재시도 정책을 직접 넘기는 구조를 생각해 보자.

```ts
sendNotification({
  transport: "websocket",
  endpoint: "/realtime/notifications",
  maxAttempts: 3,
  message,
});
```

이 호출부는 웹소켓, 엔드포인트, 재시도 횟수를 모두 알아야 한다. 웹소켓을 다른 방식으로 바꾸면 화면도 함께 고쳐야 한다. 호출부가 `"websocket"` 같은 값을 넘겨 내부 분기를 지시하는 것은 제어 결합이고, 내부 구현을 몰라도 된다고 한 추상화가 실제로는 엔드포인트와 전송 정책을 요구하는 것은 누출 추상화다.

화면에는 업무 입력만 남기고 전송 결정은 모듈 안으로 옮긴다.

```ts
// TransportPort는 성공적으로 실시간 전송을 시작했으면 true,
// 별도 처리를 예약했으면 false를 반환한다고 가정한다.
type NewTicketInput = {
  ticketId: string;
  requesterName: string;
};

type NotifyResult = {
  title: string;
  href: string;
  delivery: "realtime" | "deferred";
};

export function createTicketNotifier(port: TransportPort) {
  return {
    notifyNewTicket(input: NewTicketInput): NotifyResult {
      const title = `${input.requesterName} 고객의 새 티켓`;
      const href = `/tickets/${input.ticketId}`;
      const sent = port.send({
        transport: "websocket",
        endpoint: "/realtime/notifications",
        payload: { title, href },
      });

      return { title, href, delivery: sent ? "realtime" : "deferred" };
    },
  };
}
```

화면은 `ticketId`와 `requesterName`만 넘긴다. 여기서 `port.send()`가 `false`를 반환한다는 것은 전송을 버린다는 뜻이 아니라 별도 처리로 넘겼다는 뜻으로 계약되어 있다고 가정한다. 전송이 실시간으로 끝났는지 나중에 처리되는지는 결과의 `delivery`로 알 수 있지만, 어떤 전송 기술을 썼는지는 알 필요가 없다. 필수 결과는 남기고 구현 결정만 숨겼다.

결과를 줄일 때는 `attempts`를 빼고 `delivery`를 남겼다. 재시도 횟수는 전송 정책의 세부 사항이므로 화면에 필요하지 않다. 반면 `delivery`를 없애면 화면은 실시간 전송 여부를 알기 위해 모듈 내부를 봐야 한다. 정보를 적게 공개하는 것보다 사용하는 쪽이 실제로 필요한 정보를 정확히 공개하는 편이 중요했다.

## 실제 변경만큼만 유연하게 설계하기

### 실습 3: 관찰한 변경만 인터페이스에 반영하기

검색 필터를 다음처럼 모든 필드와 연산자를 받는 범용 객체로 만들 수도 있다.

```ts
type GenericRule = {
  field: string;
  operator: string;
  value: unknown;
};
```

이 타입은 어떤 필드와 연산자도 표현할 수 있어, 호출부와 모듈이 지원 범위를 별도로 합의해야 한다. 그 결과 유효하지 않은 조합을 검증하고 여러 조합을 최적화해야 하는 책임이 늘어날 수 있다.

현재 필요한 조건이 상태, 담당자, SLA 기한뿐이라면 범위를 명시하는 편이 낫다.

```ts
type TicketQueueFilter = {
  status?: TicketStatus[];
  assigneeId?: string;
  slaDueBefore?: Date;
};
```

이 타입으로 표현할 수 없는 조건이 실제로 반복해서 추가될 때 범위를 넓힌다. “언젠가 필요할 것 같다”는 추측만으로 범용 인터페이스를 열면 결합과 구현 부담이 함께 커진다.

실습에서는 상태 값 추가와 담당자 조건 추가라는 실제 변경이 있었고, 다음 변경도 SLA 기한으로 정해져 있었다. 그래서 이 세 조건만 열었다. 임의 필드와 연산자, 중첩 조건은 아직 요청된 적이 없어 범위에서 제외했다. 미래 대비와 추측성 일반화를 가른 기준은 실제로 관찰한 변경이었다.

## 모듈의 깊이와 응집도를 함께 보기

깊은 모듈은 간단한 인터페이스 뒤에 많은 결정을 숨긴다. 알림 모듈의 호출부는 짧지만 내부에는 제목 생성, 링크 생성, 전송, 재시도, 실패 결과 판정이 들어갈 수 있다. 사용하는 쪽이 알아야 할 지식이 적으므로 깊은 모듈에 가깝다. 다만 이런 내부 동작은 실제 구현과 포트의 계약으로 뒷받침되어야 한다.

반대로 필터 모듈에 정렬, 배지 표시, CSV 열 구성까지 넣으면 관련 없는 책임이 섞인다. 검색 조건을 바꾸는 이유와 CSV 표현을 바꾸는 이유는 다르므로, 모듈 밖의 지식은 줄어도 모듈 안의 응집도는 낮아진다.

모듈을 평가할 때는 두 질문을 함께 사용한다.

- 사용하는 쪽이 꼭 알아야 하는 기능과 결과를 공개했는가?
- 함께 바뀌는 결정만 모듈 안에 모았는가?

## 다시 볼 기준

- 이 값은 기능인가, 구현 로직인가, 사용에 필요한 맥락인가?
- 화면이 바뀔 결정을 모듈에 넘기고 있지는 않은가?
- 숨긴 결과가 화면에 꼭 필요한 정보까지 없애지는 않았는가?
- 열어 둔 유연성에 실제 변경 근거가 있는가?
- 모듈 안에 함께 바뀌지 않는 책임까지 들어가지는 않았는가?

모듈성은 정보를 무조건 감추는 기술이 아니다. 필요한 기능과 맥락은 계약으로 남기고, 바뀔 가능성이 높은 결정은 경계 안에 가두는 설계다.

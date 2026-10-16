---
title: 무엇을 숨기고 어디까지 열까, 소프트웨어 설계의 결합 균형 4장
category: 소프트웨어 설계
date: 2026-10-16
summary: 모듈성은 미래의 합리적인 변경을 받아들이는 설계라는 4장의 내용을 티켓 검색·알림·필터 예제 세 개로 실습하며, 모듈을 판정하는 기준과 결정을 숨기는 방법, 자유도를 여는 범위를 정리했다.
tags:
  - 독서
  - 소프트웨어_설계
  - 모듈성
  - 정보_은닉
  - 응집도
  - typescript
draft: false
keyPoint: true
---
3장에서 결합을 자유도를 줄이는 제약으로 봤다면, 4장은 "그렇다면 우리가 열어 둘 자유도는 무엇인가?"를 묻는다. 책의 답은 모듈성이다. 모듈성은 지금 코드를 보기 좋게 나누는 기술이 아니라, 시스템이 미래의 합리적인 변경을 받아들이도록 경계를 정하는 설계다.

책은 모듈을 세 가지 지식으로 설명한다.

| 속성 | 뜻 | 공개 여부 |
| --- | --- | --- |
| 기능 | 모듈이 제공하는 목표 | 공개 인터페이스에 명시한다 |
| 로직 | 기능을 구현하는 방식 | 소비자에게 숨긴다 |
| 맥락 | 동작에 필요한 환경과 가정 | 공개 지식이지만 기능보다 덜 명시적이다 |

좋은 모듈은 바뀔 가능성이 있는 결정을 로직 안에 숨겨서, 그 결정이 바뀌어도 수정이 모듈 안에 머물게 한다. 다만 숨기기만 하면 되는 것은 아니다. 소비자가 알아야 할 정보까지 숨기면 `누출 추상화`가 되고, 모든 변화를 대비하려고 자유도를 지나치게 넓히면 쓰기도 최적화하기도 어려워진다. 그래서 모듈성은 모듈 하나가 아니라 모듈 사이의 `결합`과 모듈 안의 `응집력`을 함께 봐야 평가할 수 있다.

이 흐름을 고객 지원 웹앱 WolfDesk의 티켓 검색·알림·필터를 배경으로 세 개 실습으로 따라가 봤다.

| 실습 | 다룬 내용 | 책 범위 |
| --- | --- | --- |
| 티켓 검색을 모듈로 설명하기 | 모듈의 기능·로직·맥락 | 4.1~4.3.2 |
| 알림 전송 결정을 숨기기 | 정보 은닉·깊은 모듈·누출 추상화 | 4.3.3~4.4.2 |
| 검색 필터의 미래 범위 정하기 | 합리적인 유연성·결합·응집력 | 4.4.3~4.7 |

## 티켓 검색을 모듈로 설명하기

팀이 티켓 검색 코드를 파일과 함수로 나눴는데, 무엇을 모듈이라고 불러야 하는지 기준이 팀원마다 달랐다는 설정이다. 검색 경계의 설명을 받아 모듈인지 판정하는 함수를 만들었다. 서비스·패키지·객체·함수 중 어떤 형태든 같은 기준을 적용해야 한다.

```ts
export function assessModule(descriptor: ModuleDescriptor): ModuleAssessment {
  const result: ModuleAssessment = {
    isModule: false,
    missing: [],
    publicKnowledge: [],
  };

  if (!!descriptor.publicFunction) {
    if (!descriptor.publicFunction.callable) {
      result.isModule = false;
      result.missing.push("function");
    } else {
      result.isModule = true;
      result.publicKnowledge.push(descriptor.publicFunction.name);
    }
  } else {
    result.missing.push("function");
  }

  if (Array.isArray(descriptor.context) && descriptor.context.length > 0) {
    result.publicKnowledge.push(...descriptor.context);
  } else {
    result.isModule = false;
    result.missing.push("context");
  }

  if (!descriptor.isLogicHidden) {
    result.isModule = false;
    result.missing.push("hiddenLogic");
  }

  if (!descriptor.independentlyReplaceable) {
    result.isModule = false;
    result.missing.push("replaceability");
  }

  return result;
}
```

- 공개 지식에는 기능 이름과 맥락을 넣고, 구현 로직은 넣지 않는다.
- 경계의 형태(`kind`)는 판정에 쓰지 않는다. 모듈인지는 물리적인 경계가 아니라 독립 기능을 캡슐화했는지로 정해진다.

처음 구현은 호출할 수 있는 기능만 있으면 모듈로 판정했다. 테스트는 통과했지만 로직이 드러나 있거나 독립적으로 교체할 수 없는 경계도 모듈이 됐다. 책의 정의는 기능 공개, 로직 은닉, 교체 가능성을 함께 요구하므로 두 속성의 누락도 `missing`에 넣도록 고쳤다. 맥락만 빠진 경계도 모듈로 보지 않기로 정했다.

또 하나는 맥락 검사를 `!!descriptor.context`로 쓴 실수다. 테스트는 맥락이 없는 경우를 빈 배열 `[]`로 표현하는데, 빈 배열은 객체라 `!![]`가 `true`다. 그래서 맥락이 비어도 누락으로 잡히지 않았다. '값이 있다'와 '비어 있지 않다'를 같은 것으로 가정한, 3장에서 다룬 암묵적 가정 그 자체였다. 길이로 검사하도록 고쳤다.

남은 아쉬움은 `isModule`을 여러 곳에서 켰다 끄는 구조다. 기능 분기에서 `true`로 켰다가 뒤에서 끄기 때문에 검사 순서를 바꾸면 결과가 틀어질 수 있다. 마지막에 `missing`이 비었는지로 한 번만 정하면 판정과 누락 목록이 어긋날 수 없다.

돌아보기에서는 맥락이 타입에 드러나지 않는 React 훅을 생각해 봤다. 훅이 Provider 안에서만 동작한다는 전제는 소비자가 알아야 하는 공개 지식인데, 시그니처에는 나타나지 않는다. 그러면 Provider 밖에서 호출했을 때 컴파일이 아니라 실행 중에 실패하고, 소비자는 모듈 내부를 열어 봐야 원인을 안다.

## 알림 전송 결정을 숨기기

상담원 화면 세 곳(티켓 목록, 티켓 상세, 대시보드)이 새 티켓 알림을 보낼 때마다 전송 방식·엔드포인트·재시도 횟수를 직접 넘기고, 결과로 시도 횟수와 전송 방식을 받는다. 여기에 문제가 두 가지 겹쳐 있다.

- 인프라 팀이 다음 분기에 웹소켓을 롱 폴링으로 바꾸려 하는데, 지금 구조로는 세 화면을 모두 고쳐야 한다.
- 실시간 전송에 끝내 실패하면 알림은 알림함에만 남는데, 화면은 이 사실을 몰라 상담원이 오지 않을 알림을 기다린다.

첫 번째는 바뀔 결정이 경계 밖에 있는 문제(4.3.3)이고, 두 번째는 필수 정보가 빠진 누출 추상화(4.4.2)다. 리팩터링한 결과는 다음과 같다.

```ts
export interface NewTicketInput {
  ticketId: string;
  requesterName: string;
}

type NotifyDelivery = "realtime" | "deferred";

export interface NotifyResult {
  title: string;
  href: string;
  delivery: NotifyDelivery;
}

const DEFAULT_DELIVERY_POLICY: DeliveryPolicy = {
  transport: "websocket",
  endpoint: "/realtime/notifications",
  maxAttempts: 3,
};

export function createTicketNotifier(
  port: TransportPort,
  policy: DeliveryPolicy = DEFAULT_DELIVERY_POLICY,
): TicketNotifier {
  return {
    notifyNewTicket(input) {
      const title = `${input.requesterName} 고객의 새 티켓`;
      const href = `/tickets/${input.ticketId}`;
      let delivery: NotifyDelivery = "deferred";

      for (let i = 0; i < policy.maxAttempts; i += 1) {
        const sent = port.send({
          transport: policy.transport,
          endpoint: policy.endpoint,
          payload: { title, href },
        });
        if (sent) {
          delivery = "realtime";
          break;
        }
      }

      return { title, href, delivery };
    },
  };
}
```

- 화면이 넘기는 입력은 `ticketId`와 `requesterName`뿐이다.
- 전송 정책은 export하지 않는 `DEFAULT_DELIVERY_POLICY`로 모듈 안에 둔다. 앱 설정 코드가 `createTicketNotifier`를 만들 때 다른 정책을 넘길 수도 있다. 어느 쪽이든 화면은 정책을 모르고, 정책이 바뀌면 고칠 곳은 한 곳이다.
- 결과에서 `attempts`와 `transport`는 빼고 `delivery`를 남겼다.

이 실습에서 가장 오래 붙잡은 질문은 "그럼 필드를 지우기만 하면 되나?"였다. 지우는 것과 숨기는 것은 다르다. 알림은 여전히 어떤 방식으로, 어디로, 몇 번까지 보낼지 정해야 하므로 그 결정은 어딘가에 있어야 한다. 정리하면 이렇다. 모듈은 필수적 복잡성을 없애는 것이 아니라 경계 안에 가둔다.

비슷한 혼동이 하나 더 있었다. 처음 코드도 전송 값을 모듈 함수 안에서 읽기는 했다. 하지만 `input.transport`처럼 화면이 넘긴 값을 그대로 썼으니, 코드가 모듈 안에서 실행됐을 뿐 결정은 화면이 내리고 있었다. 정보 은닉은 코드가 어디서 실행되는지가 아니라, 바뀔 결정을 누가 알고 바뀌면 어디까지 고쳐야 하는지를 묻는다.

결과에 무엇을 남길지는 화면이 그 값으로 무엇을 하는지가 기준이 됐다.

- `attempts`를 남기면 화면에 불필요한 정보를 주게 된다. 화면이 알아야 할 것이 늘고 재시도 정책에 묶인다.
- `delivery`를 빼면 필수 정보가 빠진 누출 추상화가 된다. 화면이 '실시간 연결 끊김'을 보여 주려면 모듈 내부를 봐야 한다.

작은 인터페이스 뒤에 정책, 재시도 루프, 결과 판정을 숨겼으니 4.4.1에서 말하는 `깊은 모듈`에 가깝다.

## 검색 필터의 미래 범위 정하기

마지막은 판단 실습이다. 티켓 목록 위의 필터 바에서 상담원이 상태와 담당자를 고르면, 그 값이 서버 검색 API의 조회 조건으로 바뀐다. 같은 필터 값을 티켓 목록, 건수 배지, CSV 내보내기 세 곳이 쓰는데, 지금은 세 곳이 각자 조회 조건으로 바꾼다. 지난달 담당자 조건을 추가할 때 CSV를 빠뜨려 목록과 내보낸 파일의 티켓 수가 맞지 않는 버그가 났다.

필터 설계로 두 가지가 제안됐다.

```ts
export type GenericRule =
  | { kind: "condition"; field: string; operator: string; value: unknown }
  | { kind: "group"; combinator: "and" | "or"; rules: GenericRule[] };

export interface TicketQueueFilter {
  status?: string[];
  assigneeId?: string;
  slaDueBefore?: Date;
}
```

### 어디까지 열까

`TicketQueueFilter`를 골랐다. 지난 1년 동안 필터가 바뀐 것은 상태 값 추가와 담당자 조건 추가 두 번뿐이었고, 다음 분기에는 SLA 기한 필터 하나가 예정돼 있다. 이 세 가지는 `TicketQueueFilter`로 모두 담긴다.

`GenericRule`이 여는 임의 필드, 임의 연산자, and/or 중첩은 열지 않았다. 이걸 열면 필터를 쓰는 화면이 필드 이름과 연산자 조합을 알아야 하고, 필터 모듈은 가능한 모든 조합을 지원하고 최적화해야 한다. 책의 표현으로는 모든 쿼리를 받을 수 있는 인터페이스는 쓰기 어렵고 최적화하기도 어렵다. 3장에서 저장소를 설계할 때 범용 Query 객체 대신 필요한 조회만 메서드로 낸 것과 같은 판단이다.

### 무엇을 공유하고 무엇을 숨길까

- 기능(화면이 필터 모듈에 넘기는 것): 상태, 담당자, SLA 기한 값
- 로직(필터 모듈 안에서만 아는 것): 필터 값을 서버 조회 조건으로 바꾸는 방법, SLA 기한을 한국 시간 기준으로 계산하는 것. 날짜를 받아 변환하는 작업을 모듈 안에서 처리하기 때문이다.
- 맥락(화면이 알아야 올바르게 쓸 수 있는 전제): 상담원은 자기 팀 티켓만 볼 수 있고 서버가 이 범위를 적용한다. 배지와 CSV에 나오는 수가 팀 범위라는 것을 알아야 그 수를 바르게 읽을 수 있다.

### 세 소비자를 어떻게 묶을까

- **결합**: 지금은 같은 변환 규칙이 세 곳에 중복돼 있어서, 규칙이 바뀌면 세 곳을 모두 고쳐야 하고 하나를 빠뜨리면 결과가 어긋난다. CSV 누락 버그가 바로 그 경우다. 변환 규칙을 필터 모듈 하나로 모으면 세 소비자가 공유하는 지식은 필터 값이라는 작은 계약으로 줄어든다.
- **응집력**: 필터 모듈에는 변환 규칙까지만 넣는다. 정렬, 배지 표시, CSV 열 구성은 각 소비자에 남긴다. 관련 없는 책임까지 한 모듈에 모으면 응집력이 떨어진다.

그래서 "깊은 모듈 하나면 충분한가?"에 대한 답은 "필요하지만 충분하지는 않다"였다. 변환 규칙을 숨긴 깊은 모듈 하나에 더해, 세 소비자와의 관계(공유하는 지식의 양)와 모듈 안 책임의 관련성(응집력)을 함께 맞춰야 한다. 모듈성은 모듈 하나가 아니라 관계로 평가한다는 4.5의 내용이다.

### 언제 다시 볼까

필터 조건을 추가해 달라는 요청이 지난 1년보다 훨씬 자주 들어온다면, "변경이 드물어 필요한 조건만 열면 된다"는 가정이 깨진 것이므로 자유도의 범위를 다시 검토한다. 처음에는 "모듈을 바꿨는데 다른 곳에서 문제가 생기면"을 신호로 적었는데, 이는 어떤 설계에서든 생기는 일반적인 증상이라 이 판단이 틀렸는지 알려 주지 못한다. 신호는 판단이 기댄 가정을 직접 확인할 수 있어야 한다.

## 마무리

이번 장에서 가장 크게 바뀐 생각은 "숨긴다"의 뜻이다. 처음에는 공개 타입에서 필드를 지우는 일로 생각했는데, 실제로는 결정을 내리는 주체를 소비자에서 모듈로 옮기는 일이었다. 결정은 사라지지 않고 경계 안으로 들어갈 뿐이다.

세 실습을 정리하면 질문 세 개로 요약된다.

- 이 경계는 기능을 공개하고, 로직을 숨기고, 맥락을 드러내는가?
- 소비자는 이 값으로 무엇을 하는가? 쓰지 않는 값은 빼고, 꼭 필요한 값은 남겼는가?
- 이 자유도를 여는 근거는 실제로 관찰한 변화인가, '언젠가'라는 추측인가?

그리고 미래 대비 설계와 추측성 일반화의 경계는 결국 근거에서 갈린다. 실제로 관찰한 변경에 근거가 있는 자유도만 열고, 요청 없이 '언젠가'를 가정한 자유도는 열지 않는다. 응집력도 같은 종류끼리 모으는 것이 아니라, 서로 관련되어 함께 바뀌는 책임끼리 묶는 것으로 기준이 바뀌었다.

다음 5장부터는 2부 '차원'이 시작된다. 결합을 어떤 차원으로 관찰해야 모듈성에 기여하는 결합과 복잡성을 키우는 결합을 가려낼 수 있는지가 이어지는 질문이다.

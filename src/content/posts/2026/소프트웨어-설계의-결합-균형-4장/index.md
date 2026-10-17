---
title: 무엇을 숨기고 어디까지 열까, 소프트웨어 설계의 결합 균형 4장
category: 소프트웨어 설계
date: 2026-10-16
summary: 모듈의 조건, 정보 은닉, 유연성의 범위를 티켓 검색·알림·필터 예제로 정리했다.
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
결합을 자유도를 줄이는 제약으로 본다면 반대쪽에는 "어떤 자유도를 열어 둘 것인가?"라는 질문이 남는다. 책은 그 답을 모듈성에서 찾는다. 모듈성은 코드를 보기 좋게 나누는 기술이 아니라, 나중에 생길 만한 변경을 받아들일 수 있도록 경계를 정하는 설계다.

책은 모듈을 세 가지 지식으로 설명한다.

| 속성 | 뜻 | 공개 여부 |
| --- | --- | --- |
| 기능 | 모듈이 제공하는 목표 | 공개 인터페이스에 명시한다 |
| 로직 | 기능을 구현하는 방식 | 소비자에게 숨긴다 |
| 맥락 | 동작에 필요한 환경과 가정 | 공개 지식이지만 기능보다 덜 명시적이다 |

좋은 모듈은 바뀔 가능성이 있는 결정을 로직 안에 숨겨서 수정 범위를 경계 안에 가둔다. 그렇다고 모든 정보를 숨길 수는 없다. 사용하는 쪽에서 꼭 알아야 할 정보까지 감추면 `누출 추상화`가 된다. 아직 필요하지 않은 변화까지 받으려고 자유도를 넓히면 인터페이스가 쓰기 어려워진다. 결국 모듈 자체뿐 아니라 모듈 사이의 `결합`과 모듈 안의 `응집력`도 함께 봐야 한다.

티켓 검색, 알림, 필터 코드를 만들며 세 가지 기준을 확인했다.

| 실습 | 다룬 내용 |
| --- | --- |
| 티켓 검색을 모듈로 설명하기 | 모듈의 기능·로직·맥락 |
| 알림 전송 결정을 숨기기 | 정보 은닉·깊은 모듈·누출 추상화 |
| 검색 필터의 미래 범위 정하기 | 합리적인 유연성·결합·응집력 |

## 티켓 검색을 모듈로 설명하기

첫 실습에서는 티켓 검색 코드의 경계를 설명하는 값을 받아 모듈인지 판정하는 함수를 만들었다. 서비스나 패키지, 객체, 함수처럼 코드의 형태가 달라도 같은 기준을 적용했다.

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

또 하나는 맥락 검사를 `!!descriptor.context`로 쓴 실수다. 테스트는 맥락이 없는 경우를 빈 배열 `[]`로 표현하는데, 빈 배열은 객체라 `!![]`가 `true`다. 그래서 맥락이 비어도 누락으로 잡히지 않았다. '값이 있다'와 '비어 있지 않다'를 같다고 본 암묵적 가정이었다. 길이로 검사하도록 고쳤다.

남은 아쉬움은 `isModule`을 여러 곳에서 켰다 끄는 구조다. 기능 분기에서 `true`로 켰다가 뒤에서 끄기 때문에 검사 순서를 바꾸면 결과가 틀어질 수 있다. 마지막에 `missing`이 비었는지로 한 번만 정하면 판정과 누락 목록이 어긋날 수 없다.

돌아보기에서는 맥락이 타입에 드러나지 않는 React 훅을 생각해 봤다. 훅이 Provider 안에서만 동작한다는 전제는 소비자가 알아야 하는 공개 지식인데, 시그니처에는 나타나지 않는다. 그러면 Provider 밖에서 호출했을 때 컴파일이 아니라 실행 중에 실패하고, 소비자는 모듈 내부를 열어 봐야 원인을 안다.

## 알림 전송 결정을 숨기기

두 번째 실습에서는 티켓 목록, 티켓 상세, 대시보드가 새 티켓 알림의 전송 방식과 엔드포인트, 재시도 횟수를 직접 넘기게 했다. 이 구조에서 두 가지 변경 상황을 살펴봤다.

- 웹소켓을 롱 폴링으로 바꾸면 세 화면을 모두 고쳐야 한다.
- 실시간 전송에 실패해 알림함에만 남아도 화면은 그 사실을 알 수 없다.

첫 번째는 바뀔 결정이 경계 밖에 있는 문제이고, 두 번째는 필수 정보가 빠진 누출 추상화다. 리팩터링한 결과는 다음과 같다.

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

작은 인터페이스 뒤에 정책, 재시도 루프, 결과 판정을 숨겼으니 `깊은 모듈`에 가깝다.

## 검색 필터의 미래 범위 정하기

마지막 실습은 필터 인터페이스의 범위를 정하는 문제다. 상태와 담당자 값을 티켓 목록, 건수 배지, CSV 내보내기에서 함께 쓰지만 세 곳이 각자 서버 조회 조건으로 바꾼다. 담당자 조건을 한곳에만 추가하면 목록과 CSV의 티켓 수가 달라질 수 있다.

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

실습 조건에서는 필터 변경이 상태 값 추가와 담당자 조건 추가 두 번뿐이고, 다음 변경도 SLA 기한 필터로 정해져 있다. 이 범위는 `TicketQueueFilter`로 모두 담을 수 있어서 이 타입을 골랐다.

`GenericRule`이 여는 임의 필드, 임의 연산자, and/or 중첩은 열지 않았다. 이걸 열면 필터를 쓰는 화면이 필드 이름과 연산자 조합을 알아야 하고, 필터 모듈은 가능한 모든 조합을 지원하고 최적화해야 한다. 책의 표현으로는 모든 쿼리를 받을 수 있는 인터페이스는 쓰기 어렵고 최적화하기도 어렵다. 저장소를 설계할 때 범용 Query 객체 대신 필요한 조회만 메서드로 낸 것과 같은 판단이다.

### 무엇을 공유하고 무엇을 숨길까

- 기능(화면이 필터 모듈에 넘기는 것): 상태, 담당자, SLA 기한 값
- 로직(필터 모듈 안에서만 아는 것): 필터 값을 서버 조회 조건으로 바꾸는 방법, SLA 기한을 한국 시간 기준으로 계산하는 것. 날짜를 받아 변환하는 작업을 모듈 안에서 처리하기 때문이다.
- 맥락(화면이 알아야 올바르게 쓸 수 있는 전제): 상담원은 자기 팀 티켓만 볼 수 있고 서버가 이 범위를 적용한다. 배지와 CSV에 나오는 수가 팀 범위라는 것을 알아야 그 수를 바르게 읽을 수 있다.

### 세 소비자를 어떻게 묶을까

- **결합**: 지금은 같은 변환 규칙이 세 곳에 중복돼 있어서, 규칙이 바뀌면 세 곳을 모두 고쳐야 하고 하나를 빠뜨리면 결과가 어긋난다. CSV 누락 버그가 바로 그 경우다. 변환 규칙을 필터 모듈 하나로 모으면 세 소비자가 공유하는 지식은 필터 값이라는 작은 계약으로 줄어든다.
- **응집력**: 필터 모듈에는 변환 규칙까지만 넣는다. 정렬, 배지 표시, CSV 열 구성은 각 소비자에 남긴다. 관련 없는 책임까지 한 모듈에 모으면 응집력이 떨어진다.

그래서 "깊은 모듈 하나면 충분한가?"에 대한 답은 "필요하지만 충분하지는 않다"였다. 변환 규칙을 숨긴 깊은 모듈 하나에 더해, 세 소비자와의 관계(공유하는 지식의 양)와 모듈 안 책임의 관련성(응집력)을 함께 맞춰야 한다. 모듈성은 모듈 하나가 아니라 관계로 평가한다.

### 언제 다시 볼까

필터 조건을 추가하는 요청이 예상보다 자주 들어오면 "필요한 조건만 열어도 된다"는 가정부터 다시 확인해야 한다. 처음에는 "모듈을 바꾼 뒤 다른 곳에서 문제가 생기면"을 신호로 잡았다. 그러나 어느 설계에서나 나타날 수 있는 증상이라 지금 판단이 틀렸는지는 알려 주지 못한다. 다시 볼 시점도 판단의 근거와 직접 연결해야 한다.

## 마무리

정보 은닉을 다시 생각하게 됐다. 공개 타입에서 필드를 지운다고 결정까지 사라지는 것은 아니다. 사용하는 쪽에서 내리던 결정을 모듈 안으로 옮기고, 변경 범위를 경계 안에 가두는 일이 정보 은닉에 가깝다.

나중에 모듈 경계를 정할 때는 다음 세 가지를 다시 확인하려고 한다.

- 이 경계는 기능을 공개하고, 로직을 숨기고, 맥락을 드러내는가?
- 소비자는 이 값으로 무엇을 하는가? 쓰지 않는 값은 빼고, 꼭 필요한 값은 남겼는가?
- 이 자유도를 여는 근거는 실제로 관찰한 변화인가, '언젠가'라는 추측인가?

미래에 대비한 설계와 근거 없는 일반화는 관찰한 변경이 있는지로 구분할 수 있다. 실제 변경 사례가 있는 자유도만 열고, '언젠가 필요할 것 같다'는 이유만으로 범용 인터페이스를 만들지 않는다. 응집력도 비슷해 보이는 코드를 모으는 것이 아니라 함께 바뀌는 책임을 묶는 기준으로 기억해 두려고 한다.

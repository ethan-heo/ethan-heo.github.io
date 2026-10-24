---
title: 결합은 지식이다, 소프트웨어 설계의 결합 균형 1장
category: 소프트웨어 설계
date: 2026-09-30
summary: 구성요소가 서로 알아야 하는 지식을 찾아보고, 티켓 목록 컴포넌트가 API·저장소·상태 관리의 세부 사항을 직접 알지 않도록 경계를 다시 잡았다.
tags:
  - 독서
  - 소프트웨어_설계
  - 결합
  - react
draft: false
keyPoint: true
related: 2026/소프트웨어-설계의-결합-균형-2장
---
AI와 함께 작성한 글입니다.

결합을 줄이려고 파일부터 나누면 무엇을 고쳐야 하는지 판단하기 어렵다. 먼저 구성요소가 함께 동작하려고 어떤 지식을 공유하는지 적어야 한다.

예를 들어 티켓 목록 화면이 API를 직접 호출하면 화면은 API 경로, 응답 구조, 정렬 규칙, 인증 정보가 저장된 위치, 상태 관리 액션의 형태를 모두 알아야 한다. 이 지식이 화면에 모여 있으면 API 응답이나 인증 방식을 바꿀 때 화면도 함께 바뀐다.

이번 글의 질문은 하나다.

> 화면이 알아야 할 지식과 다른 모듈이 맡아야 할 지식을 어떻게 나눌까?

## 화면이 직접 알고 있던 것

문제 상황에서는 화면 안에서 요청, 변환, 상태 업데이트, 렌더링을 모두 처리한다.

```tsx
export function TicketList() {
  const [tickets, setTickets] = useState<any[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const agentId = localStorage.getItem("wd_agent_id");
    axios
      .get(`https://api.wolfdesk.io/v2/tickets?assignee=${agentId}&status=OPEN`)
      .then((res) => {
        const sorted = res.data.items.sort(
          (a: any, b: any) => a.priority - b.priority,
        );
        setTickets(sorted);
        dispatch({ type: "tickets/loaded", payload: res.data.items });
      });
  }, []);

  return tickets.map((ticket) => <span>{ticket.customer.email}</span>);
}
```

화면이 티켓을 보여 주는 기능만 맡는 것처럼 보이지만, 실제로는 API와 저장소의 구현 세부까지 알고 있다. 이 코드를 개선하는 방법은 모두 같은 방향을 가리킨다. 지식마다 바뀔 가능성이 가장 높은 모듈이 맡게 한다.

실습에서는 먼저 화면이 아는 내용을 하나씩 적었다. API 주소와 응답 필드는 눈에 보였지만, `wd_agent_id`라는 저장 키와 `tickets/loaded` 액션의 payload처럼 코드 여러 곳이 암묵적으로 맞춰야 하는 규칙도 있었다. 파일을 나누기 전에 이 목록을 만든 덕분에 무엇을 어느 경계로 옮겨야 하는지 정할 수 있었다.

## 바뀌는 결정을 API 모듈에 맡기기

API 도메인, 버전, 서버 필드 이름, 정렬 기준은 티켓 API 모듈이 맡는다. 화면에는 실제로 사용하는 `Ticket`만 반환한다.

```ts
type TicketDto = {
  ticket_id: string;
  subject: string;
  priority: number;
  created_at: string;
  customer: { email: string };
};

type Ticket = {
  id: string;
  subject: string;
  customerEmail: string;
  createdAt: Date;
  isUrgent: boolean;
};

const toTicket = (dto: TicketDto): Ticket => ({
  id: dto.ticket_id,
  subject: dto.subject,
  customerEmail: dto.customer.email,
  createdAt: new Date(dto.created_at),
  isUrgent: dto.priority === 1,
});

export async function fetchMyOpenTickets(): Promise<Ticket[]> {
  const agentId = getCurrentAgentId();
  const { data } = await httpClient.get<{ items: TicketDto[] }>("/tickets", {
    params: { assignee: agentId, status: "OPEN" },
  });

  return [...data.items]
    .sort((a, b) => a.priority - b.priority)
    .map(toTicket);
}
```

이제 서버가 `created_at`을 `opened_at`으로 바꾸거나 날짜 변환 방식을 바꿔도 화면은 알 필요가 없다. 화면과 API 사이에 공유되는 지식은 `fetchMyOpenTickets`의 반환 계약으로 줄어든다.

요청 코드만 `httpClient`로 옮기는 것만으로는 충분하지 않다. 화면이 여전히 `ticket_id`, `created_at`, `priority`를 읽고 있으면 서버 구조에 대한 지식은 그대로 남는다. 요청과 함께 응답 변환까지 API 모듈이 맡아야 화면의 결합이 실제로 줄어든다.

## 환경 지식은 작은 함수로 감추기

상담원 ID를 `localStorage`에서 읽는다는 사실도 화면의 기능과는 관계가 없다.

```ts
export function getCurrentAgentId(): string | null {
  return localStorage.getItem("wd_agent_id");
}
```

나중에 세션 쿠키나 인증 상태 관리 모듈로 바꾸더라도 호출부는 그대로 둘 수 있다. 같은 방식으로 Axios 사용법도 `httpClient` 안에 감춘다. 중요한 것은 파일을 나누는 행위가 아니라, 변경 이유가 같은 지식을 한곳에 모으는 일이다.

## 화면에 남길 계약

데이터를 가져오고 변환하는 책임을 옮긴 뒤 화면은 렌더링에 필요한 값만 안다.

```tsx
export function TicketList() {
  const tickets = useMyOpenTickets();

  return (
    <ul>
      {tickets.map((ticket) => (
        <li key={ticket.id} data-urgent={ticket.isUrgent}>
          <strong>{ticket.subject}</strong>
          <span>{ticket.customerEmail}</span>
          <time>{formatDateTime(ticket.createdAt)}</time>
        </li>
      ))}
    </ul>
  );
}
```

화면이 더 단순해진 이유는 결합이 사라졌기 때문이 아니다. API와 인증 방식에 관한 지식을 각 모듈 안에 감추고 화면에는 공개 계약만 남겼기 때문이다. 결합은 없애는 대상이라기보다, 어떤 구성요소가 어떤 지식을 맡을지 정하는 기준이다.

## 다시 볼 기준

다음에 컴포넌트가 복잡해 보이면 먼저 파일을 나누지 않고 다음을 묻는다.

- 이 구성요소가 알아야 하는 지식은 무엇인가?
- 그 지식은 화면의 기능인가, 다른 모듈의 구현 방식인가?
- 변경될 가능성이 높은 결정은 어느 경계 안에 둘 것인가?
- 화면에 남겨야 할 공개 계약은 어디까지인가?

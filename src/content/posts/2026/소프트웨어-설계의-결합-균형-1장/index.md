---
title: 결합은 지식이다, 소프트웨어 설계의 결합 균형 1장
category: 소프트웨어 설계
date: 2026-09-30
summary: 결합을 구성요소가 주고받는 지식으로 보고, 티켓 목록 컴포넌트에 얽힌 공유된 지식과 암묵적 지식을 각자 맡을 곳으로 옮겨 봤다.
tags:
  - 독서
  - 소프트웨어_설계
  - 결합
  - react
draft: false
keyPoint: true
---
'소프트웨어 설계의 결합 균형' 1장을 읽고 결합과 결합의 수명주기에 대한 내용을 알았다. `결합`은 구성요소의 상호작용에 필요한 지식을 의미한다. 예를들어 리액트 환경에서 티켓 정보를 보여주기 위해 API 요청이 필요한 상황이라면 컴포넌트와 API 간 상호작용이 이루어져야 한다. 컴포넌트는 API 요청, 응답값에 대한 지식이 필요하다. 이 때 컴포넌트는 API 에 결합된 형태가 된다. `수명주기`는 각 구성요소가 함께 테스트하고, 배포하고, 유지 관리해야 하는 관계를 말한다. 예를들어 모놀리식 구조에서는 다양한 구성요소를 하나의 서비스에 관리해야 해 알아야 할 부분이 많지만 마이크로 서비스에서는 구성요소를 나누어 여러 서비스에서 관리하도록 하여 관리해야 할 부분이 줄어든다. 마이크로 서비스에서는 관리해야 할 부분이 줄어들지만 서비스를 관리해야 하는 상황이 발생할 수 있다.

결합과 수명주기에 대해 예제를 통해 알아본다.

## 티켓 정보를 보여주는 컴포넌트

아래 코드는 Next.js 환경에서 티켓 정보를 API 서비스에 요청하고 응답한 값을 전처리하여 렌더링하는 클라이언트 컴포넌트이다.

```tsx
'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { formatDate } from '@/features/customer/utils/formatDate';

export function TicketList() {
  const [tickets, setTickets] = useState<any[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const agentId = localStorage.getItem('wd_agent_id');
    axios
      .get(`https://api.wolfdesk.io/v2/tickets?assignee=${agentId}&status=OPEN`)
      .then((res) => {
        const sorted = res.data.items.sort((a: any, b: any) => a.priority - b.priority);
        setTickets(sorted);
        dispatch({ type: 'tickets/loaded', payload: res.data.items });
      });
  }, []);

  return (
    <ul className="ticket-list">
      {tickets.map((t) => (
        <li key={t.ticket_id} className={t.priority === 1 ? 'urgent' : ''}>
          <strong>{t.subject}</strong>
          <span>{t.customer.email}</span>
          <time>{formatDate(t.created_at)}</time>
        </li>
      ))}
    </ul>
  );
}
```

예제에서의 결합(지식)을 나열해보면 아래와 같다.
- API (도메인, 버전, 경로, 응답 구조)
- API 쿼리 필드 정보
- API 응답 데이터를 priority를 기준으로 정렬
- priority의 특징(낮을 수록 우선순위가 높음)
- created_at 날짜 형식

나열한 지식을 분류하면 `공유된 지식`으로 나타낼 수 있다. 공유된 지식은 구성요소가 상호작용에 필요한 지식을 말한다. 그리고 아래는 `암묵적 지식`으로 나타낸다.
- wd_agent_id 라는 키값으로 agenId 를 저장하고 사용함
- 리듀서가 'tickets/loaded' 타입과 응답값에 대한 구조를 payload로 필요
- Array.prototype.sort 는 원본 배열을 바꿔 이후 사용되는 곳에 영향을 줌
- formatDate가 created_at 에 의존하여 다른 곳에 사용시 티켓 컴포넌트에 영향을 미칠 수 있음

암묵적 지식은 명시적으로 사용하지 않더라도 영향을 미칠 수 있는 것을 말한다. 이제 컴포넌트 내 여러 지식을 옮겨보는 작업을 진행한다.
## HTTP 클라이언트

목표: Axios로 HTTP 통신을 하고 있다는 것을 공유하고 있다. 컴포넌트에서 axios 사용법을 알 필요없고 다른 클라이언트로 변경하더라도 영향이 미치지 않도록 만드는 것

```ts
import axios from 'axios'

const API_DOMAIN = 'https://api.wolfdesk.io'
const API_VERSION = 'v2'

export const httpClient = {
	get: <ReturnType>(url) => {
		return axios.get<ReturnType>(`${API_DOMAIN}/${API_VERSION}${url}`)
	}
	// ...
}
```
## AgentId 가져오기

목표: AgentId는 localStorage에 저장되어 있지만 세션 쿠키 등으로 관리 될 수 있으므로 직접적으로 사용하지 않도록 하여 업데이트 상황에서 구현부에 큰 영향이 가지 않도록 한다.

```ts
export const getCurrentAgentId = () => {
	return localStorage.getItem('wd_agent_id')
}
```
## API 요청

목표: API 의 경로, 응답 구조, 쿼리 필드 정보, 응답 데이터 정렬, 날짜 형식 일반화에 대한 지식을 한 곳에서 관리도록 한다.

```ts
import { httpClient } from '@/shared/api/httpClient';
import { getCurrentAgentId } from '@/features/auth';
import type { Ticket } from '../model/ticket';

type TicketDto = {
  ticket_id: string; subject: string; priority: number;
  created_at: string; customer: { email: string };
};

const toTicket = (d: TicketDto): Ticket => ({
  id: d.ticket_id,
  subject: d.subject,
  customerEmail: d.customer.email,
  createdAt: new Date(d.created_at),
  isUrgent: d.priority === 1,
});

export async function fetchMyOpenTickets(): Promise<Ticket[]> {
  const agentId = getCurrentAgentId();
  const { data } = await httpClient.get<{ items: TicketDto[] }>('/tickets', {
    params: { assignee: agentId, status: 'OPEN' },
  });
  return [...data.items]
    .sort((a, b) => a.priority - b.priority)
    .map(toTicket);
}
```
## 티켓 상태 

목표: API 요청, 상태 업데이트를 커스텀 훅으로 관리하여 컴포넌트에서 불러 사용하기만 하도록 구성한다.

```ts
import { fetchMyOpenTickets } from '@/features/tickets/api/ticketApi.ts'
import { useDispatch } from 'react-redux';

export const useMyOpenTickets = () => {
	const [tickets, setTickets] = useState([])
	
	useEffect(() => {
		fetchMyOpenTickets().then((items) => {
			setTickets(items)
			dispatch({ type: 'tickets/loaded', payload: res.data.items });
		})
	}, [])
	
	return tickets
}
```

## Ticket 컴포넌트

지식을 이동한 결과 아래와 같이 변경되었다.

```tsx
import { useMyOpenTickets } from '@/features/tickets';
import { formatDateTime } from '@/shared/lib/date';
import styles from './TicketList.module.css';

export function TicketList() {
  const tickets = useMyOpenTickets();
  
  return (
    <ul className={styles.list}>
      {tickets.map((t) => (
        <li key={t.id} data-urgent={t.isUrgent}>
          <strong>{t.subject}</strong>
          <span>{t.customerEmail}</span>
          <time>{formatDateTime(t.createdAt)}</time>
        </li>
      ))}
    </ul>
  );
}
```

분리를 하며 생각이 든 것은 구성요소가 상호작용 시 공유된 지식을 최대한 적게 만드는 것이 이후 유지보수를 할 때 유리할 것이라는 생각이 들었다. 
## 마무리

실무를 하다보면 결합은 낮게 응집도는 높게 구성해야 한다는 것이 머릿속에 각인되어 있다. 그래서 이걸 어떻게 분리할까 부터 생각하는데 막상 하려고 보면 '이래도 될까?' 하는 생각이 들거나 개선 후 '괜히 했나?' 라는 생각이 들었던 적이 있다. 지금 생각해보면 나누어야 할 것들을 제대로 인지하지 못했기 때문이지 않을까 생각한다. 이 책의 1장을 읽고 결합이 지식이라고 표현하는 것을 보고 코드가 더 직관적으로 인지되는 듯 했다. 여러 내용을 통상적으로 지식이라고 인지했기 때문일까? 

결합이라는게 부정적인 의미로 느껴졌지만 지식이라는 관점에서 구성요소 간 상호작용을 위한 도구로써 생각하게 되었다. 결합이 없다면 구성요소와 상호작용을 할 수 없으며 목적을 이룰 수 없다는 관점을 책에서 알게 된 후 결합이 이제는 생각보다 부담스럽지 않은 요소라고 생각된다.
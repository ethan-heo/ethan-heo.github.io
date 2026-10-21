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
AI와 함께 작성한 글입니다.

'소프트웨어 설계의 결합 균형'을 읽으며 가장 기억에 남은 문장은 **결합은 지식**이라는 설명이었다. 두 구성요소가 함께 동작하려면 서로에 관해 알아야 한다. 이때 주고받는 지식이 곧 결합이다.

예를 들어 티켓 목록 컴포넌트가 API를 호출한다면 요청 주소와 매개변수, 응답 구조를 알아야 한다. 컴포넌트는 이 지식만큼 API와 결합한다. `수명주기`는 구성요소를 함께 테스트하고 배포하고 관리해야 하는 기간을 말한다. 결합을 무조건 없애기보다 어떤 지식을 어디에서 맡을지 정하는 일이 먼저다.

책의 설명을 티켓 목록 코드에 적용해 봤다.

## 티켓 정보를 보여주는 컴포넌트

아래 컴포넌트는 API에서 티켓을 받아 정렬한 뒤 화면에 보여 준다.

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

이 코드에서 컴포넌트가 직접 아는 지식은 다음과 같다.

- API 도메인, 버전, 경로와 응답 구조
- API가 받는 조회 조건
- `priority`가 낮을수록 우선순위가 높다는 규칙
- `created_at`의 날짜 형식

코드에 바로 드러나지 않지만 동작에 영향을 주는 지식도 있다.

- 현재 상담원 ID는 `wd_agent_id`라는 키로 `localStorage`에 저장한다.
- 리듀서는 `tickets/loaded` 액션과 원본 응답 구조를 기대한다.
- `Array.prototype.sort`는 원본 배열을 바꾼다.
- `formatDate`는 `created_at`의 형식에 의존한다.

앞의 항목은 구성요소가 상호작용하려고 함께 아는 `공유된 지식`이다. 뒤의 항목은 코드를 읽을 때 바로 보이지 않는 `암묵적 지식`이다. 이 지식들이 화면 컴포넌트 한 곳에 모여 있으니 변경 이유가 다른 코드도 함께 바뀌게 된다.

## HTTP 요청 방식 감추기

컴포넌트가 Axios 사용법까지 알 필요는 없다. HTTP 클라이언트를 따로 두면 Axios를 다른 라이브러리로 바꿔도 화면 코드는 영향을 받지 않는다.

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
## 상담원 ID를 읽는 곳 모으기

상담원 ID는 지금 `localStorage`에 있지만 나중에는 세션 쿠키에서 읽을 수도 있다. 저장 위치를 함수 안에 감추면 인증 방식이 바뀌어도 이 함수를 쓰는 쪽은 그대로 둘 수 있다.

```ts
export const getCurrentAgentId = () => {
	return localStorage.getItem('wd_agent_id')
}
```
## API 지식을 한곳에 모으기

경로와 조회 조건, 응답 구조, 정렬 기준, 날짜 변환은 API 모듈이 맡는다. 화면에서는 서버의 필드 이름 대신 화면에서 쓸 `Ticket`만 알면 된다.

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
## 상태 관리를 훅으로 분리하기

API 호출과 상태 업데이트는 커스텀 훅으로 옮겼다. 컴포넌트에는 티켓을 가져오는 절차 대신 받아서 보여 주는 코드만 남는다.

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

## 화면 컴포넌트에 남은 코드

지식을 각각 맡을 곳으로 옮기고 나니 컴포넌트에는 렌더링에 필요한 코드만 남았다.

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

## 마무리

그동안은 “결합도는 낮고 응집도는 높아야 한다”는 문장을 먼저 떠올렸다. 그래서 코드를 보면 무엇을 나눌지부터 고민했고, 나눈 뒤에도 이게 맞는지 판단하기 어려웠다.

결합을 지식으로 바꿔 생각하니 기준이 조금 선명해졌다. 먼저 구성요소가 무엇을 알아야 함께 동작하는지 적고, 그 지식을 맡을 곳을 정하면 된다. 결합은 없애야 할 문제가 아니라 상호작용에 필요한 도구다. 다만 한 구성요소가 알 필요 없는 지식까지 떠안지 않도록 경계를 정해야 한다.

---
title: 복잡성과 커네빈 프레임워크, 소프트웨어 설계의 결합 균형 2장
category: 소프트웨어 설계
date: 2026-10-03
summary: 커네빈 프레임워크로 복잡성을 다섯 도메인으로 나눠 보고, 문서 없는 레거시 배정 API를 타입과 변환 함수, 등록 확인 요청으로 명확하게 다뤄 봤다.
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

책에서는 변경과 결과의 관계로 복잡성을 설명한다. 코드를 바꾼 뒤 어떤 결과가 생길지 예측하기 어렵다면 둘 사이의 인과관계가 느슨한 상태다. 코드에 드러난 결합이 많으면 변경 경로를 따라갈 수 있지만, 암묵적 지식이 많으면 직접 바꿔 보고 결과를 확인해야 한다.

커네빈 프레임워크는 문제 상황을 다섯 도메인으로 나눈다.

- 명확: 해야 할 일과 예상 결과를 알고 있다.
- 복합: 해결 방법은 모르지만 전문가가 분석하면 답을 찾을 수 있다.
- 복잡: 미리 정답을 알 수 없어 실험하고 결과를 관찰해야 한다.
- 혼돈: 원인 분석보다 상황을 안정시키는 조치가 먼저다.
- 무질서: 어느 도메인에 해당하는지 아직 판단하지 못했다.

문서가 없는 레거시 API를 예로 삼아 복잡한 상황을 어떻게 다룰지 정리했다.

## 예제

티켓을 상담원이나 팀에 배정하는 레거시 API가 있다. 만든 사람은 퇴사했고 문서도 남아 있지 않다. 여러 번 호출해 본 뒤에야 다음 규칙을 알아냈다고 가정했다.

- 상담원에게 배정할 때 `target`은 **소문자 이메일**이어야 한다. 대문자가 섞이면 실패한다.
- 팀에 배정할 때 `target`은 `"TEAM:"` 뒤에 **대문자 팀 코드**를 붙여야 한다. 예: `"TEAM:BILLING"`
- 형식이 틀려도 API는 **200 OK를 돌려주고 암묵적으로 등록하지 않는다.**

알아낸 규칙을 프런트엔드 코드에 드러내서 같은 시행착오를 반복하지 않는 것이 목표다.

정한 조건은 세 가지다.

- 잘못된 형식은 컴파일 단계에서 찾는다.
- `"TEAM:"` 접두사와 소문자 변환 규칙은 한곳에서 관리한다.
- API가 성공으로 응답해도 실제 배정 결과를 다시 확인한다.

```ts
// features/assignment/api/assignApi.ts
export function assignTicket(ticketId: string, target: string) {
  return httpClient.post(`/legacy/assign/${ticketId}`, { target });
}
```

```tsx
// features/assignment/ui/AssignMenu.tsx
<MenuItem onClick={() => assignTicket(ticket.id, agent.email)}>{agent.name}</MenuItem>
<MenuItem onClick={() => assignTicket(ticket.id, team.code)}>{team.name}</MenuItem>
```

문자열 하나로 받던 `target`을 상담원과 팀으로 구분한 유니온 타입으로 바꿨다. API가 요구하는 문자열은 `toTarget`에서 만들고, 배정 요청 뒤에는 확인 API를 호출한다.

```ts
type Target = {
	kind: 'agent';
	email: string;
} | {
	kind: 'team';
	code: string;
}

const toTarget = (target: Target) => {
	switch(target.kind) {
		case 'agent':
			return target.email.toLowerCase()
		case 'team':
			if(!target.code) throw new AssignTeamCodeError(target)
			return `TEAM:${target.code}`
	}
}

export async function assignTicket(ticketId: string, target: Target) {
  await httpClient.post(`/legacy/assign/${ticketId}`, { target: toTarget(target) });
  
  const { data } = await httpClient.get(`[티켓 등록 확인 API]`)
  
  if (!data.등록_여부) throw new AssignFaildError(ticketId, target)
}
```

```tsx
// features/assignment/ui/AssignMenu.tsx
<MenuItem onClick={() => assignTicket(ticket.id, { kind: 'agent', email: '이메일' })}>{agent.name}</MenuItem>
<MenuItem onClick={() => assignTicket(ticket.id, { kind: 'team', code: '코드' })}>{team.name}</MenuItem>
```

## 정리

태그드 유니온을 쓰면 `assignTicket`에 어떤 대상을 넘길 수 있는지 타입에서 확인할 수 있다. 문자열 형식은 `toTarget` 한곳에서 책임지므로 호출하는 화면은 접두사나 대소문자 규칙을 알 필요가 없다.

확인 요청도 필요하다. 이 API는 형식이 틀려도 `200 OK`를 돌려주기 때문에 HTTP 응답만으로는 성공을 판단할 수 없다. 배정 결과를 다시 조회해야 암묵적인 실패를 코드에서 다룰 수 있다.

이번 예제로 복잡성이 사라지지는 않았다. 실험으로 알아낸 규칙을 타입과 변환 함수, 확인 요청에 남겨 다음 변경의 결과를 예측할 수 있게 만들었다. 다시 비슷한 API를 만난다면 먼저 문서에 없는 규칙을 찾고, 그 규칙을 호출부 밖 한곳에 모으려고 한다.

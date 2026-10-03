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
2장에서는 복잡성과 복잡성을 측정하는 커네빈 프레임워크에 대해 배운다. 구성요소를 변경을 한 후 결과를 예측할 수 없을 때 복잡성이 나타난다. 이러한 상황은 인과관계로 연관시킬 수 있다. 인과관계에서의 결합은 변경과 결과 사이의 단단함으로 표현된다. 그리고 1장의 구성요소간 결합과 연관시켜 결합이 명시적일 수록 인과관계도 단단해진다. 암묵적인 결합(지식)이 많을 수록 인과관계는 느슨해진다. 커네빈 프레임워크에서는 이러한 인과관계를 바탕으로 복잡성을 5단계(명확, 복합, 복잡, 혼돈, 무질서) 도메인으로 나눈다.

- 명확 도메인: 문제를 인지하고 내가 무엇을 해야하며 어떤 결과가 나올지 명확히 아는 상태이다.
- 복합 도메인: 문제를 인지했지만 내가 무엇을 해야하는지 모르는 상태이다. 하지만 전문가의 도움으로 해결할 수 있다.
- 복잡 도메인: 복합 도메인과 유사한 상태이지만 전문가의 도움을 받을 수 없는 상황이다. 실험 -> 결과 -> 회고를 반복해 복합 도메인으로 변경해 나가야한다. 결국 자신이 도메인 전문성을 높여야 하는 상황이다.
- 혼돈 도메인: 문제가 일어났지만 어떻게 해야할지 모르는 상태이다. 즉, 천재지변과 같은 상황을 의미한다.
- 무질서 도메인: 자신의 도메인 전문성이 전무한 상태이다. 

코드를 리팩토링하는 과정에서 커네빈 프레임워크를 문제를 측정하는데 사용해보자. 

## 예제

티켓을 등록하는 레거시 API를 사용한다. 이 API를 만든 사람은 퇴사를 했고 문서도 존재하지 않는다. 이 상태는 복잡 도메인으로 볼 수 있으며 검증을 위해 아래와 같이 수행했다. 

- 상담원에게 배정할 때 `target`은 **소문자 이메일**이어야 한다. 대문자가 섞이면 실패한다.
- 팀에 배정할 때 `target`은 `"TEAM:"` 뒤에 **대문자 팀 코드**를 붙여야 한다. 예: `"TEAM:BILLING"`
- 형식이 틀려도 API는 **200 OK를 돌려주고 암묵적으로 등록하지 않는다.**

복잡한 상태를 프론트엔드 관점에서 명확하게 만들어보자. 

**요구사항**:  
- 다른 개발자가 형식을 잘못 넘기면 **컴파일 단계에서** 알 수 있어야 한다.
- `"TEAM:"`이나 소문자 변환 같은 형식 지식은 **한 곳에만** 있어야 한다.
- 암묵적으로 실패하는 문제에 대해 프런트엔드에서 할 수 있는 대비책을 작성한다.

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

**해결 방안**:
- `assignTicket` 함수의 두 번째 인자에 두 가지 형식의 값이 입력되는 것을 판별할 수 있어야 한다.
- `assignTicket` 내부에서 target을 구분하여 API가 원하는 데이터 형식으로 변환한다.
- 등록되었는지 확인하기 위해 레거시 API 호출 후 등록되었는지 확인하는 API를 사용하여 등록 여부를 확인 후 에러 처리를 내뱉도록 한다.

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

결과: 
- `assignTicket` 함수의 두 번째 인자를 Tagged 유니온으로 정의하여 값이 무엇으로 들어올 수 있는지 명확히 정의한다. 
- target 값을 요청값 조건에 맞춰 변경하는 `toTarget` 함수를 적용한다. 어떤 종류의 값이 변환되어 설정되는지 알 수 있다.
- 레거시 API 요청 후 등록 확인 API를 사용해 등록 여부를 확인 후 등록이 안되어 있다면 에러를 내뱉도록 하여 어느 부분이 잘못되었는지 인지할 수 있다.

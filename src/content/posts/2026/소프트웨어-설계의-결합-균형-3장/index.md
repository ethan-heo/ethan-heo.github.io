---
title: 결합으로 자유도를 줄이기, 소프트웨어 설계의 결합 균형 3장
category: 소프트웨어 설계
date: 2026-10-15
summary: 복잡성은 크기가 아니라 상호작용의 성격에서 온다는 3장의 내용을 티켓 콘솔 예제 다섯 개로 실습하며, 숨은 가정과 중복된 규칙을 드러내고 제약으로 자유도를 줄여 봤다.
tags:
  - 독서
  - 소프트웨어_설계
  - 복잡성
  - 자유도
  - typescript
draft: false
keyPoint: true
---
3장은 "무엇이 시스템을 복잡하게 만드는가?"를 묻는다. 책의 답은 시스템의 크기나 구성요소의 수가 아니라 구성요소 사이 상호작용의 성격이다. 상호작용이 `선형적`이면 무언가를 바꿨을 때 어디에 영향이 갈지 미리 알 수 있다. 반대로 `복잡한 상호작용`은 바꿔 보고 관찰해야만 결과를 알 수 있다. 2장의 커네빈 프레임워크로 보면 복잡 도메인에 해당한다.

복잡한 상호작용은 주로 코드에 드러나지 않은 `암묵적 지식`과 높은 `자유도`에서 생긴다. 자유도는 다른 값에 묶이지 않고 바뀔 수 있는 독립 변수의 수다. 자유도가 높을수록 시스템이 가질 수 있는 상태가 많아지고, 그중에는 원치 않는 상태도 섞여 있다. 자유도를 줄이는 수단이 `제약`이고, 구성요소 사이에 제약을 거는 설계 도구가 바로 `결합`이다. 그래서 책은 결합을 없앨 대상이 아니라 설계할 대상으로 본다.

이 흐름을 고객 지원 상담원이 쓰는 '티켓 콘솔'(React·TypeScript)을 배경으로 다섯 개 실습으로 따라가 봤다.

| 실습 | 다룬 내용 | 책 범위 |
| --- | --- | --- |
| 바꾼 건 필터 하나인데 | 선형적 상호작용과 복잡한 상호작용 | 3.1~3.2 |
| 합칠까, 쪼갤까 | 전역 복잡성과 지역 복잡성 | 3.3 |
| 목록에선 긴급, 상세에선 보통 | 자유도와 중복된 규칙 | 3.4 |
| 거꾸로 된 기간 | 제약으로 자유도 줄이기 | 3.5 |
| 화면이 서버 필드 이름을 몰라도 되게 | 결합·자유도·제약: 저장소 설계 | 3.6~3.9 |

## 바꾼 건 필터 하나인데

검색 필터 모듈은 마지막으로 쓴 필터를 `localStorage`의 `ticket-filter` 키에 저장한다. 저장 형식을 문자열에서 JSON으로 바꾸면서 에디터의 'Find references'로 필터 모듈을 import하는 곳을 모두 확인했다. 그런데 배포 다음 날 필터 모듈을 import하지 않는 '최근 검색 위젯'과 'CSV 내보내기 버튼'이 깨졌다. 두 모듈이 같은 키를 직접 읽고 있었기 때문이다.

변경의 영향을 두 종류로 나눠 보여 주는 분석 함수를 만들었다.

- `traceable`: 바꾼 모듈을 직접·간접으로 import하는 모듈. 인과관계가 드러나는 선형적 상호작용이다.
- `hidden`: import로는 이어지지 않지만 바꾼 모듈과 같은 가정(예: `storage:ticket-filter`)을 공유하는 모듈. 복잡한 상호작용이다.

```ts
export function analyzeChangeImpact(modules: ConsoleModule[], changed: ModuleId): ChangeImpact {
  const changedModule = modules.find(module => module.id === changed);
  if (!changedModule) return { traceable: [], hidden: [] };

  const traceable = collectImporters(modules, changed);
  traceable.delete(changed);
  const hidden: Set<ModuleId> = new Set();

  for (const module of modules) {
    if (module.id === changed) continue;
    if (traceable.has(module.id)) continue;
    if (!module.assumptions.some(assumption => changedModule.assumptions.includes(assumption))) continue;

    hidden.add(module.id);
  }

  return {
    traceable: [...traceable].sort(),
    hidden: [...hidden].sort(),
  };
}
```

처음 구현에서는 import를 거꾸로 따라가는 재귀에 방문 기록이 없어서 순환 import가 있으면 끝나지 않았다. 이미 방문한 모듈은 다시 탐색하지 않도록 `visited`를 넘겨 고쳤다.

'Find references'가 영향 범위를 놓친 이유는 이 도구가 import 관계, 즉 선형적 상호작용만 보여 주기 때문이다. 위젯과 버튼은 `ticket-filter` 키의 형식이라는 암묵적 지식으로 필터 모듈과 이어져 있었다. 이 결합은 도메인에서 온 것이 아니라 설계가 남긴 것이므로 `우발적 복잡성`이다. 해결 방향은 숨은 가정을 드러난 관계로 바꾸는 것이다. `ticket-filter` 읽기·쓰기를 필터 모듈의 함수로 감싸고 위젯과 버튼이 그 함수를 import하면, 같은 변경이 다음에는 'Find references'에 잡힌다.

같은 실습에서 "import 경로 없이 가정을 공유하는 모듈 쌍"의 수도 셌다. import로만 이어진 모듈 50개는 0이고, 모듈 3개 중 2개가 가정을 공유하면 1이다. 모듈 수와 복잡성은 상관이 없다는 3.2.3의 내용을 숫자로 확인했다.

## 합칠까, 쪼갤까

티켓 상세 화면은 함수와 훅 12개가 파일 4개에 흩어져 있다. 팀 안에서 의견이 갈렸다는 설정이다.

- 민지: 파일을 하나로 합치면 파일 사이 의존이 0이 되니 단순해진다.
- 준호: 함수마다 파일을 하나씩 두면 각 파일이 아주 단순해진다.

호출 하나를 상호작용 하나로 보고, 같은 파일 안의 호출은 `지역 복잡성`, 파일 경계를 넘는 호출은 `전역 복잡성`으로 세는 함수를 만들었다.

```ts
export function measureComplexity(calls: Call[], grouping: Grouping): ComplexityReport {
  const local = Object.values(grouping).reduce(
    (acc, group) => ((acc[group] = 0), acc),
    {} as ComplexityReport["local"],
  );
  let global = 0;

  for (const { from, to } of calls) {
    if (grouping[from] === grouping[to]) {
      local[grouping[from]]++;
    } else {
      global++;
    }
  }

  return {
    local,
    maxLocal: Math.max(0, ...Object.values(local)),
    global,
  };
}
```

상세 화면의 호출 13개로 세 가지 묶음을 비교한 결과는 다음과 같다.

| 묶음 | global | maxLocal | global + Σlocal |
| --- | --- | --- | --- |
| 지금의 파일 4개 | 9 | 2 | 13 |
| 민지 안 (한 파일로 합치기) | 0 | 13 | 13 |
| 준호 안 (함수마다 파일 하나) | 13 | 0 | 13 |

어떻게 묶든 합은 13이다. 민지 안은 전역 복잡성을 0으로 만들었지만 그만큼 한 파일 안의 지역 복잡성이 커졌고, 준호 안은 그 반대다. 묶는 방식은 복잡성이 **어디에** 생기는지만 바꿀 뿐 양을 줄이지 못한다. 두 안 모두 복잡성을 크기와 같은 것으로 본 셈이다. 결국 전역과 지역을 함께 보고 균형을 잡아야 하고, 그 방법은 10장에서 다룬다고 한다.

구현하면서 `splitAll`에 쓴 정규식 `/^[A-Z]{0,1}/`이 0글자도 허용해 모든 이름에 일치한다는 실수를 했다. 훅과 함수까지 `.tsx`가 됐는데, 테스트는 구성요소 개수만 확인해서 통과했다. `/^[A-Z]/`로 고쳤다.

## 목록에선 긴급, 상세에선 보통

'긴급 티켓'을 두 곳에서 보여 준다. 목록 배지는 "긴급"이라고 쓰고, 상세 헤더는 붉은 톤으로 칠한다. 기준은 "열려 있고, 우선순위가 높고, 열린 지 4시간이 지난 티켓"이다. 운영팀이 기준을 잠시 2시간으로 바꿔 달라고 했을 때 목록 쪽만 고쳐서, 목록에는 긴급인데 상세에는 보통으로 보이는 티켓이 생긴 적이 있다.

리팩터링 전 두 화면은 같은 규칙을 각자 구현하고 있었다.

```ts
// ticketListBadge.ts
export function listBadge(ticket: Ticket, now: Date): string {
  const hoursOpen = (now.getTime() - ticket.openedAt.getTime()) / 3_600_000;
  if (ticket.status === "open" && ticket.priority === "high" && hoursOpen >= 4) {
    return "긴급";
  }
  return ticket.status === "open" ? "열림" : "처리됨";
}

// ticketDetailHeader.ts
export function detailHeaderTone(ticket: Ticket, now: Date): "danger" | "normal" {
  const elapsedMs = now.getTime() - ticket.openedAt.getTime();
  const isHigh = ticket.priority === "high";
  const isStillOpen = ticket.status !== "closed";
  return isHigh && isStillOpen && elapsedMs >= 4 * 60 * 60 * 1000 ? "danger" : "normal";
}
```

같은 규칙의 구현이 두 개이므로 이 규칙의 자유도는 2다. 자유도 2는 '두 구현이 같다'와 '서로 다르다'라는 두 상태를 허용하고, 지난달 사고는 '서로 다르다'라는 원치 않는 상태가 실제로 나타난 것이다.

나란히 놓고 보니 지금도 미묘하게 다르다. 목록은 `status === "open"`, 상세는 `status !== "closed"`로 열림을 판단한다. 지금은 상태가 `"open" | "closed"` 둘뿐이라 결과가 같지만, `"pending"` 같은 상태가 추가되면 두 식의 결과가 갈린다. '지금은 우연히 같은' 상태 자체가 자유도가 만든 잠재적 위험이었다.

판정 규칙을 `urgencyPolicy.ts`의 `isUrgent` 한 곳으로 옮기고, 열림 조건은 "열림 상태만 긴급 후보"로 정했다.

```ts
// urgencyPolicy.ts
export function isUrgent(ticket: Ticket, now: Date): boolean {
  const isHigh = ticket.priority === "high";
  // 응답 대기처럼 고객 쪽을 기다리는 상태는 긴급으로 보지 않는다
  const isStillOpen = ticket.status === "open";
  const hoursOpen = (now.getTime() - ticket.openedAt.getTime()) / 3_600_000;

  return isHigh && isStillOpen && hoursOpen >= 4;
}
```

```ts
// ticketListBadge.ts
export function listBadge(ticket: Ticket, now: Date): string {
  if (isUrgent(ticket, now)) {
    return "긴급";
  }

  switch (ticket.status) {
    case "open":
      return "열림";
    case "closed":
      return "처리됨";
  }
}

// ticketDetailHeader.ts
export function detailHeaderTone(ticket: Ticket, now: Date): "danger" | "normal" {
  return isUrgent(ticket, now) ? "danger" : "normal";
}
```

`listBadge`의 `switch`에는 `default`를 두지 않았다. 처음에는 `default: throw`를 넣었는데, 이렇게 하면 상태가 추가돼도 컴파일 오류 없이 실행 중에 예외가 난다. `default`를 빼면 반환 타입 때문에 처리하지 않은 상태가 생겼을 때 컴파일 단계에서 오류(TS2366)가 난다.

이 리팩터링으로 두 화면은 `urgencyPolicy.ts`와 새로 결합했다. 그런데도 복잡성은 줄었다. 두 화면은 리팩터링 전에도 같은 규칙(지식)을 공유하는 암묵적 결합 상태였고, 리팩터링은 결합을 새로 만든 것이 아니라 숨은 결합을 `import`로 드러낸 것이기 때문이다. 복잡성은 연결의 수가 아니라 원치 않는 상태가 생길 가능성으로 판단한다. 규칙을 한 곳에 모으자 두 구현이 어긋난 상태 자체가 사라졌다.

## 거꾸로 된 기간

티켓 목록의 기간 필터는 URL 쿼리(`?from=2026-10-01&to=2026-10-11`)를 `{ from, to }` 객체로 들고 다니고, 이 객체를 날짜 선택기, 티켓 목록, CSV 내보내기 버튼이 함께 쓴다. 상담원이 URL을 고쳐 `from`이 `to`보다 늦어지자 문제가 줄줄이 생겼다.

- 목록은 빈 화면, 내보내기는 서버 400 오류를 냈다.
- 날짜 선택기는 경고를 띄웠지만, 세 곳의 검사 방식이 달라 경고가 뜬 상태에서도 내보내기 버튼이 눌렸다.
- 서버의 90일 조회 한도는 내보내기 버튼만 알고 있었다.
- 한 컴포넌트가 객체의 `to`를 직접 바꿔 다른 화면이 예고 없이 바뀌었다.

`{ from, to }`는 두 문자열이 서로 독립적이고 바꿀 수도 있다. 그래서 거꾸로 된 기간, 90일 초과, 존재하지 않는 날짜, 다른 컴포넌트가 바꾼 기간을 모두 표현할 수 있다. 책의 코드 3.3에서 아무 값이나 넣을 수 있는 `Triangle`이 유효하지 않은 삼각형을 표현할 수 있던 것과 같다.

책의 코드 3.4는 값을 바꾸는 길을 하나로 좁히고 그 길에서 제약을 검사한다. 같은 구조로 처음부터 유효한 기간만 될 수 있는 `Period`를 만들었다.

```ts
export const MAX_PERIOD_DAYS = 90;

export interface Period {
  readonly from: string;
  readonly to: string;
  /** 양 끝을 포함한 일수 */
  readonly days: number;
}

export function createPeriod(from: string, to: string): Period {
  const DAY_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/;

  if (!DAY_FORMAT_REGEX.test(from) || !DAY_FORMAT_REGEX.test(to))
    throw new Error("날짜는 YYYY-MM-DD 형식어야 합니다.");

  const fromTemporal = Temporal.PlainDate.from(from);
  const toTemporal = Temporal.PlainDate.from(to);

  if (Temporal.PlainDate.compare(toTemporal, fromTemporal) === -1)
    throw new Error(`올바른 형식의 날짜가 아닙니다`);

  const days = fromTemporal.until(toTemporal).days + 1;

  if (days > MAX_PERIOD_DAYS) throw new Error(`${MAX_PERIOD_DAYS}가 넘으면 안됩니다.`);

  return Object.freeze({ from, to, days });
}

export function changeEnd(period: Period, to: string): Period {
  return createPeriod(period.from, to);
}
```

- 생성 함수에서 형식, 실재하는 날짜, 순서, 90일 한도를 모두 검사한다. `2026-02-30`처럼 존재하지 않는 날짜는 `Temporal.PlainDate.from`이 `RangeError`를 던진다.
- `Object.freeze`로 만든 뒤에는 바꿀 수 없게 해서 공개 필드로 제약을 우회하지 못하게 했다.
- 종료일을 바꾸는 `changeEnd`도 `createPeriod`를 다시 거치므로 값을 바꾸는 길도 같은 제약을 지난다.

처음에는 날짜 검사는 `Temporal`, 일수 계산은 `Date`로 섞어 썼고, 90일 검사에 상수 대신 숫자 `90`을 직접 쓰기도 했다. 앞 실습에서 정리한 '규칙은 한 곳에'가 같은 파일 안에서 깨진 것이라 `Temporal.PlainDate`의 `until`과 `MAX_PERIOD_DAYS`로 통일했다.

`Period`도 `from`·`to` 두 값을 갖지만, 순서·90일·실재 날짜·불변이라는 제약으로 두 값이 서로 묶여 있다. `days`는 두 값에서 계산되므로 독립 변수가 아니다. 결과적으로 `Period`는 유효한 기간만 표현한다.

커네빈 프레임워크로 보면 제약은 원인과 결과를 이어 준다. 리팩터링 전에는 세 컴포넌트가 각자 다른 방식으로 검사해서 "경고"라는 원인이 "버튼 비활성"이라는 결과로 이어지지 않았다. 복잡 도메인의 모습이다. `Period`로 제약을 한 곳에 걸면 세 컴포넌트의 관계가 명확 도메인에 가까워진다.

## 화면이 서버 필드 이름을 몰라도 되게

마지막 실습은 3.7의 저장소 예제를 프런트엔드로 옮긴 것이다. 지금 화면은 검색 문자열을 직접 만들고, 응답의 서버 필드 이름을 컴포넌트에서 그대로 쓴다.

```ts
searchTickets("tenant_id=t-10&opened_on<=2026-07-11");
```

백엔드가 `opened_on`을 `opened_at`으로 바꾼다고 공지하자, 이 이름이 문자열과 컴포넌트 곳곳에 흩어져 있다는 것을 알게 됐다. 화면에서 실제로 쓰는 조회는 세 가지뿐이었다.

- 테넌트의 모든 티켓
- 테넌트에서 특정 시각 이전에 열린 티켓
- 테넌트에서 특정 상태인 티켓

책은 저장소 인터페이스 설계를 세 가지로 비교한다.

| 설계 | 프런트엔드에서 | 화면이 공유하는 지식 | 자유도 |
| --- | --- | --- | --- |
| A. SQL `WHERE` 문자열 | 검색 문자열을 직접 만든다 | 필드 이름(명시적), 문자열 문법과 서버가 그 조건을 처리한다는 가정(암묵적) | 가장 크다 |
| B. Query 객체 | 필드 이름을 담은 필터 객체를 넘긴다 | 문법은 저장소가 감추지만 필드 이름은 여전히 공유한다 | 조건을 마음대로 조합할 수 있어 크다 |
| C. 파인더 메서드 | 필요한 조회만 메서드로 제공한다 | 메서드 이름과 매개변수뿐이다 | 가장 작다 |

세 가지 조회만 제공하는 설계 C로 `TicketRepository`를 만들었다.

```ts
export interface TicketRepository {
  allTickets(tenantId: string): Ticket[];
  openedBefore(tenantId: string, date: Date): Ticket[];
  matchingStatus(tenantId: string, status: TicketStatus): Ticket[];
}

export function createTicketRepository(backend: TicketBackend): TicketRepository {
  const normalizeRow = (row: TicketRow): Ticket => ({
    id: row.ticket_id,
    tenantId: row.tenant_id,
    status: row.status,
    openedOn: new Date(row.opened_on),
    title: row.title,
  });

  return {
    allTickets(tenantId) {
      return backend.select((row) => row.tenant_id === tenantId).map(normalizeRow);
    },
    openedBefore(tenantId, date) {
      return backend
        .select(
          (row) =>
            row.tenant_id === tenantId && new Date(row.opened_on).getTime() <= date.getTime(),
        )
        .map(normalizeRow);
    },
    matchingStatus(tenantId, status) {
      return backend
        .select((row) => row.tenant_id === tenantId && row.status === status)
        .map(normalizeRow);
    },
  };
}
```

구현 전에 정한 판단은 세 가지다.

- **필터링 위치**: 서버 행(`TicketRow`)으로 거른 뒤 결과만 `Ticket`으로 바꾼다. 변환 뒤에 거르면 필드 이름이 한 곳에만 남지만, 실제 서버라면 필요 없는 행까지 받아 와 전송량과 부하가 커진다.
- **서버 필드 이름의 위치**: 모두 `createTicketRepository` 안에 둔다. `opened_on`이 `opened_at`으로 바뀌면 `normalizeRow`와 `openedBefore` 두 군데를 고친다. 처음에는 고칠 곳이 '한 곳'이라고 생각했는데, 조건 함수에도 필드 이름이 들어가므로 정확히는 '저장소 안의 두 군데'다. 중요한 것은 고칠 곳이 모두 저장소 경계 안에 있고 화면은 고치지 않는다는 점이다.
- **변환 함수의 위치**: `normalizeRow`는 저장소 안에 두고 돌려주는 객체에 넣지 않는다. 넣으면 화면이 서버 형식을 다루는 통로가 다시 생긴다.

나중에 "제목에 특정 단어가 든 티켓"을 찾아야 한다면 `titleContains(tenantId, keyword)` 같은 메서드를 추가한다. 새 조회가 필요할 때마다 저장소를 고쳐야 하니 유연성은 떨어진다. 그렇다고 범용 필터를 열면 설계 B로 돌아가 자유도와 복잡한 상호작용의 가능성이 다시 커진다. 조회 목록이 명시적이면 서버가 그 조회만 대비하면 되고, 새 조회를 추가할 때 서버가 감당할 수 있는지도 함께 확인하게 된다. 설계 C는 유연성을 내주고 단순함을 얻는 트레이드오프다.

## 마무리

다섯 실습을 거치며 결합을 보는 관점이 바뀌었다. 결합이 늘면 복잡해진다고 막연히 생각했는데, 긴급 판정 실습에서는 `import`가 하나 늘었는데도 복잡성은 줄었다. 판단 기준은 연결의 수가 아니라 원치 않는 상태가 생길 가능성이었다.

실습마다 한 일을 정리하면 결국 두 가지다.

- 코드에 드러나지 않은 지식(같은 `localStorage` 키, 두 곳에 구현된 같은 규칙, 화면이 아는 서버 필드 이름)을 찾아 명시적인 관계로 드러낸다.
- 값과 인터페이스에 제약을 걸어 표현할 수 있는 상태를 유효한 것으로 좁힌다.

반대로 파일을 합치거나 쪼개는 일은 복잡성의 위치만 옮길 뿐 양을 줄이지 못한다는 것도 숫자로 확인했다. 

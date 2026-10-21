---
title: 2023년에 내가 만든 버전 판정 코드를, AI와 함께 다시 고쳤다
category: 경력 재구현
date: 2026-10-21
summary: 2023년에 만든 앱 버전 판정 코드를 기록을 바탕으로 재현해 입력 전제를 찾고, 테스트로 먼저 기록한 뒤 고친 과정을 정리했다.
tags:
  - 재구현
  - 웹뷰
  - 버전_관리
  - semver
  - 테스트
  - ai_협업
draft: false
keyPoint: false
---
AI와 함께 작성한 글입니다.

2023년에 만든 앱 버전 판정 코드는 `숫자.숫자.숫자` 세 자리만 입력으로 가정했는데, 이 전제가 코드 어디에도 적혀 있지 않았다. 기억과 기록을 바탕으로 이 코드를 다시 만들어 전제가 깨지는 입력을 테스트로 남기고, 정규식 형식 검증과 SemVer 우선순위 비교로 고쳤다. 고정한 24가지 입력에서 판정 정확도는 75.0%에서 100.0%가 됐다. 이 글은 전제를 찾은 과정, AI에게 맡긴 일과 내가 정한 일, 결과를 기록한다.

## 2023년의 나는 무엇을 만들었나

예약 관리 앱의 웹뷰 캘린더에는 확대·축소 버튼이 하나 있었다. 이 버튼은 앱 버전 8.1.0부터만 동작했고, 그보다 낮은 버전에서는 "업데이트 후 사용할 수 있습니다"라는 안내 토스트를 띄웠다. 이걸 판정하는 코드를 내가 만들었다.

당시 판정 방식은 단순했다. 앱 버전과 기준 버전을 각각 `.`으로 나눠 숫자로 바꾸고, 자리마다(메이저·마이너·패치) 앱 쪽이 크다·같다·작다인지를 구한 뒤, 미리 만들어 둔 조합표와 맞춰 보는 식이었다. 그때 "SemVer를 쓴다"고 생각했지만, 실제로는 `숫자.숫자.숫자` 세 자리만 가정한 코드였다. 기록을 바탕으로 핵심만 다시 쓰면 이런 모습이다.

```js
// 2023년에 만든 방식 (기록을 바탕으로 간단히 다시 쓴 코드)
function isVersionSupported(appVersion, requiredVersion) {
  if (appVersion === null || requiredVersion === null) return false;

  const required = requiredVersion.split(".").map(Number);
  const orders = appVersion.split(".").map(Number).map((digit, i) => {
    const req = required[i];
    if (req === undefined) return "less";
    return digit > req ? "more" : digit === req ? "equal" : "less";
  });

  // 메이저가 크면 통과, 메이저가 같고 마이너가 크거나 같으면 통과 ...
  const allowedOrders = [
    ["more", "more", "more"], ["more", "more", "equal"], ["more", "more", "less"],
    ["more", "equal", "more"], ["more", "equal", "equal"], ["more", "equal", "less"],
    ["more", "less", "more"], ["more", "less", "equal"], ["more", "less", "less"],
    ["equal", "more", "more"], ["equal", "more", "equal"], ["equal", "more", "less"],
    ["equal", "equal", "more"], ["equal", "equal", "equal"],
  ];
  return allowedOrders.some((row) => orders.every((o, i) => row[i] === o));
}

isVersionSupported("8.1.0", "8.1.0"); // true, 의도대로 동작
isVersionSupported("8.0.9", "8.1.0"); // false, 의도대로 동작
```

버전을 그냥 `.`으로 나눠 숫자로 바꾸기만 하고, 그 숫자가 정말 버전처럼 생겼는지는 한 번도 확인하지 않는다. 이 점이 다음 절에서 드러나는 숨은 전제와 이어진다.

## 다시 보니 드러난 전제

3년이 지나 같은 방식을 다시 만들어 봤을 때, 혼자서는 "그때도 잘 됐으니 지금도 괜찮겠지" 하고 넘겼을 법한 부분들이 있었다. 이번에는 AI와 함께 당시 방식을 한 단계씩 재현하고, 직접 실행해 보고, 테스트를 자동화하는 과정을 거치면서 입력 전제가 깨지는 두 가지 경우를 구체적으로 확인했다.

1. **자리 수가 다르면 판정이 틀린다.** 앱이 버전을 `8`로만 보내면 지원하는 것으로 판정했다. 반대로 기준 버전을 `8.1`로만 적으면, 같은 버전인 `8.1.0`이 미지원으로 판정됐다.
2. **형식을 전혀 검사하지 않는다.** `9.x`, `0x9.0.0`, `1e1.0.0` 같은, 버전이라고 부르기 애매한 값이 지원으로 판정됐다. `0x9`와 `1e1`은 자바스크립트의 숫자 변환 함수가 9와 10으로 읽기 때문이다. `9.x`는 메이저 자리(9)가 기준(8)보다 크면 나머지 자리를 보지 않고 조합표에 걸리기 때문에 통과한다.

위 코드로 바로 확인해 볼 수 있다.

```js
isVersionSupported("8", "8.1.0");        // true  (틀림. 세 자리가 아닌 값이 지원으로 판정된다)
isVersionSupported("8.1.0", "8.1");      // false (틀림. 기준 버전을 8.1로 적었을 뿐인데 같은 버전이 미지원이 된다)
isVersionSupported("9.x", "8.1.0");      // true  (틀림. 메이저만 크면 나머지 자리와 상관없이 통과한다)
isVersionSupported("0x9.0.0", "8.1.0");  // true  (틀림. Number("0x9")가 9로 읽힌다)
```

이걸 숫자로 확인하기 위해 AI에게 기록을 바탕으로 당시 방식을 재현하게 하고, 24가지 고정된 입력값으로 정확도를 측정하게 했다. 결과는 정확도 75%였다. 정상적인 버전 형식(`8.1.0`, `9.0.0` 같은 것) 14건은 전부 맞혔지만, 형식이 이상한 입력 10건 중 6건을 틀렸다.

다만 이 숨은 전제 때문에 실제 서비스에서 문제가 생긴 적은 없다. 운영하는 동안 버전 판정 때문에 생긴 문제도, 예상과 다른 형식의 버전 값도 본 적이 없다. 이번에 찾은 것은 코드가 입력 전제(세 자리 숫자)를 어디에도 적어 두지 않았고, 전제가 깨졌을 때의 동작도 정하지 않았다는 점이다.

## 고치는 방향은 내가 정했다

전제를 확인한 다음 단계는 "어떻게 고칠 것인가"였다. 여기서부터는 AI가 대신 정하지 않았다. AI가 선택할 수 있는 방향을 후보로 정리했고, 어느 쪽으로 갈지는 내가 정했다.

- 앱이 보내는 버전에 `-베타`나 `+빌드` 같은 SemVer의 확장 표기가 섞여 있을 때, 이걸 제대로 다룰지(규격대로 전부 지원) 아니면 단순한 `숫자.숫자.숫자` 형식만 허용할지.
- 기준 버전 설정을 `8.1`처럼 자리를 줄여 적었을 때, 이걸 설정 오류로 볼지 아니면 빠진 자리를 0으로 채워 보정할지.

나는 전자는 "SemVer 규격대로 제대로 지원한다"를, 후자는 "빠진 자리는 0으로 보정한다"를 골랐다. 사용자가 보는 결과는 똑같아 보일 수 있지만, 이 선택이 코드가 어떤 입력까지 책임질지를 정한다.

- SemVer를 전체 지원하기로 한 이유: 2023년 당시에도 나는 이 코드를 SemVer 형식을 기반으로 구현했다고 생각했다. 그렇다면 SemVer가 정의하는 형식을 전부 받아들여야 그 전제가 맞는다. 일부만 지원하면서 "SemVer를 쓴다"고 할 수는 없다.
- 기준 버전을 0으로 보정하기로 한 이유: 자릿수를 처음부터 맞춰 두지 않으면, 이후 처리 과정에서 자릿수를 확인해야 할 때마다 전처리가 필요하다. 처리 도중에 값이 바뀌는 일까지 생기면 지금 값이 어떤 형식인지 계속 따라가야 해서 인지 부담도 커진다. 그래서 입구에서 한 번에 `x.y.z`로 맞춰 두기로 했다.

## AI가 구현하고, 함께 비교했다

방향이 정해지자 실제 코드 작성과 성능 측정은 AI에게 맡겼다. 나는 테스트 결과와 측정 수치를 확인하는 역할을 했다. AI가 만든 개선 코드는 다음 두 가지를 했다.

- 정규식으로 버전 문자열의 형식을 먼저 엄격하게 검사한다. `숫자.숫자.숫자` 형식이 아니면(선택적인 `-베타`, `+빌드` 표기 제외) 바로 "형식이 잘못됐다"고 구분해서 알린다. 결과를 `{ supported, formatError }`로 돌려주기 때문에, 호출하는 쪽이 "구버전이라 미지원"과 "형식이 틀려 미지원"을 구분할 수 있다.
- 형식이 맞으면 메이저 → 마이너 → 패치 순서로 비교하고, 세 자리가 모두 같을 때만 SemVer 규격대로 베타·RC 같은 프리릴리스 표기를 비교한다. `+빌드` 뒤에 붙는 빌드 메타데이터는 규격상 비교 대상이 아니므로 완전히 무시한다.

핵심만 줄여 옮기면 이런 모습이다. 실제 구현의 세부 처리는 생략했다.

```js
// 개선 코드 (간단히 옮긴 코드)
const SEMVER_RE = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/;

function parseVersion(version) {
  const match = SEMVER_RE.exec(version);
  if (!match) return null; // 형식이 아니면 여기서 바로 걸러진다
  const [, major, minor, patch, prerelease] = match;
  return {
    major: Number(major),
    minor: Number(minor),
    patch: Number(patch),
    prerelease: prerelease ? prerelease.split(".") : [],
  };
}

// SemVer 2.0.0 11항: 프리릴리스 식별자를 앞에서부터 비교한다
function comparePrerelease(a, b) {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i] === undefined) return -1; // 앞쪽이 모두 같으면 식별자가 적은 쪽이 낮다
    if (b[i] === undefined) return 1;
    const aIsNum = /^\d+$/.test(a[i]);
    const bIsNum = /^\d+$/.test(b[i]);
    if (aIsNum && bIsNum) {
      const diff = Number(a[i]) - Number(b[i]); // 둘 다 숫자면 수치로 비교
      if (diff !== 0) return diff;
    } else if (aIsNum) {
      return -1; // 숫자 식별자는 비숫자 식별자보다 낮다
    } else if (bIsNum) {
      return 1;
    } else if (a[i] !== b[i]) {
      return a[i] < b[i] ? -1 : 1; // 둘 다 비숫자면 문자열 비교
    }
  }
  return 0;
}

function compareVersions(a, b) {
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  if (a.patch !== b.patch) return a.patch - b.patch;
  // 세 자리가 같으면 프리릴리스를 비교한다. 프리릴리스가 없는 쪽이 높다
  if (a.prerelease.length === 0 && b.prerelease.length === 0) return 0;
  if (a.prerelease.length === 0) return 1;
  if (b.prerelease.length === 0) return -1;
  return comparePrerelease(a.prerelease, b.prerelease);
}

function normalizeRequiredVersion(required) {
  if (typeof required !== "string") return "";
  const parts = required.split(".");
  while (parts.length < 3) parts.push("0"); // 기준 버전 "8.1" → "8.1.0" 보정
  return parts.join(".");
}

function evaluateVersionSupport(appVersion, requiredVersion) {
  const app = parseVersion(appVersion);
  const required = parseVersion(normalizeRequiredVersion(requiredVersion));
  if (!app || !required) return { supported: false, formatError: true };
  return { supported: compareVersions(app, required) >= 0, formatError: false };
}

// 이전 코드와 같은 호출 방식을 쓰고 싶을 때
function isVersionSupported(appVersion, requiredVersion) {
  return evaluateVersionSupport(appVersion, requiredVersion).supported;
}

isVersionSupported("8", "8.1.0");              // false (형식 오류로 걸러진다)
isVersionSupported("0x9.0.0", "8.1.0");        // false (형식 오류로 걸러진다)
isVersionSupported("8.1.0+build.5", "8.1.0");  // true  (빌드 메타데이터는 무시한다)
isVersionSupported("8.2.0-rc.1", "8.1.0");     // true  (8.2.0 자체가 더 높은 버전이다)
isVersionSupported("8.1.0-beta.1", "8.1.0");   // false (프리릴리스는 정식 버전보다 낮다)
isVersionSupported("8.1.0", "8.1");            // true  (기준 버전 보정: "8.1" → "8.1.0")
evaluateVersionSupport("9.x", "8.1.0");        // { supported: false, formatError: true }
```

같은 24가지 입력값, 같은 측정 조건으로 이전 코드와 새 코드를 나란히 재 봤다.

| 지표 | 이전 코드 | 새 코드 |
|---|---|---|
| 판정 정확도 (24건) | 75.0% | 100.0% |
| 형식이 잘못된 입력을 "오류"로 구분해서 알림 (10건) | 0.0% | 100.0% |
| 판정 한 번에 걸리는 시간 (중앙값) | 약 280ns | 약 159ns |

정확도가 오른 이유는 간단하다. "숫자로 바꿔 보고 안 되면 넘어가는" 느슨한 방식을, "정해진 형식인지 먼저 확인하는" 엄격한 방식으로 바꿨을 뿐이다. 속도는 애초에 목표가 아니었지만, 정규식으로 한 번에 검사하는 방식이 이전의 여러 단계 비교보다 가벼워서 오히려 40% 넘게 빨라졌다.

## 느낀 점

이번 작업에서 AI에게 맡긴 일과 내가 직접 한 일은 분명히 나뉘었다.

- **AI가 한 일**: 기록을 바탕으로 과거 방식을 재현하고, 테스트를 자동으로 만들고, 정해진 조건으로 성능을 측정하고, 내가 고른 방향대로 코드를 구현했다.
- **내가 한 일**: 이 기능을 실제로 누가 어떤 상황에서 쓰는지 정하고, 테스트가 내 의도를 제대로 담았는지 확인하고, 두 가지 개선 방향 중 하나를 선택하고, 최종 결과를 해석했다.

AI는 "무엇이 맞는 코드인가"를 보여 주는 도구였고, "무엇이 맞는 선택인가"는 내가 정해야 했다. 과거에 내가 쓴 코드를 돌이켜 보는 과정에서도 이 구분은 그대로 유지했다.

## 한계

- 이번 비교는 미리 고정해 둔 24가지 입력값 기준이다. 실제 앱이 보낸 버전 값의 분포로 만든 사례가 아니므로, 이 수치가 실제 서비스의 개선 효과를 뜻하지는 않는다. 이 숨은 전제 때문에 운영 중 생긴 문제는 없었다.
- 당시 코드는 퇴사로 다시 볼 수 없어 기억과 기록을 바탕으로 재현했다. 실제 코드와 세부 구현이 다를 수 있다.
- 기준 버전 보정(`8.1` → `8.1.0`)은 설정값의 자리가 줄어든 경우만 다룬다. 기준 버전 자체에 베타·빌드 표기가 들어오는 경우는 다루지 않았다. 원래 설정에 그런 값이 들어온 적이 없었기 때문이다.
- 판정 속도가 빨라진 것은 부수적인 결과다. 이 기능에서 정작 중요한 건 속도가 아니라 정확성이었고, 측정도 그 기준으로 설계했다.

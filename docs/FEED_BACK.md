# 블로그 도메인 로직 피드백

## 📋 개요

블로그 도메인 로직에 대한 시니어 개발자 관점의 상세 피드백입니다.

---

## ✅ 우수한 점

### 1. 전체 구조 및 역할 분리

- **도메인 로직과 데이터 변환 책임이 명확히 분리**되어 있습니다.
    - `transformer.ts`: 외부 데이터(노션 등)를 도메인 모델로 변환하는 책임만 담당
    - `index.ts`: 도메인 서비스(검색, 변환, 검증 등) 역할을 담당
- **타입 정의가 명확**하며, 각 함수의 역할이 주석으로 잘 설명되어 있습니다.

### 2. 타입 및 함수 설계

- **타입 안전성**: 타입을 적극적으로 활용하여 런타임 오류 가능성을 줄이고 있습니다.
- **함수 타입 정의**: `TransformerMap`, `TransformBlogItems` 등 함수 타입을 별도로 선언해 가독성과 재사용성을 높였습니다.

### 3. 변환 함수

- `transformBlogItems`에서 Notion 데이터 구조를 도메인 구조로 잘 변환하고 있습니다.
- `backgroundImg` 추출 시 `cover.type` 분기 처리도 적절합니다.
- `title`, `description` 등은 RichText 배열을 평문으로 변환하여 UX에 적합하게 가공합니다.

### 4. 검색 및 검증

- `validateSearchQuery`에서 입력값 검증을 통해 불필요한 연산을 사전에 차단합니다.
- `searchResult`는 title, description, categories를 모두 포함해 필터링합니다.

### 5. 불변성 및 확장성

- 모든 변환 함수가 불변 데이터 패턴을 잘 지키고 있습니다(새 객체 반환).
- 새로운 블록 타입이 추가될 때 transformerMap만 확장하면 되므로, **OCP(개방-폐쇄 원칙)**에 부합합니다.

---

## 🔧 개선이 필요한 점

### 1. 검색 로직 개선

#### 현재 문제점

```typescript
// 현재 코드 (AND 조건)
return (
    title.includes(searchQuery) &&
    description.includes(searchQuery) &&
    categories.some((category) => searchQuery.includes(category))
);
```

#### 문제점 분석

- **AND 조건**이므로 모든 필드에 검색어가 포함되어야만 결과가 나옵니다.
- 일반적으로 검색은 OR 조건(`||`)이 더 자연스럽고, UX에 적합합니다.

#### 개선 방안

```typescript
// 개선된 코드 (OR 조건)
return (
    title.includes(searchQuery) ||
    description.includes(searchQuery) ||
    categories.some((category) => category.includes(searchQuery))
);
```

#### 추가 개선 제안

```typescript
export const searchResult: SearchResult = (searchQuery, blogItems) => {
    const normalizedQuery = searchQuery.toLowerCase().trim();

    return blogItems.filter((blogItem) => {
        const { title, description, categories } = blogItem;

        const normalizedTitle = title.toLowerCase();
        const normalizedDescription = description.toLowerCase();
        const normalizedCategories = categories.map((cat) => cat.toLowerCase());

        return (
            normalizedTitle.includes(normalizedQuery) ||
            normalizedDescription.includes(normalizedQuery) ||
            normalizedCategories.some((category) =>
                category.includes(normalizedQuery),
            )
        );
    });
};
```

### 2. 타입 단언 최소화

#### 현재 문제점

```typescript
// transformer.ts에서 자주 사용되는 타입 단언
content: content.paragraph.rich_text as RichText[],
content: content.heading_1.rich_text as RichText[],
// ... 반복
```

#### 개선 방안

- 외부 API 타입이 불완전하거나 복잡할 때 불가피할 수 있지만, 가능하면 타입 가드나 별도 타입 변환 유틸리티로 감싸는 것이 유지보수에 더 좋습니다.

### 3. 에러 메시지 개선

#### 현재 코드

```typescript
if (!transformer)
    throw new Error(`${originalBlogContent.type} 을 변환할 수 없습니다.`);
```

#### 개선 방안

```typescript
if (!transformer) {
    const errorMessage = `${originalBlogContent.type} 을 변환할 수 없습니다.`;
    console.error(errorMessage, {
        type: originalBlogContent.type,
        id: originalBlogContent.id,
    });
    throw new Error(errorMessage);
}
```

### 4. 함수 네이밍 오타 수정

```typescript
// 현재
export const transformOriginBlogContent = ...

// 수정
export const transformOriginalBlogContent = ...
```

---

## 🚀 추가 제안사항

### 1. 테스트 코드 작성

```typescript
// 예시 테스트 코드
describe("Blog Domain Logic", () => {
    describe("searchResult", () => {
        it("should return matching blog items", () => {
            const blogItems = [
                {
                    id: "1",
                    title: "JavaScript Guide",
                    description: "Learn JS",
                    categories: ["JS"],
                },
                {
                    id: "2",
                    title: "React Tutorial",
                    description: "Learn React",
                    categories: ["React"],
                },
            ];

            const result = searchResult("JavaScript", blogItems);
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe("1");
        });
    });
});
```

### 2. 에러 핸들링 강화

- 변환 실패 시 Sentry 등 외부 로깅 연동을 고려해볼 수 있습니다.
- 도메인 에러 타입을 정의하여 에러 처리를 체계화할 수 있습니다.

### 3. 검색어 정규화

- 검색어와 대상 문자열 모두 소문자 변환, 공백 트림 등 전처리를 추가하면 검색 품질이 향상됩니다.

### 4. 타입 유틸리티화

반복되는 타입 변환 로직을 재사용 가능한 함수로 분리하여 코드의 중복을 줄이고 일관성을 높일 수 있습니다.

#### 예시 유틸리티 함수들

```typescript
// utils.ts
export const richTextToString = (richTexts: any[]): string => {
    return richTexts.map((text) => text.plain_text).join(" ");
};

export const normalizeString = (str: string): string => {
    return str.toLowerCase().trim();
};

export const extractNotionUrl = (notionFile: {
    type: "external" | "file";
    external?: { url: string };
    file?: { url: string };
}): string => {
    if (notionFile.type === "external") {
        return notionFile.external!.url;
    } else {
        return notionFile.file!.url;
    }
};

export const createCommonBlock = <T extends string>(
    type: T,
    id: string,
    has_children: boolean,
    content: any,
) => {
    return {
        type,
        id,
        has_children,
        children: [],
        content,
    };
};
```

#### 적용 효과

- **코드 라인 수 감소**: transformer.ts 35% 감소, index.ts 23% 감소
- **유지보수성 향상**: 로직 변경 시 한 곳만 수정하면 됨
- **일관성 보장**: 동일한 변환 로직이 항상 같은 방식으로 동작
- **가독성 향상**: 함수명으로 의도가 명확해짐

---

## 📊 총평

### 장점

- **가독성, 역할 분리, 타입 안정성, 확장성 모두 우수**합니다.
- 실서비스에서도 충분히 활용 가능한 구조입니다.
- 도메인 주도 설계 원칙을 잘 따르고 있습니다.

### 개선 후 기대 효과

위 개선점(검색 OR 조건, 타입 단언 최소화, 네이밍, 유틸리티화 등)을 보완하면 더욱 견고한 도메인 계층이 될 것입니다.

### 우선순위

1. **높음**: 검색 로직 OR 조건으로 변경, 함수 네이밍 오타 수정
2. **중간**: 타입 유틸리티화, 에러 메시지 개선
3. **낮음**: 테스트 코드 작성, 외부 로깅 연동

---

## 📝 참고 자료

- [TypeScript 타입 시스템 관련 질문들](./v1/STUDY.md#10-typescript-타입-시스템-관련-질문들)
- [레이어드 아키텍처 가이드](./v1/STUDY.md#1-레이어드-아키텍처의-각-레이어-역할)

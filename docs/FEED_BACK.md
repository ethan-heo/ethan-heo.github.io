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

---

# 블로그 레포지토리 로직 피드백

## 📋 개요

블로그 레포지토리 로직에 대한 시니어 개발자 관점의 상세 피드백입니다.

---

## ✅ 우수한 점

### 1. **아키텍처 설계**

- **의존성 주입 패턴**을 잘 활용하여 테스트 가능성과 유연성을 높였습니다.
- **팩토리 패턴**을 사용하여 API 클라이언트 생성 로직을 캡슐화했습니다.
- **인터페이스 분리 원칙**을 잘 지켜 `BlogAPI`와 `NotionAPI`를 분리했습니다.

### 2. **타입 안전성**

- 도메인 인터페이스(`BlogItem`, `OriginalBlogContent` 등)를 적절히 활용했습니다.
- Notion API 응답 타입을 확장하여 타입 안전성을 보장했습니다.

### 3. **페이지네이션 처리**

- `getDatabaseAll`과 `getBlockAll`에서 Notion API의 페이지네이션을 올바르게 처리했습니다.
- `while` 루프와 `startCursor`를 사용한 표준적인 페이지네이션 패턴을 적용했습니다.

### 4. **재귀적 블록 처리**

- `getBlockAll`에서 중첩된 블록 구조를 재귀적으로 처리하는 로직이 잘 구현되어 있습니다.

### 5. **팩토리 패턴을 사용한 API 클라이언트 생성 로직 캡슐화**

#### 팩토리 패턴이란?

팩토리 패턴은 객체 생성 로직을 별도 함수(팩토리)로 캡슐화하여, 객체 생성의 복잡성을 숨기고 재사용성을 높이는 디자인 패턴입니다.

#### 현재 코드에서의 구현

```typescript
// notion.ts - 팩토리 함수
const createNotionAPI = (apiKey: string): NotionAPI => {
    const client = new Client({ auth: apiKey }); // 클라이언트 생성 로직 캡슐화

    // 내부 함수들 정의
    const getDatabase = async (params: QueryDatabaseParameters) => {
        return client.databases.query(params) as Promise<DatabaseResponse>;
    };

    const getDatabaseAll = async (params: QueryDatabaseParameters) => {
        // 복잡한 페이지네이션 로직
        let hasMore = true;
        let startCursor;
        let result: OriginalBlogItem[] = [];

        while (hasMore) {
            const blogItem = await getDatabase({
                ...params,
                start_cursor: startCursor,
            });

            result.push(...blogItem.results);
            hasMore = blogItem.has_more;
            startCursor = blogItem.next_cursor ?? undefined;
        }

        return result;
    };

    // 공개 인터페이스만 반환
    return {
        getDatabaseAll: (id: string) => getDatabaseAll({ database_id: id }),
        getBlockAll: (id: string) => getBlockAll({ block_id: id }),
    };
};
```

#### 팩토리 패턴의 장점

1. **복잡한 생성 로직 캡슐화**: 클라이언트 초기화, 설정, 에러 처리 등이 팩토리 내부에 숨겨짐
2. **의존성 주입과 결합**: 테스트에서 Mock 객체 주입 가능
3. **일관된 인터페이스**: 사용하는 쪽의 복잡성 감소
4. **확장성**: 환경별 설정, 캐싱 등 기능 추가가 용이

---

## 🔧 개선이 필요한 점

### 1. **에러 처리 부족**

#### 현재 문제점

```typescript
// 에러 처리가 전혀 없음
const getDatabase = async (params: QueryDatabaseParameters) => {
    return client.databases.query(params) as Promise<DatabaseResponse>;
};
```

#### 개선 방안

```typescript
const getDatabase = async (params: QueryDatabaseParameters) => {
    try {
        return (await client.databases.query(
            params,
        )) as Promise<DatabaseResponse>;
    } catch (error) {
        console.error("Failed to query database:", error);
        throw new Error(
            `Database query failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
    }
};
```

### 2. **타입 단언 과다 사용**

#### 현재 문제점

```typescript
// 타입 단언이 과도하게 사용됨
return client.databases.query(params) as Promise<DatabaseResponse>;
return client.blocks.children.list(params) as Promise<BlockResponse>;
return blogs.slice(...) as unknown as BlogItem[];
```

#### 개선 방안

```typescript
// 타입 가드나 변환 함수 사용
const isDatabaseResponse = (response: any): response is DatabaseResponse => {
    return response && Array.isArray(response.results);
};

const getDatabase = async (params: QueryDatabaseParameters) => {
    const response = await client.databases.query(params);
    if (!isDatabaseResponse(response)) {
        throw new Error("Invalid database response format");
    }
    return response;
};
```

### 3. **메모리 효율성 문제**

#### 현재 문제점

```typescript
// spread operation 사용으로 인한 메모리 비효율성
let result: OriginalBlogItem[] = [];
while (hasMore) {
    const blogItem = await getDatabase({...});
    result = [...result, ...blogItem.results]; // 매번 새 배열 생성
}
```

#### 개선 방안

```typescript
// push method 사용으로 메모리 효율성 개선
let result: OriginalBlogItem[] = [];
while (hasMore) {
    const response = await getDatabase({
        ...params,
        start_cursor: startCursor,
        page_size: 100, // 명시적 페이지 크기 설정
    });

    result.push(...response.results); // 기존 배열에 추가
    hasMore = response.has_more;
    startCursor = response.next_cursor ?? undefined;
}
```

#### Spread Operation vs Push Method 비교

- **Spread Operation (`...`)**: O(n²) 시간 복잡도, 매번 새 배열 생성
- **Push Method**: O(n) 시간 복잡도, 기존 배열 재사용

### 4. **인터페이스 일관성 문제**

#### 현재 문제점

```typescript
// getBlogList가 동기 함수로 정의됨
getBlogList: (page: number, size: number) => BlogItem[];

// 실제로는 비동기 데이터를 다루는 것 같은데 동기로 처리
getBlogList(page: number, size: number) {
    return blogs.slice(...) as unknown as BlogItem[];
}
```

#### 개선 방안

```typescript
// 일관성 있게 비동기로 통일
export interface BlogRepository {
    getOriginalBlogList: (id: string) => Promise<OriginalBlogItem[]>;
    getOriginalContents: (id: string) => Promise<OriginalBlogContent[]>;
    getBlogList: (page: number, size: number) => Promise<BlogItem[]>;
}
```

### 5. **설정 및 환경 변수 처리**

#### 현재 문제점

```typescript
// API 키가 하드코딩되거나 외부에서 주입되는 방식이 불명확
const createNotionAPI = (apiKey: string): NotionAPI => {
    const client = new Client({ auth: apiKey });
```

#### 개선 방안

```typescript
// 설정 객체를 통한 의존성 주입
interface NotionConfig {
    apiKey: string;
    timeout?: number;
    retries?: number;
}

const createNotionAPI = (config: NotionConfig): NotionAPI => {
    const client = new Client({
        auth: config.apiKey,
        timeoutMs: config.timeout || 10000,
    });
    // ...
};
```

### 6. **로깅 및 모니터링 부족**

#### 개선 방안

```typescript
const getDatabaseAll = async (params: QueryDatabaseParameters) => {
    const startTime = Date.now();
    console.log(`Starting database query for: ${params.database_id}`);

    try {
        // ... 기존 로직
        console.log(`Database query completed in ${Date.now() - startTime}ms`);
        return result;
    } catch (error) {
        console.error(
            `Database query failed after ${Date.now() - startTime}ms:`,
            error,
        );
        throw error;
    }
};
```

---

## 🚀 추가 제안사항

### 1. **재시도 로직 추가**

```typescript
const withRetry = async <T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000,
): Promise<T> => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise((resolve) =>
                setTimeout(resolve, delay * (i + 1)),
            );
        }
    }
    throw new Error("Max retries exceeded");
};
```

### 2. **캐싱 전략**

```typescript
interface CacheConfig {
    ttl: number;
    maxSize: number;
}

const createCachedNotionAPI = (
    config: NotionConfig,
    cacheConfig: CacheConfig,
): NotionAPI => {
    const cache = new Map<string, { data: any; timestamp: number }>();

    const getCachedOrFetch = async (
        key: string,
        fetcher: () => Promise<any>,
    ) => {
        const cached = cache.get(key);
        if (cached && Date.now() - cached.timestamp < cacheConfig.ttl) {
            return cached.data;
        }

        const data = await fetcher();
        cache.set(key, { data, timestamp: Date.now() });
        return data;
    };

    // ... 캐시 적용
};
```

### 3. **테스트 코드 작성**

```typescript
describe("BlogRepository", () => {
    let mockNotionAPI: jest.Mocked<NotionAPI>;
    let mockBlogAPI: jest.Mocked<BlogAPI>;
    let repository: BlogRepository;

    beforeEach(() => {
        mockNotionAPI = createMockNotionAPI();
        mockBlogAPI = createMockBlogAPI();
        repository = blogRepository(mockNotionAPI, mockBlogAPI);
    });

    describe("getOriginalBlogList", () => {
        it("should return blog list from notion api", async () => {
            const mockData = [{ id: "1", title: "Test" }];
            mockNotionAPI.getDatabaseAll.mockResolvedValue(mockData);

            const result = await repository.getOriginalBlogList("db-id");

            expect(result).toEqual(mockData);
            expect(mockNotionAPI.getDatabaseAll).toHaveBeenCalledWith("db-id");
        });
    });
});
```

---

## 📊 총평

### 장점

- **의존성 주입과 팩토리 패턴**을 잘 활용했습니다.
- **페이지네이션과 재귀적 블록 처리** 로직이 견고합니다.
- **타입 안전성**을 적절히 보장했습니다.
- **팩토리 패턴**을 통한 API 클라이언트 생성 로직 캡슐화가 우수합니다.

### 개선 후 기대 효과

위 개선점(에러 처리, 타입 안전성, 메모리 효율성, 일관성 등)을 보완하면 프로덕션 환경에서도 안정적으로 동작하는 레포지토리가 될 것입니다.

### 우선순위

1. **높음**: 에러 처리 추가, 인터페이스 일관성 수정, 메모리 효율성 개선
2. **중간**: 타입 단언 최소화, 설정 객체 도입
3. **낮음**: 캐싱, 재시도 로직, 상세 로깅

---

## 📝 참고 자료

- [TypeScript 타입 시스템 관련 질문들](./v1/STUDY.md#10-typescript-타입-시스템-관련-질문들)
- [레이어드 아키텍처 가이드](./v1/STUDY.md#1-레이어드-아키텍처의-각-레이어-역할)
- [레포지토리에서 도메인 인터페이스 의존](./v1/STUDY.md#레포지토리에서-도메인-인터페이스를-의존해도-되는가)

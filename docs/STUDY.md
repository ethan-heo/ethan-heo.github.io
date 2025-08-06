# 블로그 아키텍처 STUDY 정리

## 1. 레이어드 아키텍처의 각 레이어 역할

### 1) 컨트롤러 (Controller)

- HTTP 요청/응답 처리, 라우팅, 인증 등
- 요청 데이터를 파싱하여 서비스(유즈케이스) 레이어를 호출
- 비즈니스 로직을 직접 수행하지 않음
- 서비스에서 반환된 결과를 HTTP 응답으로 변환해 클라이언트에 전달

### 2) 서비스/유즈케이스 (Service/Use Case)

- 비즈니스 시나리오(유즈케이스)를 구현하는 계층
- 여러 도메인 객체를 조합하거나 트랜잭션, 외부 시스템 호출 등 업무 흐름을 담당
- 도메인 로직(엔티티, 밸류 오브젝트, 도메인 서비스 등)을 호출하여 실제 처리를 수행
- 각 유즈케이스는 서비스 레이어의 메서드 또는 별도의 유즈케이스 클래스로 구현 가능

### 3) 도메인 (Domain)

- 시스템의 핵심 비즈니스 규칙과 상태 변화를 담당
- 도메인 모델(엔티티, 밸류 오브젝트, 도메인 서비스 등)을 정의
- 외부 서비스와 직접 통신하지 않음 (리포지토리 인터페이스를 통해 데이터 접근만 추상적으로 요청)

### 4) 인프라스트럭처 (Infrastructure)

- 실제 외부 시스템(API, DB 등)과의 통신을 담당
- 도메인/서비스 레이어에서 정의한 인터페이스(예: 리포지토리)를 구현

---

## 2. 각 레이어의 외부 통신 원칙

- **외부 데이터 소스와의 실제 통신은 인프라스트럭처 레이어에서만!**
- 도메인/서비스/컨트롤러는 외부 시스템에 직접 의존하지 않고, 인터페이스(리포지토리 등)를 통해 간접적으로 접근
- 이렇게 하면 코드가 더 유연하고, 테스트/유지보수가 쉬워짐

---

## 3. 서비스와 유즈케이스의 관계

- 서비스 레이어는 여러 유즈케이스(비즈니스 시나리오)를 구현하는 곳
- 유즈케이스는 서비스 레이어의 메서드이거나, 별도의 유즈케이스 클래스로 분리될 수도 있음
- 규모가 작으면 서비스 클래스에 유즈케이스 메서드를 모아두고, 크거나 복잡하면 유즈케이스별로 클래스를 분리

---

## 4. 비즈니스 로직과 서비스 로직의 차이

| 구분          | 위치          | 역할/예시                                            |
| ------------- | ------------- | ---------------------------------------------------- |
| 비즈니스 로직 | 도메인 레이어 | 핵심 규칙, 상태 변화, 도메인 엔티티/서비스 등        |
| 서비스 로직   | 서비스 레이어 | 유즈케이스, 도메인 객체 조합, 트랜잭션, 외부 호출 등 |

- **비즈니스 로직**: 시스템의 핵심 규칙(예: 게시글은 반드시 제목이 있어야 한다)
- **서비스 로직**: 유즈케이스(업무 시나리오) 구현, 여러 도메인 객체 조합, 트랜잭션, 외부 시스템 호출 등

---

## 5. 예시 코드

```typescript
// 도메인 레이어 (비즈니스 로직)
class Blog {
    publish() {
        if (!this.title) throw new Error("제목이 필요합니다");
        this.published = true;
    }
}

// 리포지토리 인터페이스 (도메인에서 정의)
interface BlogRepository {
    findById(id: string): Promise<Blog>;
    save(blog: Blog): Promise<void>;
}

// 인프라스트럭처 레이어 (외부 서비스와 통신)
class NotionBlogRepository implements BlogRepository {
    async findById(id: string) {
        /* Notion API 호출 */
    }
    async save(blog: Blog) {
        /* Notion API 호출 */
    }
}

// 서비스 레이어 (서비스 로직/유즈케이스)
class BlogService {
    constructor(private blogRepository: BlogRepository) {}
    async publishBlog(id) {
        const blog = await this.blogRepository.findById(id);
        blog.publish(); // 비즈니스 로직 호출
        await this.blogRepository.save(blog);
        // 예: 알림 전송 등 추가 업무 처리
    }
}

// 컨트롤러
app.post("/blog/:id/publish", async (req, res) => {
    await blogService.publishBlog(req.params.id);
    res.status(200).send("Published");
});
```

---

## 6. 한 줄 요약

- 컨트롤러: 요청을 받아 서비스에 전달, 결과를 응답으로 반환
- 서비스/유즈케이스: 기능 단위의 작업(비즈니스 시나리오) 구현, 도메인 로직 호출/조합
- 도메인: 핵심 비즈니스 규칙과 상태 변화 담당, 외부 통신 X
- 인프라스트럭처: 외부 시스템과의 실제 통신 담당
- **비즈니스 로직**은 도메인에, **서비스 로직**은 서비스/유즈케이스에 위치

---

## 7. 레포지토리의 역할

- 레포지토리는 도메인/서비스와 외부 데이터 소스(서비스, DB, API 등) 사이의 중간자 역할을 하며, 데이터 요청/응답을 추상화합니다.
- 도메인/서비스 레이어는 레포지토리의 **인터페이스**만 알고, 실제 구현(외부 서비스와의 통신)은 인프라스트럭처 레이어에서 담당합니다.
- 한 줄 요약: **레포지토리는 외부 데이터 소스와의 통신을 추상화하여, 도메인/서비스가 외부 시스템에 직접 의존하지 않도록 해줍니다.**

---

## 8. 서비스, 도메인, 레포지토리의 의존성 및 단방향성

- 서비스 레이어는 도메인 로직(엔티티, 밸류 오브젝트, 도메인 서비스 등)과 레포지토리 **인터페이스**를 함께 사용합니다.
- 서비스/도메인 레이어가 레포지토리 **구현체**(예: NotionBlogRepository)에 직접 의존하면 인프라스트럭처(외부 시스템)에 강하게 결합되어 단방향 의존성 원칙이 깨집니다.
- 항상 인터페이스(추상화)에 의존하고, 실제 구현체는 DI(의존성 주입)로 주입받아 사용해야 합니다.
- 한 줄 요약: **서비스는 도메인 로직과 레포지토리 인터페이스를 함께 사용하며, 레포지토리 구현체에는 직접 의존하지 않는 것이 올바른 구조입니다.**

---

## 9. 레이어드 아키텍처에서의 추천 구현 순서

1. 도메인 레이어(엔티티, 밸류 오브젝트, 도메인 서비스 등)부터 구현: 시스템의 핵심 규칙과 불변의 비즈니스 로직을 먼저 설계
2. 레포지토리 인터페이스 정의: 도메인/서비스에서 사용할 데이터 접근 추상화
3. 서비스/유즈케이스 레이어 구현: 도메인 객체와 레포지토리 인터페이스를 활용해 유즈케이스(업무 시나리오) 구현
4. 레포지토리 구현체(인프라스트럭처) 작성: 실제 외부 시스템(API, DB 등)과 통신하는 구현체
5. 컨트롤러 구현: HTTP 요청/응답 처리, 라우팅 등

- 이렇게 하면 비즈니스 규칙이 중심이 되고, 외부 시스템에 의존하지 않고 테스트/개발이 쉬워집니다.
- 한 줄 요약: **"도메인 → 레포지토리 인터페이스 → 서비스/유즈케이스 → 레포지토리 구현체 → 컨트롤러" 순서로 구현하는 것이 가장 이상적입니다.**

---

## 10. TypeScript 타입 시스템 관련 질문들

### 10-1. CreateBlock 유틸리티의 추론 결과에서 &(Intersection Type) 숨기기

**문제**: `CreateBlock` 유틸리티 타입에서 여러 타입을 합성할 때 TypeScript가 내부적으로 교차 타입(`&`)을 사용하여 추론 결과에 `&`가 노출되는 문제

**원인**:

```typescript
type CreateBlock<T, P> = { [key in keyof P]: P[key] } & {
    type: T;
    id: string;
    has_children: boolean;
};
```

이렇게 정의하면 추론 결과가 다음과 같이 보임:

```typescript
{ type: "paragraph"; id: string; has_children: boolean; } & { type: "paragraph"; content: RichText[]; }
```

**해결 방법**:

1. **Omit + & 조합 사용**:

```typescript
type CreateBlock<T, P> = Omit<P, "type" | "id" | "has_children"> & {
    type: T;
    id: string;
    has_children: boolean;
};
```

2. **Merge 유틸리티 타입 사용**:

```typescript
type Merge<A, B> = {
    [K in keyof A | keyof B]: K extends keyof B
        ? B[K]
        : K extends keyof A
          ? A[K]
          : never;
};

type CreateBlock<T, P> = Merge<
    P,
    { type: T; id: string; has_children: boolean }
>;
```

**결과**: 타입 추론 결과가 `&` 없이 단일 객체 타입으로 보임

---

### 10-2. CreateBlock 제네릭에 배열 타입을 넣을 때 배열 요소의 속성만 추론하기

**문제**: 제네릭 타입에 배열 타입을 넣으면 배열의 프로퍼티(`length`, `push`, `map` 등)가 타입에 포함되어 추론되는 문제

**해결 방법**:

1. **배열 요소 타입 추출 유틸리티**:

```typescript
type ElementType<T> = T extends Array<infer U> ? U : T;
```

2. **CreateBlock에서 content 타입 변환**:

```typescript
type CreateBlock<T, P> = {
    [K in keyof P]: K extends "content" ? ElementType<P[K]> : P[K];
} & {
    type: T;
    id: string;
    has_children: boolean;
};
```

**결과**: `content: string[]` → `content: string`으로 추론됨

---

### 10-3. TransformerMap의 메서드 반환값이 never 타입으로 추론되는 문제

**문제**:

```typescript
export type TransformerMap<T extends NotionBlogBlockType> = {
    [key in T]: (
        originalBlogContent: Extract<OriginalBlogContent, { type: key }>,
    ) => BlogContent extends { type: T } ? BlogContent : never;
};
```

이 정의에서 메서드의 반환값이 `never` 타입으로 추론되는 문제

**원인**:

1. **조건부 타입의 복잡성**: `BlogContent extends { type: T } ? BlogContent : never`에서 `T`가 유니온 타입일 때, TypeScript는 이 조건을 `false`로 평가
2. **CreateBlock의 복잡한 조건부 타입**: `CreateBlock`의 `content` 필드가 복잡한 조건부 타입으로 정의되어 있어서 `Extract`가 제대로 작동하지 않음
3. **타입 추론의 한계**: TypeScript는 유니온 타입과 조건부 타입이 결합된 복잡한 상황에서 정확한 타입을 추론하지 못함

**해결 방법**:

1. **Extract 사용**:

```typescript
export type TransformerMap<T extends NotionBlogBlockType> = {
    [key in T]: (
        originalBlogContent: Extract<OriginalBlogContent, { type: key }>,
    ) => Extract<BlogContent, { type: key }>;
};
```

2. **명시적 타입 매핑**:

```typescript
type BlockTransformerReturnType<T extends NotionBlogBlockType> =
    T extends TextBlockType
        ? TextBlock
        : T extends
                | "image"
                | "video"
                | "bookmark"
                | "embed"
                | "audio"
                | "file"
                | "link_preview"
          ? MediaBlock
          : // ... 기타 타입들
            never;

export type TransformerMap<T extends NotionBlogBlockType> = {
    [key in T]: (
        originalBlogContent: Extract<OriginalBlogContent, { type: key }>,
    ) => BlockTransformerReturnType<key>;
};
```

3. **타입 단언 사용** (임시 해결책):

```typescript
export type TransformerMap<T extends NotionBlogBlockType> = {
    [key in T]: (
        originalBlogContent: Extract<OriginalBlogContent, { type: key }>,
    ) => BlogContent;
};
```

**결론**: 이러한 문제는 TypeScript의 타입 시스템의 한계와 복잡한 조건부 타입의 상호작용 때문에 발생하는 일반적인 문제입니다.

---

## 레포지토리에서 도메인 인터페이스를 의존해도 되는가?

### 결론

**네, 레포지토리(Repository)는 도메인 인터페이스(도메인 모델, 엔티티, 밸류 오브젝트 등)에 의존해도 됩니다.**
오히려, 도메인 모델을 반환하거나 저장하는 것이 레포지토리의 핵심 역할입니다.

### 이유와 원칙

#### 1. 레이어드 아키텍처의 의존성 방향

- **도메인 레이어**: 시스템의 핵심 비즈니스 규칙(엔티티, 밸류 오브젝트, 도메인 서비스 등)
- **레포지토리 인터페이스**: 도메인 레이어에 위치 (예: `interface BlogRepository { ... }`)
- **레포지토리 구현체**: 인프라스트럭처 레이어에 위치 (예: `class NotionBlogRepository implements BlogRepository { ... }`)

**의존성 방향:**

- 도메인 → (레포지토리 인터페이스)
- 인프라스트럭처(구현체) → 도메인(인터페이스, 모델)

즉, **레포지토리 인터페이스와 도메인 모델은 같은 레이어(도메인 레이어)에 위치**하며,
레포지토리 구현체(인프라)는 도메인 모델/인터페이스에 의존하는 것이 맞습니다.

#### 2. 레포지토리의 역할

- 도메인 모델을 저장/조회/삭제 등 영속성 관련 작업을 추상화
- 외부 데이터 소스(DB, API 등)와 도메인 모델 사이의 변환 책임

**즉, 레포지토리는 도메인 모델을 반환/저장해야 하므로 도메인 인터페이스에 의존해야 합니다.**

#### 3. 잘못된 의존성 예시

- 인프라스트럭처(레포지토리 구현체)가 도메인 모델이 아닌, 외부 API/DB의 DTO에만 의존한다면, 도메인 규칙이 깨지고, 도메인 계층이 외부 시스템에 종속될 수 있습니다.

### 실전 예시

```typescript
// 도메인 레이어
export interface Blog {
    id: string;
    title: string;
    // ...
}

export interface BlogRepository {
    findById(id: string): Promise<Blog | null>;
    save(blog: Blog): Promise<void>;
}

// 인프라스트럭처 레이어
export class NotionBlogRepository implements BlogRepository {
    async findById(id: string): Promise<Blog | null> {
        // Notion API 호출 → 응답을 Blog 도메인 모델로 변환
        return blog;
    }
    async save(blog: Blog): Promise<void> {
        // Blog 도메인 모델 → Notion API DTO로 변환 후 저장
    }
}
```

### 주의할 점

- **반대로, 도메인 레이어가 인프라스트럭처(구현체)에 의존하면 안 됩니다.**
- 도메인 모델이 외부 시스템의 DTO, API 타입에 직접 의존하지 않도록 주의하세요.

### 요약

- 레포지토리(특히 구현체)는 도메인 인터페이스/모델에 의존하는 것이 맞다.
- 도메인 레이어가 외부 시스템에 의존하지 않도록, 의존성 방향을 항상 도메인 중심으로 유지해야 한다.

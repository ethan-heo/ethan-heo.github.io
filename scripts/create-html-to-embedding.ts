import chatbotController from "../v1/chatbot/controller.ts";

const result = await chatbotController.createEmbeddingFile(
    {
        id: "2654520e-635b-808f-842f-fa123cb11b67",
        title: "블로그 개선 - UseCase 인터페이스 개선 (Labeled tuple)",
        createdDate: "2025-09-05T10:05:00.000Z",
        categories: ["TypeScript", "Blog", "Labeled Tuple Elements"],
    },
    `
<!DOCTYPE html>
<html lang="ko" data-theme="abyss" class="scroll-smooth">
  <head>
    <meta charset="UTF-8">
    <link rel="canonical" href="https://ethan-heo.github.io/24a4520e-635b-8069-b02d-f088bc26eadb">
    <link rel="sitemap" href="/sitemap-index.xml">
    <meta name="language" content="ko">
    <meta name="viewport" content="width=device-width">
    <meta name="generator" content="Astro v5.10.0">
    <meta name="description" content="블로그를 만들면서 정리해 두면 좋겠다고 생각한 내용을 작성한 글 입니다">
    <meta name="keywords" content="Astro, React, TypeScript, Tailwindcss, Notion, CMS, Github actions, Clean Architecture">
    <meta name="author" content="ethan-heo">
    <meta property="og:description" content="블로그를 만들면서 정리해 두면 좋겠다고 생각한 내용을 작성한 글 입니다">
    <meta property="og:type" content="website">
    <meta property="og:url" content="/24a4520e-635b-8069-b02d-f088bc26eadb">
    <meta property="og:image" content="/logo.png">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Ethan Blog | 블로그를 만들면서">
    <meta name="twitter:description" content="블로그를 만들면서 정리해 두면 좋겠다고 생각한 내용을 작성한 글 입니다">
    <meta name="twitter:image" content="/logo.png">
    <link rel="icon" type="image/svg+xml" href="/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">
    <title>Ethan Blog | 블로그를 만들면서</title>
    <link rel="stylesheet" href="/_astro/_id_.D3jV1x3l.css">
  </head>
  <body class="flex flex-col min-h-screen">
    <header class="flex items-center justify-between w-full px-4 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-6xl mx-auto pt-4 pb-4">
      <a class="link" href="/">
        <div class="avatar">
          <div class="ring-primary ring-offset-base-100 w-9 rounded-full ring-2 ring-offset-2">
            <img src="/logo.png" alt="Ethan blog">
          </div>
        </div>
      </a>
      <ul class="flex items-center gap-2">
        <li>
          <a class="link link-hover" href="/blog">Blog</a>
        </li>
        <!--
        <li>
          <a class="link link-hover" href="/Resume">Resume</a>
        </li>
        -->
      </ul>
    </header>
    <main class="flex-1 w-full h-full px-4 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-6xl mx-auto">
      <h1 class="text-4xl font-bold mb-3 mt-20">블로그를 만들면서</h1>
      <time class="block mb-14 text-xs" datetime="2025-09-05T10:05:00.000Z">2025년 9월 5일</time>
      <style>
        astro-island, astro-slot, astro-static-slot { display: contents }
      </style>
      <script>
        (() => {
          var e = async t => { await (await t())() };
          (self.Astro || (self.Astro = {})).load = e;
          window.dispatchEvent(new Event("astro:load"));
        })();
      </script>
      <p class="mt-2 mb-2">
                <span class
                    >리터럴 객체에 네임스페이스를 두어 notion, blog 영역으로
                    분리했다. 이렇게 분리한 이유는 네임스페이스를 사용하는
                    이유와 동일하다. 비슷한 기능끼리 모아 사용되는 기능의 구분을
                    명확히 하기 위함이다. 그리고 도메인과 레포지토리를 사용하여
                    서비스 객체를 생성하고 리터럴 객체의 메서드 내부에서 사용할
                    수 있도록 정의했다. 이렇게 구성한 컨트롤러 객체는 외부에서
                    사용할 수 있게 구성되었다.</span
                >
            </p>
            <h2
                class="mb-4 mt-8 text-3xl font-bold"
                id="Tailwindcss + DaisyUI 적용하기"
            >
                <span class>Tailwindcss + DaisyUI 적용하기</span>
            </h2>
            <p class="mt-2 mb-2">
                <span class
                    >UI 컴포넌트를 구현할 때 가장 손이 많이 가는 부분은 CSS 라고
                    생각한다. 레이아웃, 스타일링에 관한 속성을 하나씩 정의하는
                    것이 이전에는 크게 부담이 되지 않았지만 여러 좋은 스타일링
                    도구가 나오면서 익숙해지다보니 직접 손을 대는일이 적어진 것
                    같다. 그래서 결국 tailwindcss라는 좋은 도구와 daisyUI
                    플러그인을 사용해서 쉽게 구현을 할 수 있었다. 그리고 디자인
                    토큰의 경우에도 daisyUI 에서 테마를 선택하거나
                    커스터마이징을 할 수 있도록 제공해주는데 그 기능을 사용해
                    쉽게 만들어 추가할 수 있었다.
                </span>
            </p>
            <p class="mt-2 mb-2">
                <span class
                    >설치와 사용방법 또한 단순하다. Tailwindcss 를 설치하고 css
                    파일에 @import 구문을 사용해 추가해주면 설치 과정은
                    끝이난다. 그리고 의존성을 추가하면 바로 사용이
                    가능하다.</span
                >
            </p>
            <h2
                class="mb-4 mt-8 text-3xl font-bold"
                id="Notion 블록 컴포넌트 구현하기"
            >
                <span class>Notion 블록 컴포넌트 구현하기</span>
            </h2>
            <p class="mt-2 mb-2">
                <span class
                    >블럭 컴포넌트는 컨트롤러에서 반환된 데이터를 활용해서
                    생각보다 쉽게 만들 수 있었다. 이미 사용하기 쉽게
                    구조화되었기 때문에 컴포넌트에서 적용하기 용이했다. Text,
                    Media와 같은 블럭을 미리 그룹화하여 구조를 동일하게
                    만들어주었기 때문에 인지할 수 있는 구조를 줄여 생각의 흐름을
                    끊기지 않고 사용할 수 있게 해주었기 때문이지 않을까
                    생각한다. 하지만 마냥 쉽게 만들어나가진 못했는데 이는 아래
                    이유들 때문이었다.</span
                >
            </p>
            <h3
                class="mb-4 mt-8 text-2xl font-bold"
                id="중첩된 블럭 요소 표현하기"
            >
                <span class>중첩된 블럭 요소 표현하기</span>
            </h3>
            <p class="mt-2 mb-2">
                <span class
                    >중첩된 블럭 요소는 bullet, numbered, todo 와 같은 블럭
                    컨텐츠를 말한다. 자식 요소로 같은 구성요소를 가질 수 있다.
                    그리고 이와 같은 구조는 중첩 요소가 얼마나 생성될지 알 수
                    없기 때문에 데이터가 특정 조건일 때 까지 무한정으로
                    렌더링시키는 방법이 필요했다. 그래서 컴포넌트를 사용한
                    재귀를 사용했다. React 에서는 함수 컴포넌트로 식별자를 통해
                    재귀를 표현하기 쉬웠지만 Astro 에서는 파일 자체가 하나의
                    컴포넌트이기 때문에 어떻게 표현해야 할지 고민이 되었다.
                    그래서 같은 경로의 파일을 스스로 불러와 재귀로 표현할 수
                    있도록 하여 해결했다.
                </span>
            </p>
    </main>
    <footer class="flex items-center justify-center w-full px-4 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-6xl mx-auto pt-20 pb-10">
      © 2025 ethan-heo. All rights reserved.
    </footer>
  </body>
</html>
`,
);

// console.log(JSON.stringify(result, null, 2));

// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import GithubSlugger from 'github-slugger';

import tailwindcss from '@tailwindcss/vite';

/**
 * `h2`와 `h3`에 앵커 링크를 붙이고, 앵커로 이동한 뒤 제목이 키보드 포커스를
 * 받을 수 있게 `tabindex`를 부여한다.
 */
function headingAnchors() {
  const slugger = new GithubSlugger();
  return {
    name: 'heading-anchors',
    element: {
      filter: ['h2', 'h3'],
      visit(node, ctx) {
        const text = ctx.textContent(node);
        const existingId = node.properties?.id;
        const id = typeof existingId === 'string' ? existingId : slugger.slug(text);

        ctx.setProperty(node, 'id', id);
        ctx.setProperty(node, 'tabIndex', -1);
        // 앵커 글자를 마크업에 넣으면 제목 텍스트에 딸려 오므로 CSS로 그린다.
        ctx.appendChild(node, {
          type: 'element',
          tagName: 'a',
          properties: {
            href: `#${id}`,
            className: ['heading-anchor'],
            'aria-label': `${text} 문단 링크`,
          },
          children: [],
        });
      },
    },
  };
}

/** `400`이나 `400px` 형태만 폭으로 받는다. 읽을 수 없으면 `null`을 돌려준다. */
function parseWidth(value) {
  const matched = /^\s*(\d+)\s*(?:px)?\s*$/.exec(value);
  if (!matched) return null;

  const width = Number(matched[1]);
  return width > 0 ? width : null;
}

/**
 * 이미지 링크의 title 자리에 적은 `w=400`을 읽어 표시 폭과 가운데 정렬을 넣는다.
 * 이 자리는 이미지 파일이 만들어진 뒤라 파일 크기는 달라지지 않는다.
 */
function imageWidth() {
  return {
    name: 'image-width',
    element: {
      filter: ['img'],
      // `ctx`를 선언하지 않으면 satteri가 반환한 노드로 갈아 끼우지 않는다. 쓰지 않아도 남겨 둔다.
      visit(node, ctx) {
        const title = node.properties?.title;
        if (typeof title !== 'string' || !title.startsWith('w=')) return;

        const width = parseWidth(title.slice(2));

        if (width === null) {
          // 폭을 못 읽었다고 이미지를 지울 수는 없으므로 알리고 그대로 둔다.
          console.warn(`[image-width] 폭으로 읽을 수 없는 값이라 무시한다: "${title}"`);
          return;
        }

        // `setProperty`로는 속성을 지울 수 없어 `title`을 뺀 노드로 갈아 끼운다.
        const { title: _dropped, ...rest } = node.properties;

        return {
          type: 'element',
          tagName: 'img',
          properties: {
            ...rest,
            // 인라인 선언이 `.prose img`의 규칙을 이기므로 본문 폭을 넘지 않게 여기서 함께 묶는다.
            style: `max-width: min(${width}px, 100%); display: block; margin-inline: auto;`,
          },
          children: [],
        };
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://ethan-heo.github.io',
  markdown: {
    // 두 테마의 색을 함께 내보내고 전환은 global.css에서 처리한다.
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
    processor: satteri({ hastPlugins: [headingAnchors(), imageWidth()] }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});

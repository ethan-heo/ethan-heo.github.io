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

// https://astro.build/config
export default defineConfig({
  markdown: {
    // 두 테마의 색을 함께 내보내고 전환은 global.css에서 처리한다.
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
    processor: satteri({ hastPlugins: [headingAnchors()] }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});

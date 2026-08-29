## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Posts and Images

글은 `src/content/posts/<이름>/index.md`에 둔다. 파일 하나로 두지 않고 폴더를 만드는 이유는 이미지를 같은 자리에 보관하기 위해서다. Astro의 id 생성 규칙이 끝의 `/index`를 잘라내므로 폴더로 바꿔도 글 주소는 파일 이름을 그대로 쓸 때와 같다.

이미지는 글과 같은 폴더에 두고 본문에서 상대 경로로 참조한다.

```markdown
![대체 텍스트](./이름.webp)
```

`src/` 안에 있어야 빌드할 때 Astro가 WebP 변환과 해시 파일명을 적용한다. `public/`에 두면 그대로 복사만 되므로 쓰지 않는다.

저장소에 커밋되는 원본은 빌드가 줄여 주지 않는다. 이미지를 넣은 뒤 아래 명령을 돌려 최대 폭 1360px WebP로 바꾼다. 원본은 지워지고 본문의 상대 경로 참조도 새 확장자로 함께 바뀐다.

```
npm run images                    # 글 전체
npm run images -- <글 폴더 경로>   # 그 글만
```

움직이는 GIF, 이미 기준을 만족하는 WebP, 외부 URL 참조는 건드리지 않는다. 바꾸려는 이름의 `.webp`가 이미 있으면 덮어쓰지 않고 오류로 멈춘다.

## Git

브랜치를 합칠 때 머지 커밋을 만들지 않는다. `--no-ff`를 쓰지 않으며, 기능 브랜치를 상위 브랜치에 반영할 때는 먼저 상위 브랜치 위로 리베이스한 뒤 fast-forward로 합친다. 히스토리는 항상 한 줄로 유지한다.

```
git checkout <기능 브랜치>
git rebase <상위 브랜치>
git checkout <상위 브랜치>
git merge --ff-only <기능 브랜치>
```

기본 브랜치인 `main`에는 사용자가 명시적으로 지시했을 때만 합친다. 계획서의 구현 항목을 모두 끝냈다는 사실은 머지를 승인한 것이 아니다. 구현이 끝나면 작업 브랜치를 그대로 남겨 둔 채 완료 사실과 브랜치 이름을 알리고, 합칠지 여부는 사용자의 답을 받아 결정한다. 기능 브랜치를 `feature/<주제>` 같은 상위 작업 브랜치에 합치는 일은 이 제한을 받지 않는다.

작업 브랜치를 지우는 일도 사용자의 지시를 받은 뒤에 한다. 머지하지 않은 브랜치는 물론이고 이미 합친 브랜치도 임의로 지우지 않는다.

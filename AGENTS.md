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

## Git

브랜치를 합칠 때 머지 커밋을 만들지 않는다. `--no-ff`를 쓰지 않으며, 기능 브랜치를 상위 브랜치에 반영할 때는 먼저 상위 브랜치 위로 리베이스한 뒤 fast-forward로 합친다. 히스토리는 항상 한 줄로 유지한다.

```
git checkout <기능 브랜치>
git rebase <상위 브랜치>
git checkout <상위 브랜치>
git merge --ff-only <기능 브랜치>
```

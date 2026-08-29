/**
 * 글 폴더에 둔 이미지를 저장소에 커밋하기 전에 줄인다.
 * 최대 폭 1360px WebP로 바꾸고 원본은 지운다.
 *
 * 사용법:
 *   npm run images                    글 전체
 *   npm run images -- <글 폴더 경로>   그 글만
 */
import { readFile, readdir, rename, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

/** 본문 폭 680px의 두 배. 고해상도 화면에서도 흐리지 않은 선이다. */
const MAX_WIDTH = 1360;

const POSTS_ROOT = 'src/content/posts';
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif']);

/** 하위 디렉터리까지 훑어 이미지 파일 경로를 모은다. */
async function collectImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const found = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...(await collectImages(full)));
      continue;
    }
    if (IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      found.push(full);
    }
  }

  return found;
}

/**
 * 바뀐 파일을 가리키는 참조를 같은 폴더의 `index.md`에서 새 확장자로 고친다.
 * 다른 글의 본문은 건드리지 않는다.
 */
async function updateReferences(before, after) {
  const post = path.join(path.dirname(before), 'index.md');
  const body = await readFile(post, 'utf8').catch(() => null);
  if (body === null) return;

  const oldName = path.basename(before);
  const newName = path.basename(after);
  // `./이름.png`와 `이름.png` 양쪽을 받되 앞에 다른 경로 조각이 붙은 것은 건너뛴다.
  const pattern = new RegExp(`(\\]\\(\\.?/?)${escapeForRegExp(oldName)}(\\))`, 'g');
  const updated = body.replace(pattern, `$1${newName}$2`);

  if (updated === body) return;

  await writeFile(post, updated);
  console.log(`  참조 갱신: ${post}`);
}

function escapeForRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** 이미지 하나를 WebP로 바꾸고 원본을 지운다. */
async function convert(file) {
  const target = path.join(path.dirname(file), `${path.basename(file, path.extname(file))}.webp`);
  const image = sharp(file);
  const { width } = await image.metadata();

  await image
    // 원본이 기준보다 좁으면 확대하지 않는다.
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(`${target}.tmp`);

  await unlink(file);
  await rename(`${target}.tmp`, target);

  console.log(`변환: ${file} (${width}px) -> ${target}`);
  await updateReferences(file, target);
  return target;
}

async function main() {
  const target = process.argv[2] ?? POSTS_ROOT;
  const info = await stat(target).catch(() => null);

  if (!info?.isDirectory()) {
    console.error(`디렉터리가 아닙니다: ${target}`);
    process.exit(1);
  }

  const images = await collectImages(target);

  if (images.length === 0) {
    console.log('바꿀 이미지가 없습니다.');
    return;
  }

  for (const image of images) {
    await convert(image);
  }
}

await main();

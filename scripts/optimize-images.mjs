/**
 * 글 폴더에 둔 이미지를 저장소에 커밋하기 전에 줄인다.
 * 최대 폭 1360px WebP로 바꾸고 원본은 지운다.
 *
 * 사용법:
 *   npm run images                    글 전체
 *   npm run images -- <글 폴더 경로>   그 글만
 */
import { readdir, rename, stat, unlink } from 'node:fs/promises';
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

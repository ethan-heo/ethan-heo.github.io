/**
 * 글 폴더에 둔 이미지를 저장소에 커밋하기 전에 줄인다.
 * 최대 폭 1360px WebP로 바꾸고 원본은 지운다.
 *
 * 사용법:
 *   npm run images                    글 전체
 *   npm run images -- <글 폴더 경로>   그 글만
 */
import { access, readFile, readdir, rename, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

/** 본문 폭 680px의 두 배. 고해상도 화면에서도 흐리지 않은 선이다. */
const MAX_WIDTH = 1360;

const POSTS_ROOT = 'src/content/posts';
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif']);

let failed = false;

function warn(message) {
  console.warn(`경고: ${message}`);
}

function fail(message) {
  console.error(`오류: ${message}`);
  failed = true;
}

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

function escapeForRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 같은 폴더의 `index.md`에서 이 파일을 가리키는 상대 경로 참조를 찾는다.
 * `](` 뒤에 오는 `./이름` 또는 `이름` 형태만 받으므로 `http`나 `/`로 시작하는 참조는 걸리지 않는다.
 */
function referencePattern(fileName) {
  return new RegExp(`(\\]\\(\\.?/?)${escapeForRegExp(fileName)}(\\))`, 'g');
}

async function readPostBody(imagePath) {
  const post = path.join(path.dirname(imagePath), 'index.md');
  const body = await readFile(post, 'utf8').catch(() => null);
  return { post, body };
}

/** 바뀐 파일을 가리키는 참조를 새 확장자로 고친다. 다른 글의 본문은 건드리지 않는다. */
async function updateReferences(before, after) {
  const { post, body } = await readPostBody(before);
  if (body === null) return;

  const updated = body.replace(referencePattern(path.basename(before)), `$1${path.basename(after)}$2`);
  if (updated === body) return;

  await writeFile(post, updated);
  console.log(`  참조 갱신: ${post}`);
}

async function exists(file) {
  return access(file).then(() => true, () => false);
}

/**
 * 이미지 하나를 살펴 건너뛸지 판단한다.
 * 건너뛸 이유가 없으면 `null`을 돌려준다.
 */
async function reasonToSkip(file, metadata) {
  // 애니메이션 GIF는 변환하면 움직임이 사라진다.
  if ((metadata.pages ?? 1) > 1) {
    return '움직이는 이미지라 변환하면 움직임이 사라진다';
  }

  const isWebp = metadata.format === 'webp';
  if (isWebp && (metadata.width ?? 0) <= MAX_WIDTH) {
    return '이미 WebP이고 폭도 기준 이하다';
  }

  return null;
}

/** 이미지 하나를 WebP로 바꾸고 원본을 지운다. */
async function convert(file) {
  const image = sharp(file, { animated: true });
  const metadata = await image.metadata();

  const skip = await reasonToSkip(file, metadata);
  if (skip) {
    warn(`건너뜀 ${file} — ${skip}`);
    return;
  }

  const target = path.join(path.dirname(file), `${path.basename(file, path.extname(file))}.webp`);

  if (target !== file && (await exists(target))) {
    fail(`${target}가 이미 있어 덮어쓰지 않는다. 한쪽을 지우거나 이름을 바꾼 뒤 다시 실행한다`);
    return;
  }

  const temporary = `${target}.tmp`;
  await sharp(file)
    // 원본이 기준보다 좁으면 확대하지 않는다.
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(temporary);

  await unlink(file);
  await rename(temporary, target);

  console.log(`변환: ${file} (${metadata.width}px) -> ${target}`);

  const { body } = await readPostBody(file);
  if (body !== null && !referencePattern(path.basename(file)).test(body)) {
    warn(`${file}을 본문에서 참조하지 않는다`);
  }

  await updateReferences(file, target);
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

  if (failed) process.exit(1);
}

await main();

---
title: ArrayBuffer - PNG 파일 분석
date: 2026-08-27
summary: PNG 파일을 바이트 그대로 읽어 청크 구조를 훑고, 이미지의 가로·세로 크기와 색상 정보를 꺼내는 프로그램을 만들기
tags:
  - JavaScript
  - ArrayBuffer
  - PNG
  - 파일_분석
  - 학습
draft: false
keyPoint: true
---
## 개념

### PNG 파일 구조

- PNG 파일은 `시그니처`와 `청크`로 나뉜다. 시그니처는 파일 형식을 나타내고, 청크는 파일 내부의 구성 정보를 담는다. 청크는 유형별로 나뉘며 아래와 같이 구성된다.
	| 타입 | 담고 있는 것 |
	| --- | --- |
	| `IHDR` | 이미지 헤더. 가로·세로 크기, 비트 깊이, 색상 유형 |
	| `tEXt` | 글자로 된 부가 정보. 이 파일에는 `Comment`라는 키가 들어 있다 |
	| `IDAT` | 압축된 픽셀 데이터. 실제 그림이 여기 있다 |
	| `IEND` | 파일이 끝났다는 표시. 데이터가 0바이트다 |

### ArrayBuffer를 다루는 API

- ArrayBuffer는 길이가 고정된 바이트 배열이다. ArrayBuffer 자체만으로는 사용할 수 없고, DataView나 TypedArray를 사용해 다룰 수 있다.
- DataView는 ArrayBuffer를 인자로 받아 특정 위치의 값을 원하는 타입으로 변환한다. 예를 들어 `DataView.getUint8(offset)` 메서드는 `offset` 위치에서 8비트 데이터를 가져와 부호 없는 정수로 변환한다.
- Uint8Array는 ArrayBuffer를 인자로 받아 데이터를 8비트 단위로 읽을 수 있게 해 준다.

## 동작 순서

1. 이미지를 ArrayBuffer로 변환한다.
2. 변환된 ArrayBuffer의 시그니처를 확인해 PNG 파일인지 판별한다.
3. ArrayBuffer를 청크 배열로 변환한다.
4. IHDR 청크를 찾아 데이터를 읽고 이미지 정보를 반환한다.
5. 반환된 정보를 출력한다.

## 구현

### 이미지를 ArrayBuffer로 변환한다

```javascript
const buffer = await readFile(path); // return Buffer

return buffer.buffer.slice( // buffer.buffer == ArrayBuffer
	buffer.byteOffset,
	buffer.byteOffset + buffer.byteLength,
);
```

- 파일 API의 `readFile`을 사용해 이미지 버퍼를 가져온다. 반환된 버퍼의 타입은 ArrayBuffer가 아니라 Buffer다. 이는 파일 API가 Node.js의 Buffer를 반환하기 때문이다.
- Buffer의 `offset`(시작 위치)부터 버퍼의 끝 위치까지 ArrayBuffer를 잘라 반환한다. ArrayBuffer는 메모리를 공유하며 미리 정해진 크기를 사용하기 때문에, Buffer에 할당된 영역만 잘라야 이미지 데이터를 정확히 사용할 수 있다.

### 변환된 ArrayBuffer의 시그니처를 확인해 PNG 파일인지 판별한다

```javascript
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const head = new Uint8Array(arrayBuffer, 0, PNG_SIGNATURE.length);

return PNG_SIGNATURE.every((expected, index) => head[index] === expected);
```

- 변환된 ArrayBuffer의 첫 8바이트는 시그니처다. PNG 시그니처를 나타내는 바이트 배열을 만들고, ArrayBuffer의 시작점부터 8바이트를 `Uint8Array`로 가져온다. 이후 각 바이트를 비교해 PNG 파일인지 확인한다.

### ArrayBuffer를 청크 배열로 변환한다

```javascript
let chunks = []
const utf8Decoder = new TextDecoder('utf-8')
const view = new DataView(arrayBuffer)

let offset = 8; // 첫 청크가 시작하는 자리
while (true) {
	const length = view.getUint32(offset)
	const type = utf8Decoder.decode(new Uint8Array(arrayBuffer, offset + 4, 4))
	const dataOffset = offset + 8

	chunks.push({
		length,
		type,
		dataOffset
	})

	offset = offset + length + 12 // 12(length + type + CRC 크기를 더한 값)

	if (type === 'IEND') {
		break;
	}
}

return chunks
```

- PNG 파일의 ArrayBuffer는 데이터 길이(length), 유형(type), 데이터, CRC가 순서대로 배치된 청크로 나뉜다. 이 구조를 이용해 청크를 순회하며 파싱한다. 유형(type)이 'IEND'인 청크를 만나면 순회를 종료한다.
- Length는 데이터의 길이를 나타내며 4바이트를 사용한다. `DataView.getUint32`를 사용해 `offset` 위치에서 4바이트를 읽고, 이를 부호 없는 정수로 변환한다.
- Type은 청크의 유형을 나타내며 4바이트를 사용한다. `Uint8Array`를 사용해 ArrayBuffer의 `offset + 4` 위치부터 4바이트 영역을 참조한다. `TextDecoder`를 `'utf-8'`로 설정한 뒤 `decode` 메서드에 Uint8Array 객체를 전달해 텍스트로 변환한다.
- DataOffset은 데이터의 시작 위치를 나타낸다. 앞의 length와 type이 각각 4바이트를 사용하므로, 시작 위치에서 8바이트를 더해 데이터의 위치를 계산한다.
- Length, type, dataOffset을 리터럴 객체로 구성한 후 배열에 추가한다.
- 다음 청크의 offset을 계산하기 위해 length 필드, type 필드, 데이터, CRC의 크기를 더한다.

### IHDR 청크에서 이미지 정보를 읽어 반환한다

```javascript
const view = new DataView(arrayBuffer)

const width = view.getUint32(dataOffset)
const height = view.getUint32(dataOffset + 4)
const bitDepth = view.getUint8(dataOffset + 4 + 4)
const colorType = view.getUint8(dataOffset + 4 + 4 + 1)

return {
	width,
	height,
	bitDepth,
	colorType
}
```

- IHDR은 이미지 크기와 같은 정보를 담고 있다. 여기서는 해당 정보를 반환한다.
- DataOffset은 IHDR 청크의 dataOffset이다. 그러므로 데이터의 시작 위치는 이미 알고 있다.
- DataView를 사용해 IHDR 데이터의 offset 위치를 기준으로 각 값을 정수로 변환한다. 값의 위치가 서로 다르므로 앞선 값의 크기를 고려해 offset을 계산해야 한다.
- width, height, bitDepth, colorType 순으로 배치된 값을 가져와 리터럴 객체로 구성한 후 반환한다.

## ArrayBuffer를 학습하게 된 이유

사실 ArrayBuffer 자체를 특정한 목적을 가지고 학습할 생각은 없었다. 새로 만든 학습 플러그인을 테스트하려는 목적이었다. 이 플러그인은 기술 학습을 위한 플러그인으로, 탑다운 방식으로 예제를 완성하며 기술을 익히는 것을 목표로 한다. 실제로 사용해 보니 만족스러웠다.

예제를 완성하는 동안 모르는 부분이 많았다. 특히 PNG의 데이터 구성과 ArrayBuffer의 특징을 이해하지 못했는데, tutor(스킬)를 사용해 계속 질문하면서 내가 모르는 부분이 무엇인지 알게 되었다. 그 과정에서 점점 재미를 느꼈고 학습에 몰입할 수 있었다. 학습 원칙에 'AI가 예제를 수정하지 않는다'라는 내용이 있었기에 tutor를 더 신뢰하며 자주 사용했던 것 같다.

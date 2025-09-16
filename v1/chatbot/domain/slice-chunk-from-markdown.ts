/**
 * @description 사용하는 모델이 허용하는 사이즈에 맞춰 텍스트를 나누어 반환한다.
 * @param markdown
 * @param size
 * @returns
 */
const sliceChunkFromMarkdown = (
    markdown: string,
    size: number = 800,
): string[] => {
    const paragraphs = markdown.split(/\n{2,}/);
    const result: string[] = [];
    let buf = "";

    for (const paragraph of paragraphs) {
        const _p = paragraph.trim();

        if (!_p) continue;

        if ((buf + _p).length > size) {
            if (buf) {
                result.push(buf.trim());
            }

            if (_p.length > size) {
                for (let i = 0; i < _p.length; i += size) {
                    result.push(_p.slice(i, i + size));
                }
                buf = "";
            } else {
                buf = _p;
            }
        } else {
            buf = buf ? buf + _p : _p;
        }
    }

    if (buf) {
        result.push(buf.trim());
    }

    return result.filter(Boolean);
};

export default sliceChunkFromMarkdown;

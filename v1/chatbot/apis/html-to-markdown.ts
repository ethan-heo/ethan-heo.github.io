import TurndownService from "turndown";
// @ts-expect-error: No types for this module
import gfm from "@guyplusplus/turndown-plugin-gfm";

const createHTMLToMarkdownAPI = (): HTMLToMarkdownAPI => {
    const td = new TurndownService({
        headingStyle: "atx",
        codeBlockStyle: "fenced",
        bulletListMarker: "-",
        emDelimiter: "*",
        strongDelimiter: "**",
    });
    td.use(gfm.gfm);

    function normalizeWhitespace(s: string) {
        return s
            .replace(/\u00A0/g, " ")
            .replace(/[\t\v\f\r]+/g, " ")
            .replace(/\s{2,}/g, " ")
            .replace(/\n{3,}/g, "\n\n")
            .trim();
    }

    return {
        convert: (html) => {
            return normalizeWhitespace(
                td.turndown(html).replace(/\n{3,}/g, "\n\n"),
            );
        },
    };
};

export default createHTMLToMarkdownAPI;

export interface HTMLToMarkdownAPI {
    convert: (html: string) => string;
}

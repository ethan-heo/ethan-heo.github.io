import React from "react";
import type { HeadingInfo } from "../../../../v1/blog/domain/interfaces/model.interface";

interface Props {
    contents: HeadingInfo[];
    className?: string;
}

const Contents: React.FC<Props> = ({ contents, className }) => {
    return (
        <ul className={className}>
            {contents.map((content) => {
                const depthCN = content.level === 3 ? "pl-3" : "";

                return (
                    <li key={content.text} className="mt-1">
                        <a
                            href={`#${content.text}`}
                            className={`${depthCN} opacity-70 underline underline-offset-4`}
                        >
                            {content.text}
                        </a>
                    </li>
                );
            })}
        </ul>
    );
};

export default Contents;

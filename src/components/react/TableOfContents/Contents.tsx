import React from "react";
import type { HeadingInfo } from "../../../../v1/blog/domain/interfaces/model.interface";

interface Props {
    contents: HeadingInfo[];
}

const Contents: React.FC<Props> = ({ contents }) => {
    return (
        <ul>
            {contents.map((content, idx) => {
                const DEPTH_CLASS_NAMES = ["", "", "pl-4"];

                return (
                    <li key={`table-of-contents-${idx}`} className="mt-1">
                        <a
                            href={`#${content.id}`}
                            className={`${DEPTH_CLASS_NAMES[content.level - 1]} opacity-70 underline underline-offset-4`}
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

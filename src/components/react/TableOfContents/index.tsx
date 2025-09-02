import React from "react";
import Contents from "./Contents";
import type { HeadingInfo } from "../../../../v1/blog/domain/interfaces/model.interface";

interface Props {
    contents: HeadingInfo[];
    className?: string;
}

const TableOfContents: React.FC<Props> = ({ contents = [], className }) => {
    return (
        <div className={className}>
            <Contents contents={contents} />
        </div>
    );
};

export default TableOfContents;

import React from "react";
import Contents from "./Contents";
import type { HeadingInfo } from "../../../../v1/blog/domain/interfaces/model.interface";

interface Props {
    contents: HeadingInfo[];
}

const TableOfContents: React.FC<Props> = ({ contents = [] }) => {
    return (
        <div className="mb-8">
            <Contents contents={contents} />
        </div>
    );
};

export default TableOfContents;

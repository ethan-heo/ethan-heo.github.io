import React from "react";
import Contents from "./Contents";
import useTransformHeadingElementToInfo from "./useTransformHeadingElementToInfo";

const TableOfContents: React.FC = () => {
    const contents = useTransformHeadingElementToInfo();

    return <Contents contents={contents} />;
};

export default TableOfContents;

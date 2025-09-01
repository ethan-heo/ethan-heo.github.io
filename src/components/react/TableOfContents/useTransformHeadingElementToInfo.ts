import { useEffect, useState } from "react";
import type { HeadingInfo } from "../../../../v1/blog/domain/interfaces/model.interface";
import blogController from "../../../../v1/blog/controller";

type Status = "transform" | "wait";

let status: Status = "wait";
let headingInfo: HeadingInfo[] = [];

const useTransformHeadingElementToInfo = () => {
    const [contents, setContents] = useState<HeadingInfo[]>(headingInfo);

    useEffect(() => {
        if (status === "transform") return;

        status = "transform";

        setContents(
            blogController.blog.transformJumpLinkFromElement(document.body),
        );
    }, []);

    return contents;
};

export default useTransformHeadingElementToInfo;

import { useReducer, type Reducer } from "react";
import blogController from "../../../v1/blog/controller";
import type { BlogItem } from "../../../v1/blog/domain/interfaces/model.interface";

const SIZE = 16;

interface InitialStates {
    page: number;
    blogList: BlogItem[];
    useAddMore: boolean;
}

interface ADD_MORE_ACTION {
    type: "pagination/more";
}

type PaginationActions = ADD_MORE_ACTION;

const createInitialStates = (): InitialStates => {
    const blogList = blogController.blog.getBlogListFromJSON(0, SIZE);

    return {
        page: 0,
        blogList,
        useAddMore: blogController.blog.hasNextBlogList(1, SIZE),
    };
};

const ADD_MORE: ADD_MORE_ACTION = {
    type: "pagination/more",
};

const reducer: Reducer<InitialStates, PaginationActions> = (state, action) => {
    switch (action.type) {
        case ADD_MORE.type: {
            const blogList = blogController.blog.getBlogListFromJSON(
                state.page + 1,
                SIZE,
            );
            const hasBlogItems = blogList.length > 0;

            return {
                ...state,
                page: hasBlogItems ? state.page + 1 : state.page,
                blogList: [...state.blogList, ...blogList],
                useAddMore: blogController.blog.hasNextBlogList(
                    state.page + 1,
                    SIZE,
                ),
            };
        }
        default:
            return state;
    }
};

const useBlogListPagination = () => {
    const [state, dispatch] = useReducer(reducer, createInitialStates());

    const addMore = () => {
        dispatch(ADD_MORE);
    };

    return {
        blogList: state.blogList,
        useAddMore: state.useAddMore,
        addMore,
    };
};

export default useBlogListPagination;

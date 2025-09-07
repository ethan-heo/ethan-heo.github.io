import { useState } from "react";
import SearchBlogInput from "./SearchBlogInput";
import SearchBlogResult from "./SearchBlogResult";
import blogController from "../../../../v1/blog/controller";

const SearchBlogs = () => {
    const [query, setQuery] = useState("");

    return (
        <div className="sticky top-4 left-0 mt-12 mb-12 pl-4 pr-4 z-50">
            <SearchBlogInput onSearch={setQuery} />
            <SearchBlogResult
                results={blogController.blog.searchBlogItems(query)}
            />
        </div>
    );
};

export default SearchBlogs;

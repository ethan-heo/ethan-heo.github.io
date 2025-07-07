import { useState } from "react";
import blogData from "../../assets/blogs.json";

const LIMITS = 18;
const DATA_LENGTH = blogData.length;

function BlogList() {
    const [page, setPage] = useState(1);
    const useMore = LIMITS * page < DATA_LENGTH;
    const sliceSize = useMore ? LIMITS * page : undefined;
    const blogs = blogData.slice(0, sliceSize);

    return (
        <div className="flex flex-col gap-5 items-center">
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {blogs.map((blog) => (
                    <li
                        key={blog.id}
                        className="card bg-base-100 w-full shadow-sm"
                    >
                        <div className="card bg-base-100 shadow-md">
                            <figure className="h-48 overflow-hidden">
                                <img
                                    src={blog.backgroundImage}
                                    alt={blog.title}
                                    className="w-full h-full object-cover"
                                />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title text-base">
                                    {blog.title}
                                </h2>
                                <p className="text-sm  line-clamp-2 mb-3">
                                    {blog.description}
                                </p>
                                <div className="card-actions justify-end">
                                    <a
                                        href={`/blog/${blog.id}`}
                                        className="btn btn-sm btn-outline"
                                    >
                                        자세히 보기
                                    </a>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            {useMore && (
                <button
                    className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl btn-primary"
                    onClick={() => setPage(page + 1)}
                    aria-label="더 보기"
                >
                    More
                </button>
            )}
        </div>
    );
}

export default BlogList;

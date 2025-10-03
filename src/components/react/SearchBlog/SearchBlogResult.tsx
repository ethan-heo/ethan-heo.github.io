import type { SearchedBlogItem } from "../../../../v1/blog/domain/interfaces/model.interface";

interface Props {
    results: SearchedBlogItem[];
}

const SearchBlogResult = ({ results }: Props) => {
    return (
        <>
            <div
                aria-live="polite"
                className="sr-only"
                id="search-results-status"
                tabIndex={-1}
            >
                {results.length > 0
                    ? `검색 결과가 ${results.length}개 있습니다.`
                    : "검색 결과가 없습니다."}
            </div>
            <ul
                id="search-results"
                role="listbox"
                aria-labelledby="search-results-status"
                className="absolute flex top-11 left-0 list bg-base-100 shadow-md max-h-96 w-full overflow-y-auto"
            >
                {results.map((result, idx) => (
                    <li
                        role="option"
                        aria-label={`${idx + 1}번째 결과, ${result.title}`}
                        tabIndex={0}
                        className="list-row"
                        key={result.id}
                    >
                        <div>
                            <img
                                className="size-10 rounded-box"
                                src={result.backgroundImg}
                                alt={result.title}
                            />
                        </div>
                        <div>
                            <div>{result.title}</div>
                            <div className="text-xs font-semibold opacity-60">
                                {result.categories.join(", ")}
                            </div>
                        </div>
                        <p className="list-col-wrap text-xs">
                            {result.descriptions}
                        </p>
                        <a
                            className="relative overflow-hidden btn btn-square btn-ghost justify-self-end"
                            href={`/blog/${result.id}`}
                            target="_blank"
                        >
                            <span className="sr-only">새 페이지 열기</span>
                            <svg
                                className="size-[1.2em]"
                                viewBox="0 0 16 16"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                <g
                                    id="SVGRepo_tracerCarrier"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                ></g>
                                <g
                                    id="SVGRepo_iconCarrier"
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    {" "}
                                    <path d="m 4 2 c 0 -0.265625 0.105469 -0.519531 0.292969 -0.707031 c 0.390625 -0.390625 1.023437 -0.390625 1.414062 0 l 6 6 c 0.1875 0.1875 0.292969 0.441406 0.292969 0.707031 s -0.105469 0.519531 -0.292969 0.707031 l -6 6 c -0.390625 0.390625 -1.023437 0.390625 -1.414062 0 c -0.1875 -0.1875 -0.292969 -0.441406 -0.292969 -0.707031 s 0.105469 -0.519531 0.292969 -0.707031 l 5.292969 -5.292969 l -5.292969 -5.292969 c -0.1875 -0.1875 -0.292969 -0.441406 -0.292969 -0.707031 z m 0 0"></path>{" "}
                                </g>
                            </svg>
                        </a>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default SearchBlogResult;

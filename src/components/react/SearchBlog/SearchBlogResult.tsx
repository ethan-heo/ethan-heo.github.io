import type { SearchedBlogItem } from "../../../../v1/blog/domain/interfaces/model.interface";

interface Props {
    results: SearchedBlogItem[] | Error;
}

const SearchBlogResult = ({ results }: Props) => {
    if (results instanceof Error) {
        return null;
    }

    return (
        <ul className="absolute flex top-11 left-0 list bg-base-100 shadow-md max-h-96 w-full">
            {results.map((result) => (
                <li className="list-row" key={result.id}>
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
                        className="btn btn-square btn-ghost justify-self-end"
                        href={`/blog/${result.id}`}
                        target="_blank"
                    >
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
    );
};

export default SearchBlogResult;

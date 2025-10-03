import type { ChangeEvent, KeyboardEvent } from "react";

interface Props {
    onSearch: (query: string) => void;
    isExpanded?: boolean;
}

const SearchBlogInput = ({ onSearch, isExpanded }: Props) => {
    const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onSearch(e.currentTarget.value);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.trim().length === 0) {
            onSearch("");
        }
    };

    return (
        <form role="search" onSubmit={(e) => e.preventDefault()}>
            <label className="input w-full" htmlFor="search-input">
                <svg
                    className="h-[1em] opacity-50"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                >
                    <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                    </g>
                </svg>
                <input
                    id="search-input"
                    type="search"
                    placeholder="검색"
                    className="grow"
                    aria-label="블로그 검색"
                    aria-controls="search-results"
                    aria-expanded={isExpanded ? "true" : "false"}
                    onKeyDown={handleSearch}
                    onChange={handleChange}
                />
            </label>
        </form>
    );
};

export default SearchBlogInput;

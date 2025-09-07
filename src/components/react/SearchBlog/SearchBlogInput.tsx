import type { ChangeEvent, KeyboardEvent } from "react";

interface Props {
    onSearch: (query: string) => void;
}

const SearchBlogInput = ({ onSearch }: Props) => {
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
        <label className="input w-full">
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
                type="search"
                className="grow"
                placeholder="Search"
                onKeyDown={handleSearch}
                onChange={handleChange}
            />
        </label>
    );
};

export default SearchBlogInput;

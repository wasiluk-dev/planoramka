import React, { useEffect, useRef, useState } from "react";
import './dropdown.css'

interface Option {
    [key: string]: any;
}

interface SearchableDropdownProps {
    options: Option[];
    label: string;
    id: string;
    selectedVal: string;
    handleChange: (value: Option | null) => void;
    maxOptions?: number; // Optional prop to cap the number of options
    placeholder: string
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
                                                                   options,
                                                                   label,
                                                                   id,
                                                                   selectedVal,
                                                                   handleChange,
                                                                   maxOptions = 99, // Default to show up to 10 options if not provided
                                                                    placeholder
                                                               }) => {
    const [query, setQuery] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const selectOption = (option: Option) => {
        setQuery("");
        handleChange(option);
        setIsOpen(false);
    };

    const getDisplayValue = (): string => {
        return query || selectedVal || ""; // Prioritize query, then selectedVal
    };

    const filter = (options: Option[]): Option[] => {
        return options
            .filter((option) =>
                option[label].toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, maxOptions); // Limit the number of options displayed
    };

    return (
        <div className="dropdown" ref={dropdownRef}>
            <div className="">
                <div className="selected-value dropdown">
                    <input
                        placeholder={placeholder} // Always use the placeholder for empty input
                        className="form-control"
                        ref={inputRef}
                        type="text"
                        value={getDisplayValue()} // Dynamically update based on query and selectedVal
                        name="searchTerm"
                        onChange={(e) => {
                            const inputValue = e.target.value;
                            setQuery(inputValue); // Update query state
                            if (!inputValue) {
                                handleChange(null); // Reset selected value when cleared
                            }
                        }}
                        onClick={() => setIsOpen(true)} // Open dropdown on click
                    />
                </div>
                <div className={`arrow ${isOpen ? "open" : ""}`}></div>
            </div>

            {isOpen && (
                <div className="options">
                    {filter(options).map((option, index) => (
                        <div
                            onClick={() => selectOption(option)}
                            className={`option ${
                                option[label] === selectedVal ? "selected" : ""
                            }`}
                            key={`${id}-${index}`}
                        >
                        {option[label]}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchableDropdown;

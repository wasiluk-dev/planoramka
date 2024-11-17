import React, { useEffect, useRef, useState } from "react";
import './dropdown.css'

interface Option {
    [key: string]: any;
}

interface SearchableDropdownProps {
    options: Option[];
    label: string;
    id: string;
    selectedVal: string | null;
    handleChange: (value: string | null) => void;
    maxOptions?: number; // Optional prop to cap the number of options
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
                                                                   options,
                                                                   label,
                                                                   id,
                                                                   selectedVal,
                                                                   handleChange,
                                                                   maxOptions = 10, // Default to show up to 10 options if not provided
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
        handleChange(option[label]);
        setIsOpen(false);
    };

    const getDisplayValue = (): string => {
        if (query) return query;
        if (selectedVal) return selectedVal;
        return "";
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
            <div className="control">
                <div className="selected-value dropdown">
                    <input
                        className="form-text"
                        ref={inputRef}
                        type="text"
                        value={getDisplayValue()}
                        name="searchTerm"
                        onChange={(e) => {
                            setQuery(e.target.value);
                            handleChange(null);
                        }}
                        onClick={() => setIsOpen((prev) => !prev)}
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

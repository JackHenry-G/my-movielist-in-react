import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";

export default function SearchBar({handleSearch}) {
    const [query, setQuery] = useState("");

    const handleChange = (event) => {
        setQuery(event.target.value);
    };

    const handleOnKeyUp = (event) => {
        if (event.key === "Enter") {
            handleSearch(String(query));
        }
    };

    const handleButtonClick = () => {
        handleSearch(String(query));
    }

    return (
        <div className="search-bar">
            <input
                className="search-term"
                id="movies-search-bar"
                type="text"
                placeholder="Search for your favourite movies..."
                value={query}
                onChange={handleChange}
                onKeyUp={handleOnKeyUp}
            />
            <button className="search-button" onClick={handleButtonClick}>
                <FontAwesomeIcon icon={faSearch}/>
            </button>
        </div>
    );
}
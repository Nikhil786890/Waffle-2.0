import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";

function App() {
  // Declare state variables with proper names
  const [typedQuery, setTypedQuery] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [openLibrarySuggestions, setOpenLibrarySuggestions] = useState([]);
  const [userFocusState, setUserFocusState] = useState(false);

  // Handle input change
  function handleChange(e) {
    const val = e.target.value;
    setTypedQuery(val);
    setUserFocusState(true);
  }

  // Whenever `typedQuery` changes, fetch from OpenLibrary
  useEffect(() => {
    if (typedQuery.trim()) {
      // Perform API call to your Express server
      axios
        .get(`http://localhost:5000/openlibrary?q=${typedQuery.trim()}`)
        .then((response) => {
          setOpenLibrarySuggestions(response.data);
          setFilteredSuggestions(response.data);
        })
        .catch((error) => console.error(error));
    } else {
      setFilteredSuggestions([]);
    }
  }, [typedQuery]);

  return (

    <div className="outer_box">
      
      <h1>Waffle</h1>
      <div className="search_container">
        <input
          onChange={(e) => handleChange(e)}
          onFocus={() => setUserFocusState(true)}
          onBlur={() => setTimeout(() => setUserFocusState(false), 300)}
          value={typedQuery}
          className="search_box"
        />

        {typedQuery.trim().length > 0 &&
          filteredSuggestions.length > 0 &&
          userFocusState && (
            <ul>
              {filteredSuggestions.map((item, index) => (
                <li
                    key={index}
                    onClick={() => {
                      setTypedQuery(item);
                      setFilteredSuggestions([]);
                      setUserFocusState(false);
                    }}>
                    {item}
                </li>
              ))}
            </ul>
          )}

        <button>
          <SearchIcon />
        </button>
      </div>
    </div>
  );
}

export default App;

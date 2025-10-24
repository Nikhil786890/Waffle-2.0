import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import RoomView from "./RoomView";
import "./styles.css";

function App() {
  const [typedQuery, setTypedQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [userFocusState, setUserFocusState] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const val = e.target.value;
    setTypedQuery(val);
    setUserFocusState(true);
  }

  useEffect(() => {
    if (typedQuery.trim()) {
      setLoading(true);
      axios
        .get(`http://localhost:5000/openlibrary?q=${typedQuery.trim()}`)
        .then((response) => {
          setFilteredSuggestions(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("API Error:", error);
          setLoading(false);
        });
    } else {
      setFilteredSuggestions([]);
    }
  }, [typedQuery]);

  return (
    <RoomView>
      <div className="outer_box">
        <h1 className="text-5xl font-bold text-gray-700 mb-6">Waffle</h1>

        <div className="search_container">
          <input
            onChange={handleChange}
            onFocus={() => setUserFocusState(true)}
            onBlur={() => setTimeout(() => setUserFocusState(false), 300)}
            value={typedQuery}
            className="search_box px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder-gray-400"
            placeholder="Search for books..."
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700">
            <SearchIcon />
          </button>

          {/* Suggestions Dropdown */}
          {userFocusState &&
            typedQuery.trim().length > 0 &&
            filteredSuggestions.length > 0 && (
              <ul className="dropdown bg-white rounded-xl shadow-lg border border-gray-200 z-20">
                {filteredSuggestions.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setTypedQuery(item);
                      setFilteredSuggestions([]);
                      setUserFocusState(false);
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-gray-700"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}

          {/* Loading text */}
          {loading && (
            <div className="absolute mt-2 w-full text-center text-gray-500">
              Searching...
            </div>
          )}
        </div>
      </div>
    </RoomView>
  );
}

export default App;

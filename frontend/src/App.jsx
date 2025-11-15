import React, { useState, useEffect } from "react";
import { Search, BookOpen, Sparkles, Loader2, Clock } from "lucide-react";

function App() {
  const [typedQuery, setTypedQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [userFocusState, setUserFocusState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  // Load search history from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("history")) || [];
    setSearchHistory(saved);
  }, []);

  // Save new search query
  function saveSearch(query) {
    if (!query.trim()) return;

    const updated = [...new Set([query, ...searchHistory])].slice(0, 20); // keep 20 latest
    localStorage.setItem("history", JSON.stringify(updated));
    setSearchHistory(updated);
  }

  function handleChange(e) {
    const val = e.target.value;
    setTypedQuery(val);
    setUserFocusState(true);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      saveSearch(typedQuery);
      setUserFocusState(false);
      setFilteredSuggestions([]);
    }
  }

  // Fetch suggestions from backend
  useEffect(() => {
    if (typedQuery.trim()) {
      setLoading(true);

      fetch(`http://localhost:5000/openlibrary?q=${encodeURIComponent(typedQuery)}`)
        .then((res) => res.json())
        .then((data) => {
          setFilteredSuggestions(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("API error:", err);
          setLoading(false);
        });
    } else {
      setFilteredSuggestions([]);
    }
  }, [typedQuery]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating icons */}
      <div className="absolute inset-0 pointer-events-none">
        <BookOpen className="absolute top-20 left-20 text-amber-300/40 w-12 h-12 animate-float" />
        <BookOpen className="absolute bottom-32 right-32 text-rose-300/40 w-10 h-10 animate-float-delay" />
        <Sparkles className="absolute top-1/3 right-1/4 text-orange-300/40 w-8 h-8 animate-float-delay-2" />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-2xl px-6">

        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-16 h-16 text-amber-600 animate-bounce-slow" />
            <h1 className="text-7xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
              Waffle
            </h1>
          </div>
          <p className="text-gray-600 text-lg font-medium">Discover your next favorite book</p>
        </div>

        {/* Search input */}
        <div className="relative animate-slide-up">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-full blur-lg opacity-25 group-hover:opacity-40 transition duration-300"></div>

            <div className="relative bg-white rounded-full shadow-2xl">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5" />
              </div>

              <input
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setUserFocusState(true)}
                onBlur={() => setTimeout(() => setUserFocusState(false), 300)}
                value={typedQuery}
                className="w-full pl-16 pr-16 py-5 text-lg rounded-full focus:outline-none text-gray-700 placeholder-gray-400"
                placeholder="Search for books, authors, genres..."
              />

              {loading && (
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-orange-500">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              )}
            </div>
          </div>

          {/* History suggestions (Google style) */}
          {userFocusState && typedQuery === "" && searchHistory.length > 0 && (
            <div className="absolute w-full mt-3 animate-fade-in">
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 p-5">
                <p className="text-gray-500 text-sm mb-2">Recent Searches</p>
                <ul className="max-h-60 overflow-y-auto">
                  {searchHistory.map((item, index) => (
                    <li
                      key={index}
                      onClick={() => setTypedQuery(item)}
                      className="px-4 py-3 cursor-pointer hover:bg-gray-100 rounded-lg flex items-center gap-3"
                    >
                      <Clock className="w-4 h-4 text-gray-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* API suggestions */}
          {userFocusState && typedQuery.trim() !== "" && filteredSuggestions.length > 0 && (
  <div className="absolute w-full mt-3 animate-fade-in">
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
      <ul className="max-h-80 overflow-y-auto">
        {filteredSuggestions.map((item, index) => (
          <li
            key={index}
            onClick={() => {
              saveSearch(item.title);
              window.open(`https://openlibrary.org${item.key}`, "_blank");
              setUserFocusState(false);
            }}
            className="px-6 py-4 cursor-pointer hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 text-gray-700 transition-all duration-200 flex items-center gap-3 group border-b border-gray-50 last:border-b-0"
          >
            <BookOpen className="w-4 h-4 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="group-hover:text-orange-600 transition-colors">
              {item.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </div>
)}


          {/* No results */}
          {userFocusState &&
            typedQuery.trim() &&
            !loading &&
            filteredSuggestions.length === 0 && (
              <div className="absolute w-full mt-3 animate-fade-in">
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 p-8 text-center">
                  <p className="text-gray-500">No books found. Try a different search term.</p>
                </div>
              </div>
            )}
        </div>

        <div className="text-center mt-8 text-sm text-gray-500 animate-fade-in-delay">
          <p>Press Enter to search • Use ↑↓ to navigate suggestions</p>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        @keyframes float-delay { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
        @keyframes float-delay-2 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-25px); } }
        @keyframes fade-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delay { animation: float-delay 7s ease-in-out infinite; }
        .animate-float-delay-2 { animation: float-delay-2 8s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-fade-in-delay { animation: fade-in 0.8s ease-out 0.3s both; }
        .animate-slide-up { animation: slide-up 0.6s ease-out 0.2s both; }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

export default App;

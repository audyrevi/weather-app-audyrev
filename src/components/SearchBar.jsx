import React from "react";

const SearchBar = ({ inputCity, setInputCity, handleSearch }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Cari kota, misal: Jakarta, Indonesia"
        value={inputCity}
        onChange={(e) => setInputCity(e.target.value)}
        onKeyDown={handleSearch}
      />
      <button
        onClick={() => {
          handleSearch({ key: "Enter" });
        }}
        className="search-button"
      >
        🔍
      </button>
    </div>
  );
};

export default SearchBar;

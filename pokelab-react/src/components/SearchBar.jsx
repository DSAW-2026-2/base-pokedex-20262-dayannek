// components/SearchBar.jsx
import { useState } from "react";

export default function SearchBar({ onSearch, disabled }) {
  const [value, setValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(value);
  }

  return (
    <form className="search-panel" onSubmit={handleSubmit}>
      <p className="search-label">🔬 ANALYZE A SPECIMEN</p>

      <div className="search-input-row">
        <span className="prompt-caret">&gt;</span>
        <input
          className="search-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search Pokémon... (name or ID)"
          disabled={disabled}
          aria-label="Nombre o ID del espécimen"
        />
      </div>

      <button className="analyze-button" type="submit" disabled={disabled}>
        {disabled ? "ANALYZING..." : "RUN ANALYSIS"}
      </button>
    </form>
  );
}

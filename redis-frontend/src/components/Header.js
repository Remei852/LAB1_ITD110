import React from "react";
import { FaSearch, FaTimes } from "react-icons/fa"; 
import "./Header.css"; 

const Header = ({ search, setSearch,searchAttribute, setSearchAttribute,  handleSearch, handleClearSearch }) => {
  const attributes = ["id", "name", "age", "gender", "course", "birthdate", "phone", "email", "address"];
 
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.removeItem("isAuthenticated"); 
        window.location.href = "/";
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Server error. Please try again.");
    }
}

  return (
    <nav className="header">
      <h1>Student Management</h1>
      <div className="search-form">
        {/* Dropdown for selecting search attribute */}
        <select
          value={searchAttribute}
          onChange={(e) => setSearchAttribute(e.target.value)}
          className="search-dropdown"
        >
          {attributes.map((attr) => (
            <option key={attr} value={attr}>
              {attr.charAt(0).toUpperCase() + attr.slice(1)} {/* Capitalize the first letter */}
            </option>
          ))}
        </select>
        <div className="search-container">
          <input
            type="text"
            placeholder={`Search by ${searchAttribute}`}
            value={search}
            onChange={handleSearch}
            className="search-input"
          />
          <FaSearch className="search-icon" />
          {search && <FaTimes className="clear-icon" onClick={handleClearSearch} />}
          
        </div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Header;
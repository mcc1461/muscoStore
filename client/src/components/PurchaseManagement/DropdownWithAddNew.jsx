// DropdownWithAddNew.jsx
import React from "react";

export default function DropdownWithAddNew({
  label,
  options = [], // Default to empty array to prevent undefined errors
  value,
  onChange,
  isAddingNew,
  setIsAddingNew,
  newEntryName,
  setNewEntryName,
  disabled = false,
}) {
  return (
    <div className="mb-4">
      <label className="block mb-2 font-semibold">{label}</label>

      {/* Dropdown Select */}
      <select
        value={value || ""}
        onChange={(e) => {
          onChange(e.target.value);
          setIsAddingNew(false); // Uncheck "Add New" if selection changes
        }}
        className={`w-full p-2 mb-2 border rounded ${
          disabled ? "bg-gray-200 cursor-not-allowed" : ""
        }`}
        disabled={disabled}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option._id} value={option._id}>
            {option.name}
          </option>
        ))}
      </select>

      {/* Add New Checkbox */}
      {!disabled && (
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={isAddingNew}
            onChange={(e) => setIsAddingNew(e.target.checked)}
            className="form-checkbox"
          />
          <span className="ml-2">Add New {label}</span>
        </label>
      )}

      {/* Input for New Entry */}
      {isAddingNew && (
        <input
          type="text"
          value={newEntryName || ""}
          onChange={(e) => setNewEntryName(e.target.value)}
          placeholder={`Enter new ${label.toLowerCase()} name`}
          className="w-full p-2 mt-2 border rounded"
        />
      )}
    </div>
  );
}

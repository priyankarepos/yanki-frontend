import React, { useState } from 'react';

const CustomMultiSelect = ({ allOptions, selectedValues, onSelect, onRemove }) => {
    console.log("allOptions",allOptions);
  const [showOptions, setShowOptions] = useState(false);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleSelect = (option) => {
    onSelect(option);
    toggleOptions();
  };

  const handleRemove = (option) => {
    onRemove(option);
  };

  return (
    <div>
      <button onClick={toggleOptions}>Toggle Options</button>
      {showOptions && (
        <ul>
          {allOptions.map((option) => (
            <li key={option.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={() => handleSelect(option)}
                />
                {option.name}
              </label>
            </li>
          ))}
        </ul>
      )}
      <div>
        Selected Values:
        {selectedValues.map((value) => (
          <span key={value.id}>
            {value.name}
            <button onClick={() => handleRemove(value)}>Remove</button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default CustomMultiSelect;

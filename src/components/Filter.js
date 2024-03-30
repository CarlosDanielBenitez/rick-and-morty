import React from 'react';

const Filter = ({ type, onChange }) => {
  const options = ['All', 'Human', 'Alien', 'Humanoid', 'Robot'];

  return (
    <div>
      <label>{type.charAt(0).toUpperCase() + type.slice(1)}:</label>
      <button onChange={(e) => onChange(type, e.target.value)}>
        {options.map((option, index) => (
          <option key={index} value={option.toLowerCase()}>{option}</option>
        ))}
      </button>
    </div>
  );
};

export default Filter;
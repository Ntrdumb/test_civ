import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

export default function MultiSelect({ options, selectedOptions, onChange }) {
  const handleSelectChange = (selected) => {
    onChange(selected ? selected.map(option => option.value) : []);
  };

  const formattedOptions = options.map(option => ({
    value: option,
    label: option
  }));

  return (
    <Select
      components={animatedComponents}
      isMulti
      options={formattedOptions}
      value={formattedOptions.filter(option => selectedOptions.includes(option.value))}
      onChange={handleSelectChange}
      closeMenuOnSelect={false}
      placeholder="Select Projects"
    />
  );
}

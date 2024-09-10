// components/Checkbox.js
import React from 'react';

export default function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="form-checkbox"
      />
      <span>{label}</span>
    </label>
  );
}

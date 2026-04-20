"use client";

import { useMemo, useState } from "react";

type MultiSelectProps = {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
};

export function MultiSelect({ label, options, selected, onChange, placeholder = "Select options" }: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedLabel = useMemo(() => {
    if (!selected.length) {
      return placeholder;
    }

    return selected.join(", ");
  }, [placeholder, selected]);

  function toggleValue(value: string) {
    onChange(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
  }

  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <div className="multi-select">
        <button className="multi-select-trigger" type="button" onClick={() => setOpen((current) => !current)}>
          <span className="multi-select-value">{selectedLabel}</span>
          <strong className="multi-select-indicator">{open ? "−" : "+"}</strong>
        </button>
        {open ? (
          <div className="multi-select-menu">
            {options.map((option) => (
              <label className="multi-select-option" key={option}>
                <input type="checkbox" checked={selected.includes(option)} onChange={() => toggleValue(option)} />
                <span className="multi-select-option-label">{option}</span>
              </label>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

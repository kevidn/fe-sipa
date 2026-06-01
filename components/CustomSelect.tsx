"use client";

import { useState, useRef, useEffect } from 'react';

interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  className = "",
  placeholder = "Pilih opsi...",
  disabled = false
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cari label untuk value saat ini
  const selectedOption = options.find(opt => opt.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-4 py-3 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-left text-sm font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 transition-all ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        } ${className}`}
      >
        <span className="truncate">{displayValue}</span>
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200 max-h-60 overflow-y-auto">
          {options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-slate-400 font-medium text-center">
              Tidak ada pilihan
            </div>
          ) : (
            options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors ${
                  value === opt.value
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                {opt.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

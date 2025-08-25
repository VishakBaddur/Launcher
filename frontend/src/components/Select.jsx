import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Select = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  error,
  className = '',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div
        className={`
          relative w-full cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div
          className={`
            w-full px-3 py-2 text-left border rounded-md shadow-sm
            ${
              error
                ? 'border-red-300 text-red-900 placeholder-red-300'
                : 'border-gray-300'
            }
            ${disabled ? 'bg-gray-50' : 'bg-white'}
          `}
        >
          <span className="block truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg
              className={`h-5 w-5 text-gray-400 transform transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg"
            >
              <ul
                className="max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                tabIndex="-1"
                role="listbox"
              >
                {options.map((option) => (
                  <li
                    key={option.value}
                    className={`
                      cursor-pointer select-none relative py-2 pl-3 pr-9
                      ${
                        option.value === value
                          ? 'text-white bg-indigo-600'
                          : 'text-gray-900 hover:bg-indigo-50'
                      }
                    `}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    role="option"
                  >
                    <span className="block truncate">{option.label}</span>
                    {option.value === value && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-white">
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${props.id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Select; 
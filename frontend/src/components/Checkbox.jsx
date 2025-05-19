import React from 'react';
import { motion } from 'framer-motion';

const Checkbox = ({
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <label className={`inline-flex items-center ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          {...props}
        />
        <motion.div
          className={`
            w-5 h-5 border-2 rounded
            ${
              checked
                ? 'bg-indigo-600 border-indigo-600'
                : 'bg-white border-gray-300'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          whileTap={{ scale: 0.95 }}
        >
          {checked && (
            <motion.svg
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.2 }}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </motion.svg>
          )}
        </motion.div>
      </div>
      {label && (
        <span
          className={`ml-2 text-sm ${
            disabled ? 'text-gray-400' : 'text-gray-700'
          }`}
        >
          {label}
        </span>
      )}
    </label>
  );
};

export default Checkbox; 
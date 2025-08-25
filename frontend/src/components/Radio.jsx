import React from 'react';
import { motion } from 'framer-motion';

const Radio = ({
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
          type="radio"
          className="sr-only"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          {...props}
        />
        <motion.div
          className={`
            w-5 h-5 border-2 rounded-full
            ${
              checked
                ? 'border-indigo-600'
                : 'border-gray-300'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          whileTap={{ scale: 0.95 }}
        >
          {checked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-3 h-3 bg-indigo-600 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            />
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

export default Radio; 
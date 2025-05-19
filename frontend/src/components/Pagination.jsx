import React from 'react';
import { motion } from 'framer-motion';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  ...props
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      return pages;
    }

    if (currentPage <= 3) {
      return [...pages.slice(0, 4), '...', totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, '...', ...pages.slice(totalPages - 4)];
    }

    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages,
    ];
  };

  return (
    <nav
      className={`flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 ${className}`}
      {...props}
    >
      <div className="-mt-px flex w-0 flex-1">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
            inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium
            ${
              currentPage === 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }
          `}
        >
          <svg
            className="mr-3 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.707 14.707a1 1 0 010-1.414L10.586 10 7.707 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Previous
        </motion.button>
      </div>
      <div className="hidden md:-mt-px md:flex">
        {renderPageNumbers().map((page, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            className={`
              inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium
              ${
                page === currentPage
                  ? 'border-indigo-500 text-indigo-600'
                  : page === '...'
                  ? 'border-transparent text-gray-500'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }
            `}
            disabled={page === '...'}
          >
            {page}
          </motion.button>
        ))}
      </div>
      <div className="-mt-px flex w-0 flex-1 justify-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`
            inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium
            ${
              currentPage === totalPages
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }
          `}
        >
          Next
          <svg
            className="ml-3 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </motion.button>
      </div>
    </nav>
  );
};

export default Pagination; 
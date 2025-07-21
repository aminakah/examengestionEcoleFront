import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export const TableWithAdvancedScroll = ({ 
  columns, 
  data, 
  actions = [], 
  maxHeight = '600px',
  itemsPerPage = 20,
  showPagination = true,
  stickyHeader = true,
  stickyActions = true,
  className = '',
  emptyMessage = "Aucune donnée disponible"
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isScrollable, setIsScrollable] = useState(false);
  const tableContainerRef = useRef(null);

  // Calcul des données paginées
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = showPagination ? data.slice(startIndex, endIndex) : data;

  useEffect(() => {
    const checkScrollable = () => {
      if (tableContainerRef.current) {
        const { scrollHeight, clientHeight } = tableContainerRef.current;
        setIsScrollable(scrollHeight > clientHeight);
      }
    };

    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    return () => window.removeEventListener('resize', checkScrollable);
  }, [data]);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta);
         i <= Math.min(totalPages - 1, currentPage + delta);
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {/* En-tête avec informations */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {showPagination ? (
              <>
                Affichage de {startIndex + 1} à {Math.min(endIndex, data.length)} sur {data.length} éléments
              </>
            ) : (
              <>{data.length} éléments au total</>
            )}
          </div>
          {isScrollable && (
            <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              Faites défiler pour voir plus
            </div>
          )}
        </div>
      </div>

      {/* Conteneur du tableau avec scroll */}
      <div 
        ref={tableContainerRef}
        className="overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 table-container"
        style={{ maxHeight }}
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={`bg-gray-50 ${stickyHeader ? 'sticky top-0 z-20' : ''}`}>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    stickyHeader ? 'backdrop-blur-sm bg-gray-50/90' : ''
                  }`}
                  style={{ minWidth: column.minWidth || 'auto' }}
                >
                  {column.label}
                </th>
              ))}
              {actions.length > 0 && (
                <th 
                  className={`px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    stickyActions ? 'sticky right-0 z-10' : ''
                  } ${stickyHeader ? 'backdrop-blur-sm bg-gray-50/90' : 'bg-gray-50'}`}
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className="table-row-hover hover:bg-gray-50 transition-all duration-200"
              >
                {columns.map((column, colIndex) => (
                  <td 
                    key={colIndex} 
                    className="px-6 py-4 text-sm text-gray-900"
                    style={{ 
                      whiteSpace: column.wrap ? 'normal' : 'nowrap',
                      minWidth: column.minWidth || 'auto'
                    }}
                  >
                    <div className={column.wrap ? 'break-words' : 'truncate'}>
                      {column.render ? column.render(row[column.key], row, rowIndex) : row[column.key]}
                    </div>
                  </td>
                ))}
                {actions.length > 0 && (
                  <td 
                    className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${
                      stickyActions ? 'sticky right-0 z-10 bg-white' : ''
                    }`}
                  >
                    <div className="flex items-center justify-end space-x-2">
                      {actions.map((action, actionIndex) => (
                        <button
                          key={actionIndex}
                          onClick={() => action.onClick(row, rowIndex)}
                          className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                            action.variant === 'danger'
                              ? 'text-red-600 hover:bg-red-50 hover:text-red-700'
                              : action.variant === 'warning'
                              ? 'text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700'
                              : action.variant === 'success'
                              ? 'text-green-600 hover:bg-green-50 hover:text-green-700'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-700'
                          }`}
                          title={action.label}
                          disabled={action.disabled && action.disabled(row)}
                        >
                          <action.icon className="w-4 h-4" />
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Page {currentPage} sur {totalPages}
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Première page */}
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              {/* Page précédente */}
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Numéros de pages */}
              <div className="flex items-center space-x-1">
                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => page !== '...' && goToPage(page)}
                    disabled={page === '...'}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      page === currentPage
                        ? 'bg-blue-500 text-white'
                        : page === '...'
                        ? 'text-gray-400 cursor-default'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Page suivante */}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Dernière page */}
              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableWithAdvancedScroll;
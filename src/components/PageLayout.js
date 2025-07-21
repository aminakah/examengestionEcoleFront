import React from 'react';
import { ArrowLeft, Plus, Search, Filter, Download, Upload } from 'lucide-react';

const PageLayout = ({ 
  title, 
  subtitle,
  icon: Icon,
  children,
  actions = [],
  showBackButton = false,
  onBack,
  searchValue = '',
  onSearchChange,
  showSearch = true,
  className = ''
}) => {
  return (
    <div className={`min-h-screen my-10  bg-gradient-to-br from-gray-50 to-blue-50 ${className}`}>
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Title Section */}
            <div className="flex items-center space-x-4">
              {showBackButton && (
                <button
                  onClick={onBack}
                  className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              
              {Icon && (
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              )}
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                )}
              </div>
            </div>

            {/* Actions Section */}
            <div className="flex items-center space-x-3">
              {showSearch && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchValue}
                    onChange={onSearchChange}
                    className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
              
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 ${
                    action.variant === 'primary' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg' 
                      : action.variant === 'success'
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg'
                      : action.variant === 'danger'
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  {action.icon && <action.icon className="w-4 h-4" />}
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto  py-8">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
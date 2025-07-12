import React from 'react';
import { Bookmark, BarChart3, ChevronUp, ChevronDown } from 'lucide-react';
import { Property } from '../types';

interface PropertyTableProps {
  properties: Property[];
  bookmarkedProperties: Set<string>;
  comparisonList: Property[];
  onBookmark: (propertyId: string) => void;
  onCompare: (property: Property) => void;
  onRowClick?: (property: Property) => void;
}

export const PropertyTable: React.FC<PropertyTableProps> = ({
  properties,
  bookmarkedProperties,
  comparisonList,
  onBookmark,
  onCompare,
  onRowClick,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Property
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Bed/Bath
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                ROI
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Cash Flow
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Cap Rate
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
            {properties.map((property) => (
              <tr
                key={property.id}
                className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                onClick={() => onRowClick?.(property)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookmark(property.id);
                      }}
                      className={`p-1 rounded transition-colors ${
                        bookmarkedProperties.has(property.id)
                          ? 'text-yellow-500 hover:text-yellow-600'
                          : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCompare(property);
                      }}
                      className={`p-1 rounded transition-colors ${
                        comparisonList.some(p => p.id === property.id)
                          ? 'text-blue-500 hover:text-blue-600'
                          : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                      }`}
                    >
                      <BarChart3 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {property.address}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {formatCurrency(property.price)}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {property.bedrooms}bd / {property.bathrooms}ba
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200">
                    {property.propertyType}
                  </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {formatPercentage(property.roi)}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(property.cashflow)}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {formatPercentage(property.caprate)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
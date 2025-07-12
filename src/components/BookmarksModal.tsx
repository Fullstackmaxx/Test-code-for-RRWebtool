import React from 'react';
import { X, MapPin, Bed, Bath, TrendingUp, DollarSign } from 'lucide-react';
import { Property } from '../types';

interface BookmarksModalProps {
  isOpen: boolean;
  bookmarkedProperties: Property[];
  onClose: () => void;
  onRemoveBookmark: (propertyId: string) => void;
  onViewProperty: (property: Property) => void;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  isOpen,
  bookmarkedProperties,
  onClose,
  onRemoveBookmark,
  onViewProperty,
}) => {
  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-slate-800 shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Bookmarked Properties
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {bookmarkedProperties.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Bookmarked Properties
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Start bookmarking properties to keep track of your favorites
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookmarkedProperties.map((property) => (
                <div
                  key={property.id}
                  className="bg-gray-50 dark:bg-slate-700 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => onViewProperty(property)}
                >
                  {/* Property Image */}
                  <div className="h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg mb-4 relative overflow-hidden">
                    {property.imageUrl ? (
                      <img
                        src={property.imageUrl}
                        alt={property.address}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-white text-3xl opacity-50">🏠</div>
                      </div>
                    )}
                    
                    {/* Remove Bookmark Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveBookmark(property.id);
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Property Details */}
                  <div>
                    <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {formatCurrency(property.price)}
                    </div>

                    <div className="flex items-start space-x-2 mb-4">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {property.address}
                      </p>
                    </div>

                    {/* Property Features */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center space-x-2">
                        <Bed className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Bath className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    {/* Investment Metrics */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-2 bg-white dark:bg-slate-600 rounded-lg">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <TrendingUp className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">ROI</span>
                        </div>
                        <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                          {formatPercentage(property.roi)}
                        </div>
                      </div>
                      
                      <div className="text-center p-2 bg-white dark:bg-slate-600 rounded-lg">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <DollarSign className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">Cash Flow</span>
                        </div>
                        <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                          {formatCurrency(property.cashflow)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
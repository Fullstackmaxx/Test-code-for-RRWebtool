import React from 'react';
import { X, Bed, Bath, Square, Calendar, MapPin, TrendingUp, DollarSign } from 'lucide-react';
import { Property } from '../types';

interface ComparisonModalProps {
  isOpen: boolean;
  properties: Property[];
  onClose: () => void;
  onRemove: (propertyId: string) => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  properties,
  onClose,
  onRemove,
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

        <div className="inline-block w-full max-w-6xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-slate-800 shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Property Comparison
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {properties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No properties selected for comparison
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="bg-gray-50 dark:bg-slate-700 rounded-xl p-6 relative"
                >
                  <button
                    onClick={() => onRemove(property.id)}
                    className="absolute top-3 right-3 p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Property Image */}
                  <div className="h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg mb-4 flex items-center justify-center">
                    {property.imageUrl ? (
                      <img
                        src={property.imageUrl}
                        alt={property.address}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-white text-3xl opacity-50">🏠</div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {formatCurrency(property.price)}
                  </div>

                  {/* Address */}
                  <div className="flex items-start space-x-2 mb-4">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {property.address}
                    </p>
                  </div>

                  {/* Property Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bed className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Bedrooms</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {property.bedrooms}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bath className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Bathrooms</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {property.bathrooms}
                      </span>
                    </div>

                    {property.squareFootage && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Square className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Sq Ft</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {property.squareFootage.toLocaleString()}
                        </span>
                      </div>
                    )}

                    {property.yearBuilt && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Year Built</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {property.yearBuilt}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Type</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {property.propertyType}
                      </span>
                    </div>
                  </div>

                  {/* Investment Metrics */}
                  <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-slate-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">ROI</span>
                      </div>
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {formatPercentage(property.roi)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Cash Flow</span>
                      </div>
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(property.cashflow)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Cap Rate</span>
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {formatPercentage(property.caprate)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Gross Yield</span>
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {formatPercentage(property.grossYield)}
                      </span>
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
import React from 'react';
import { Bookmark, BarChart3, Bed, Bath, Square, Calendar, MapPin } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  isBookmarked: boolean;
  isInComparison: boolean;
  onBookmark: () => void;
  onCompare: () => void;
  onClick?: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isBookmarked,
  isInComparison,
  onBookmark,
  onCompare,
  onClick,
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
    <div 
      className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      {/* Property Image */}
      <div className="h-48 bg-gradient-to-br from-blue-500 to-cyan-500 relative">
        {property.imageUrl ? (
          <img
            src={property.imageUrl}
            alt={property.address}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white text-6xl opacity-50">🏠</div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookmark();
            }}
            className={`p-2 rounded-full backdrop-blur-sm transition-all ${
              isBookmarked
                ? 'bg-yellow-500 text-white'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Bookmark className="w-4 h-4" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCompare();
            }}
            className={`p-2 rounded-full backdrop-blur-sm transition-all ${
              isInComparison
                ? 'bg-blue-500 text-white'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
          </button>
        </div>

        {/* Property Type Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">
            {property.propertyType}
          </span>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-6">
        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(property.price)}
          </h3>
        </div>

        {/* Address */}
        <div className="flex items-start space-x-2 mb-4">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {property.address}
          </p>
        </div>

        {/* Property Features */}
        <div className="grid grid-cols-2 gap-4 mb-4">
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
          
          {property.squareFootage && (
            <div className="flex items-center space-x-2">
              <Square className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {property.squareFootage.toLocaleString()} sq ft
              </span>
            </div>
          )}
          
          {property.yearBuilt && (
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Built {property.yearBuilt}
              </span>
            </div>
          )}
        </div>

        {/* Investment Metrics */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600 dark:text-green-400">
              {formatPercentage(property.roi)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              ROI
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600 dark:text-green-400">
              {formatCurrency(property.cashflow)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Cash Flow
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600 dark:text-green-400">
              {formatPercentage(property.caprate)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Cap Rate
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
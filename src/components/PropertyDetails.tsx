import React from 'react';
import { X, MapPin, Bed, Bath, Square, Calendar, DollarSign, TrendingUp, Home, Calculator } from 'lucide-react';
import { Property } from '../types';

interface PropertyDetailsProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onBookmark: () => void;
  onCompare: () => void;
  isBookmarked: boolean;
  isInComparison: boolean;
}

export const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  property,
  isOpen,
  onClose,
  onBookmark,
  onCompare,
  isBookmarked,
  isInComparison,
}) => {
  if (!isOpen || !property) return null;

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

  const calculateMonthlyPayment = (price: number, downPayment: number = 0.2, interestRate: number = 0.065, years: number = 30) => {
    const principal = price * (1 - downPayment);
    const monthlyRate = interestRate / 12;
    const numPayments = years * 12;
    
    if (monthlyRate === 0) return principal / numPayments;
    
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
           (Math.pow(1 + monthlyRate, numPayments) - 1);
  };

  const monthlyPayment = calculateMonthlyPayment(property.price);
  const downPayment = property.price * 0.2;
  const pricePerSqFt = property.squareFootage ? property.price / property.squareFootage : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-slate-800 shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Property Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Property Image and Basic Info */}
            <div>
              {/* Property Image */}
              <div className="h-64 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl mb-6 relative overflow-hidden">
                {property.imageUrl ? (
                  <img
                    src={property.imageUrl}
                    alt={property.address}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home className="w-16 h-16 text-white opacity-50" />
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={onBookmark}
                    className={`p-3 rounded-full backdrop-blur-sm transition-all ${
                      isBookmarked
                        ? 'bg-yellow-500 text-white'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <span className="text-lg">⭐</span>
                  </button>
                  
                  <button
                    onClick={onCompare}
                    className={`p-3 rounded-full backdrop-blur-sm transition-all ${
                      isInComparison
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <Calculator className="w-5 h-5" />
                  </button>
                </div>

                {/* Property Type Badge */}
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full">
                    {property.propertyType}
                  </span>
                </div>
              </div>

              {/* Price and Address */}
              <div className="mb-6">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {formatCurrency(property.price)}
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-600 dark:text-gray-400">
                    {property.address}
                    {property.city && property.state && (
                      <span className="block text-sm">
                        {property.city}, {property.state} {property.zipCode}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Property Features */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <Bed className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{property.bedrooms}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Bedrooms</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <Bath className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{property.bathrooms}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Bathrooms</div>
                  </div>
                </div>
                
                {property.squareFootage && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <Square className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {property.squareFootage.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Sq Ft</div>
                    </div>
                  </div>
                )}
                
                {property.yearBuilt && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{property.yearBuilt}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Year Built</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Investment Analysis */}
            <div>
              {/* Investment Metrics */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Investment Analysis
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800 dark:text-green-400">ROI</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {formatPercentage(property.roi)}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-400">Cash Flow</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(property.cashflow)}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-sm font-medium text-purple-800 dark:text-purple-400 mb-2">Cap Rate</div>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {formatPercentage(property.caprate)}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-sm font-medium text-orange-800 dark:text-orange-400 mb-2">Gross Yield</div>
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {formatPercentage(property.grossYield)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Financial Breakdown
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400">Purchase Price</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(property.price)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400">Down Payment (20%)</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(downPayment)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400">Monthly Payment</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(monthlyPayment)}
                    </span>
                  </div>
                  
                  {property.monthlyRent && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <span className="text-gray-600 dark:text-gray-400">Monthly Rent</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(property.monthlyRent)}
                      </span>
                    </div>
                  )}
                  
                  {pricePerSqFt > 0 && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <span className="text-gray-600 dark:text-gray-400">Price per Sq Ft</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(pricePerSqFt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {property.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Description
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {property.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
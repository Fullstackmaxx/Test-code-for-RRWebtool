import React from 'react';
import { TrendingUp, DollarSign, Home, BarChart3 } from 'lucide-react';
import { Property } from '../types';

interface DashboardProps {
  properties: Property[];
}

export const Dashboard: React.FC<DashboardProps> = ({ properties }) => {
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

  // Calculate portfolio metrics
  const totalValue = properties.reduce((sum, property) => sum + property.price, 0);
  const averageROI = properties.length > 0 
    ? properties.reduce((sum, property) => sum + property.roi, 0) / properties.length 
    : 0;
  const totalCashFlow = properties.reduce((sum, property) => sum + property.cashflow, 0);
  const averageCapRate = properties.length > 0
    ? properties.reduce((sum, property) => sum + property.caprate, 0) / properties.length
    : 0;

  // Property type distribution
  const propertyTypes = properties.reduce((acc, property) => {
    acc[property.propertyType] = (acc[property.propertyType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Top performing properties
  const topROIProperties = [...properties]
    .sort((a, b) => b.roi - a.roi)
    .slice(0, 3);

  const topCashFlowProperties = [...properties]
    .sort((a, b) => b.cashflow - a.cashflow)
    .slice(0, 3);

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
          <BarChart3 className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No Properties to Analyze
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Upload property data to see your portfolio dashboard
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Portfolio Dashboard
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Home className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Properties</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{properties.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Portfolio Value</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalValue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Average ROI</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatPercentage(averageROI)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Cash Flow</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalCashFlow)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Type Distribution */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Property Type Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(propertyTypes).map(([type, count]) => {
              const percentage = (count / properties.length) * 100;
              return (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{type}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                      {count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Key Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Average Cap Rate</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatPercentage(averageCapRate)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Average Property Value</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(totalValue / properties.length)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Monthly Income</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(properties.reduce((sum, p) => sum + (p.monthlyRent || 0), 0))}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top ROI Properties */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top ROI Properties
          </h3>
          <div className="space-y-3">
            {topROIProperties.map((property, index) => (
              <div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {property.address.split(',')[0]}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatCurrency(property.price)}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-green-600 dark:text-green-400">
                  {formatPercentage(property.roi)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Cash Flow Properties */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Cash Flow Properties
          </h3>
          <div className="space-y-3">
            {topCashFlowProperties.map((property, index) => (
              <div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {property.address.split(',')[0]}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatCurrency(property.price)}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(property.cashflow)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
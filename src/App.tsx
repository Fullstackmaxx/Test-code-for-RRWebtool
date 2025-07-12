import React, { useState, useEffect, useCallback } from 'react';
import { Upload, Moon, Sun, Bookmark, Grid, List, Download, BarChart3, Filter, Search, X, PieChart } from 'lucide-react';
import { PropertyCard } from './components/PropertyCard';
import { PropertyTable } from './components/PropertyTable';
import { ComparisonModal } from './components/ComparisonModal';
import { FilterSidebar } from './components/FilterSidebar';
import { PropertyDetails } from './components/PropertyDetails';
import { Dashboard } from './components/Dashboard';
import { BookmarksModal } from './components/BookmarksModal';
import { useTheme } from './hooks/useTheme';
import { useProperties } from './hooks/useProperties';
import { useFilters } from './hooks/useFilters';
import { Property, ViewMode, SortOption } from './types';

function App() {
  const { theme, toggleTheme } = useTheme();
  const { 
    properties, 
    filteredProperties, 
    loading, 
    error, 
    uploadFile, 
    generateSampleData,
    sortProperties 
  } = useProperties();
  
  const { filters, updateFilter, applyFilters } = useFilters();
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('price');
  const [comparisonList, setComparisonList] = useState<Property[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [bookmarkedProperties, setBookmarkedProperties] = useState<Set<string>>(new Set());
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [currentTab, setCurrentTab] = useState<'properties' | 'dashboard'>('properties');

  // Apply filters whenever filters or properties change
  useEffect(() => {
    const filtered = applyFilters(properties, filters);
    // This would be handled by the useProperties hook in a real implementation
  }, [properties, filters, applyFilters]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  }, [uploadFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      uploadFile(file);
    }
  }, [uploadFile]);

  const toggleBookmark = useCallback((propertyId: string) => {
    setBookmarkedProperties(prev => {
      const newSet = new Set(prev);
      if (newSet.has(propertyId)) {
        newSet.delete(propertyId);
      } else {
        newSet.add(propertyId);
      }
      return newSet;
    });
  }, []);

  const toggleComparison = useCallback((property: Property) => {
    setComparisonList(prev => {
      const exists = prev.find(p => p.id === property.id);
      if (exists) {
        return prev.filter(p => p.id !== property.id);
      } else if (prev.length < 4) {
        return [...prev, property];
      }
      return prev;
    });
  }, []);

  const handleSort = useCallback((option: SortOption) => {
    setSortBy(option);
    sortProperties(option);
  }, [sortProperties]);

  const exportToCSV = useCallback(() => {
    const csvContent = [
      Object.keys(filteredProperties[0] || {}).join(','),
      ...filteredProperties.map(property => 
        Object.values(property).map(value => 
          typeof value === 'string' && value.includes(',') ? `"${value}"` : value
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'properties.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredProperties]);

  const handlePropertyClick = useCallback((property: Property) => {
    setSelectedProperty(property);
    setShowPropertyDetails(true);
  }, []);

  const getBookmarkedProperties = useCallback(() => {
    return properties.filter(property => bookmarkedProperties.has(property.id));
  }, [properties, bookmarkedProperties]);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' ? 'dark bg-slate-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🏠</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Real Estate Analyzer
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <button 
                onClick={() => setShowBookmarks(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Bookmark className="w-4 h-4" />
                <span>Bookmarks ({bookmarkedProperties.size})</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* File Upload */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                <div
                  className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('fileInput')?.click()}
                >
                  <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Upload Property Data
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Drag & drop your CSV file or click to browse
                  </p>
                  <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    accept=".csv"
                    onChange={handleFileUpload}
                  />
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                    Choose File
                  </button>
                </div>
                
                {properties.length === 0 && (
                  <button
                    onClick={generateSampleData}
                    className="w-full mt-4 px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    Generate Sample Data
                  </button>
                )}
              </div>

              {/* Filters */}
              <FilterSidebar filters={filters} onFilterChange={updateFilter} />

              {/* Export */}
              {filteredProperties.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Export</h3>
                  <div className="space-y-2">
                    <button
                      onClick={exportToCSV}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
              <button
                onClick={() => setCurrentTab('properties')}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  currentTab === 'properties'
                    ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
                <span>Properties</span>
              </button>
              <button
                onClick={() => setCurrentTab('dashboard')}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  currentTab === 'dashboard'
                    ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <PieChart className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">Loading properties...</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            {!loading && !error && properties.length === 0 && currentTab === 'properties' && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Welcome to Real Estate Analyzer
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Upload a CSV file or generate sample data to start analyzing properties
                </p>
              </div>
            )}

            {!loading && !error && currentTab === 'dashboard' && (
              <Dashboard properties={properties} />
            )}

            {!loading && !error && filteredProperties.length > 0 && currentTab === 'properties' && (
              <>
                {/* Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {filteredProperties.length} properties
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <select
                      value={sortBy}
                      onChange={(e) => handleSort(e.target.value as SortOption)}
                      className="px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="price">Sort by Price</option>
                      <option value="roi">Sort by ROI</option>
                      <option value="cashflow">Sort by Cash Flow</option>
                      <option value="caprate">Sort by Cap Rate</option>
                      <option value="bedrooms">Sort by Bedrooms</option>
                      <option value="bathrooms">Sort by Bathrooms</option>
                    </select>
                    
                    <div className="flex rounded-lg border border-gray-300 dark:border-slate-600 overflow-hidden">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`px-3 py-2 text-sm transition-colors ${
                          viewMode === 'grid'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        <Grid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('table')}
                        className={`px-3 py-2 text-sm transition-colors ${
                          viewMode === 'table'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Properties Display */}
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProperties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        isBookmarked={bookmarkedProperties.has(property.id)}
                        isInComparison={comparisonList.some(p => p.id === property.id)}
                        onBookmark={() => toggleBookmark(property.id)}
                        onCompare={() => toggleComparison(property)}
                        onClick={() => handlePropertyClick(property)}
                      />
                    ))}
                  </div>
                ) : (
                  <PropertyTable
                    properties={filteredProperties}
                    bookmarkedProperties={bookmarkedProperties}
                    comparisonList={comparisonList}
                    onBookmark={toggleBookmark}
                    onCompare={toggleComparison}
                    onRowClick={handlePropertyClick}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Comparison Toggle */}
      {comparisonList.length > 0 && (
        <button
          onClick={() => setShowComparison(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 z-40"
        >
          <BarChart3 className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {comparisonList.length}
          </span>
        </button>
      )}

      {/* Comparison Modal */}
      <ComparisonModal
        isOpen={showComparison}
        properties={comparisonList}
        onClose={() => setShowComparison(false)}
        onRemove={(propertyId) => {
          setComparisonList(prev => prev.filter(p => p.id !== propertyId));
        }}
      />

      {/* Property Details Modal */}
      <PropertyDetails
        property={selectedProperty}
        isOpen={showPropertyDetails}
        onClose={() => setShowPropertyDetails(false)}
        onBookmark={() => selectedProperty && toggleBookmark(selectedProperty.id)}
        onCompare={() => selectedProperty && toggleComparison(selectedProperty)}
        isBookmarked={selectedProperty ? bookmarkedProperties.has(selectedProperty.id) : false}
        isInComparison={selectedProperty ? comparisonList.some(p => p.id === selectedProperty.id) : false}
      />

      {/* Bookmarks Modal */}
      <BookmarksModal
        isOpen={showBookmarks}
        bookmarkedProperties={getBookmarkedProperties()}
        onClose={() => setShowBookmarks(false)}
        onRemoveBookmark={toggleBookmark}
        onViewProperty={handlePropertyClick}
      />
    </div>
  );
}

export default App;
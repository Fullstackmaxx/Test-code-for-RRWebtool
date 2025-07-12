import { useState, useCallback } from 'react';
import { Filters, Property } from '../types';

const initialFilters: Filters = {
  search: '',
  propertyType: '',
  minPrice: null,
  maxPrice: null,
  bedrooms: null,
  bathrooms: null,
  minROI: null,
  minCashFlow: null,
};

export const useFilters = () => {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const updateFilter = useCallback((key: keyof Filters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const applyFilters = useCallback((properties: Property[], currentFilters: Filters): Property[] => {
    return properties.filter(property => {
      // Search filter
      if (currentFilters.search) {
        const searchTerm = currentFilters.search.toLowerCase();
        const searchableText = `${property.address} ${property.city || ''} ${property.state || ''} ${property.zipCode || ''}`.toLowerCase();
        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }

      // Property type filter
      if (currentFilters.propertyType && property.propertyType !== currentFilters.propertyType) {
        return false;
      }

      // Price range filter
      if (currentFilters.minPrice && property.price < currentFilters.minPrice) {
        return false;
      }
      if (currentFilters.maxPrice && property.price > currentFilters.maxPrice) {
        return false;
      }

      // Bedrooms filter
      if (currentFilters.bedrooms && property.bedrooms < currentFilters.bedrooms) {
        return false;
      }

      // Bathrooms filter
      if (currentFilters.bathrooms && property.bathrooms < currentFilters.bathrooms) {
        return false;
      }

      // ROI filter
      if (currentFilters.minROI && property.roi < currentFilters.minROI) {
        return false;
      }

      // Cash flow filter
      if (currentFilters.minCashFlow && property.cashflow < currentFilters.minCashFlow) {
        return false;
      }

      return true;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  return {
    filters,
    updateFilter,
    applyFilters,
    resetFilters,
  };
};
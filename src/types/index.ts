export interface Property {
  id: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  squareFootage?: number;
  yearBuilt?: number;
  lotSize?: number;
  monthlyRent?: number;
  roi: number;
  cashflow: number;
  caprate: number;
  grossYield: number;
  city?: string;
  state?: string;
  zipCode?: string;
  description?: string;
  imageUrl?: string;
}

export interface Filters {
  search: string;
  propertyType: string;
  minPrice: number | null;
  maxPrice: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  minROI: number | null;
  minCashFlow: number | null;
}

export type ViewMode = 'grid' | 'table';

export type SortOption = 'price' | 'roi' | 'cashflow' | 'caprate' | 'bedrooms' | 'bathrooms';

export type Theme = 'light' | 'dark';
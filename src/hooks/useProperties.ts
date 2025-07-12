import { useState, useCallback } from 'react';
import { Property, SortOption } from '../types';

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSampleData = useCallback(() => {
    const propertyTypes = ['Single-Family', 'Condo', 'Multi-Family', 'Townhouse', 'Vacant Land'];
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'];
    const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'TX', 'CA'];
    
    const sampleProperties: Property[] = Array.from({ length: 50 }, (_, i) => {
      const price = Math.floor(Math.random() * 800000) + 200000;
      const monthlyRent = Math.floor(price * 0.008 + Math.random() * 500);
      const bedrooms = Math.floor(Math.random() * 5) + 1;
      const bathrooms = Math.floor(Math.random() * 3) + 1;
      const squareFootage = Math.floor(Math.random() * 2000) + 800;
      const yearBuilt = Math.floor(Math.random() * 50) + 1970;
      const cityIndex = Math.floor(Math.random() * cities.length);
      
      // Calculate investment metrics
      const annualRent = monthlyRent * 12;
      const roi = ((annualRent - (price * 0.02)) / price) * 100; // Simplified ROI calculation
      const cashflow = monthlyRent - (price * 0.004); // Simplified cash flow
      const caprate = (annualRent / price) * 100;
      const grossYield = (annualRent / price) * 100;
      
      const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
      
      return {
        id: `property-${i + 1}`,
        address: `${Math.floor(Math.random() * 9999) + 1} ${['Main', 'Oak', 'Pine', 'Maple', 'Cedar', 'Elm'][Math.floor(Math.random() * 6)]} St`,
        city: cities[cityIndex],
        state: states[cityIndex],
        zipCode: `${Math.floor(Math.random() * 90000) + 10000}`,
        price,
        bedrooms,
        bathrooms,
        propertyType,
        squareFootage,
        yearBuilt,
        monthlyRent,
        roi: Math.max(roi, 1),
        cashflow: Math.max(cashflow, 50),
        caprate: Math.max(caprate, 2),
        grossYield: Math.max(grossYield, 3),
        description: `Beautiful ${propertyType.toLowerCase()} in a prime location. This property offers excellent investment potential with strong rental demand in the area. Features include modern amenities and convenient access to local attractions.`,
        imageUrl: `https://images.pexels.com/photos/${[
          '106399', '259588', '280222', '323780', '323776', '463734',
          '534151', '545034', '584399', '681331', '731082', '813692'
        ][Math.floor(Math.random() * 12)]}/pexels-photo-${[
          '106399', '259588', '280222', '323780', '323776', '463734',
          '534151', '545034', '584399', '681331', '731082', '813692'
        ][Math.floor(Math.random() * 12)]}.jpeg?auto=compress&cs=tinysrgb&w=400`,
      };
    });

    setProperties(sampleProperties);
    setFilteredProperties(sampleProperties);
  }, []);

  const uploadFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      const parsedProperties: Property[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
          const property: any = {};
          
          headers.forEach((header, index) => {
            property[header] = values[index] || '';
          });
          
          // Ensure required fields and calculate metrics
          const price = Number(property.price || property.Price) || Math.floor(Math.random() * 500000) + 100000;
          const monthlyRent = Number(property.monthlyRent || property.MonthlyRent) || Math.floor(price * 0.008);
          const bedrooms = Number(property.bedrooms || property.Bedrooms) || Math.floor(Math.random() * 5) + 1;
          const bathrooms = Number(property.bathrooms || property.Bathrooms) || Math.floor(Math.random() * 3) + 1;
          
          const annualRent = monthlyRent * 12;
          const roi = ((annualRent - (price * 0.02)) / price) * 100;
          const cashflow = monthlyRent - (price * 0.004);
          const caprate = (annualRent / price) * 100;
          const grossYield = (annualRent / price) * 100;
          
          parsedProperties.push({
            id: `property-${i}`,
            address: property.address || property.Address || `${Math.floor(Math.random() * 9999) + 1} Sample St`,
            price,
            bedrooms,
            bathrooms,
            propertyType: property.propertyType || property.PropertyType || 'Single-Family',
            squareFootage: Number(property.squareFootage || property.SquareFootage) || undefined,
            yearBuilt: Number(property.yearBuilt || property.YearBuilt) || undefined,
            monthlyRent,
            roi: Math.max(roi, 1),
            cashflow: Math.max(cashflow, 50),
            caprate: Math.max(caprate, 2),
            grossYield: Math.max(grossYield, 3),
          });
        }
      }
      
      if (parsedProperties.length === 0) {
        generateSampleData();
      } else {
        setProperties(parsedProperties);
        setFilteredProperties(parsedProperties);
      }
    } catch (err) {
      setError('Error parsing CSV file. Please check the format and try again.');
      console.error('CSV parsing error:', err);
    } finally {
      setLoading(false);
    }
  }, [generateSampleData]);

  const sortProperties = useCallback((sortBy: SortOption) => {
    setFilteredProperties(prev => {
      const sorted = [...prev].sort((a, b) => {
        switch (sortBy) {
          case 'price':
            return b.price - a.price;
          case 'roi':
            return b.roi - a.roi;
          case 'cashflow':
            return b.cashflow - a.cashflow;
          case 'caprate':
            return b.caprate - a.caprate;
          case 'bedrooms':
            return b.bedrooms - a.bedrooms;
          case 'bathrooms':
            return b.bathrooms - a.bathrooms;
          default:
            return 0;
        }
      });
      return sorted;
    });
  }, []);

  return {
    properties,
    filteredProperties,
    loading,
    error,
    uploadFile,
    generateSampleData,
    sortProperties,
    setFilteredProperties,
  };
};
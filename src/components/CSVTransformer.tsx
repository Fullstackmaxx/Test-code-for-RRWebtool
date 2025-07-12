import React, { useState, useEffect } from 'react';
import { Upload, Download, FileText, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import Papa from 'papaparse';

const CSVTransformer = () => {
  const [file, setFile] = useState(null);
  const [originalData, setOriginalData] = useState([]);
  const [transformedData, setTransformedData] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [summary, setSummary] = useState('');
  const [errors, setErrors] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Target columns in exact order
  const targetColumns = [
    'address', 'city', 'state', 'zip_code', 'price', 'bedrooms', 'bathrooms', 
    'square_feet', 'year_built', 'property_type', 'monthly_rent', 'yearly_taxes', 
    'yearly_insurance', 'maintenance_percentage', 'vacancy_rate'
  ];

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile && uploadedFile.type === 'text/csv') {
      setFile(uploadedFile);
      // Reset previous data
      setOriginalData([]);
      setTransformedData([]);
      setSummary('');
      setErrors([]);
      setUploadProgress(0);
      
      parseCSV(uploadedFile);
    } else {
      alert('Please upload a valid CSV file');
    }
  };

  const parseCSV = (file) => {
    setProcessing(true);
    setUploadProgress(25);
    
    Papa.parse(file, {
      complete: (results) => {
        setUploadProgress(50);
        if (results.data && results.data.length > 0) {
          setOriginalData(results.data);
        } else {
          setErrors(['No data found in the CSV file']);
          setProcessing(false);
        }
      },
      error: (error) => {
        setErrors([`CSV parsing error: ${error.message}`]);
        setProcessing(false);
      },
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      delimitersToGuess: [',', '\t', '|', ';']
    });
  };

  // Automatically transform data when originalData changes
  useEffect(() => {
    if (originalData.length > 0 && processing) {
      // Small delay to show progress
      const timer = setTimeout(() => {
        transformData();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [originalData, processing]);

  const findBestMatch = (headers, possibleNames) => {
    const headerLower = headers.map(h => h.toLowerCase().trim());
    for (const name of possibleNames) {
      const match = headerLower.find(h => h.includes(name.toLowerCase()));
      if (match) {
        return headers[headerLower.indexOf(match)];
      }
    }
    return null;
  };

  const estimatePrice = (row, headers) => {
    const priceColumns = ['last_sale_price', 'sale_price', 'est_equity', 'total_assessed_value', 'assessed_value', 'market_value'];
    for (const col of priceColumns) {
      const matchedCol = findBestMatch(headers, [col]);
      if (matchedCol && row[matchedCol] && !isNaN(row[matchedCol])) {
        return {
          value: parseFloat(row[matchedCol]),
          source: matchedCol
        };
      }
    }
    return { value: 200000, source: 'default' }; // Default fallback
  };

  const estimateRent = (price, propertyType, location) => {
    let rentPercentage = 0.008; // 0.8% base
    if (propertyType && propertyType.toLowerCase().includes('multi')) {
      rentPercentage = 0.01;
    } else if (propertyType && propertyType.toLowerCase().includes('condo')) {
      rentPercentage = 0.007;
    }
    return Math.round(price * rentPercentage);
  };

  const determinePropertyType = (row, headers) => {
    const typeColumns = ['property_type', 'property_description', 'type', 'description'];
    for (const col of typeColumns) {
      const matchedCol = findBestMatch(headers, [col]);
      if (matchedCol && row[matchedCol]) {
        const value = row[matchedCol].toString().toLowerCase();
        if (value.includes('single') || value.includes('detached')) return 'Single Family';
        if (value.includes('multi') || value.includes('duplex')) return 'Multi-family';
        if (value.includes('condo') || value.includes('townhouse')) return 'Condo';
        if (value.includes('apartment')) return 'Apartment';
      }
    }
    return 'Single Family'; // Default
  };

  const determineVacancyRate = (propertyType, city) => {
    const type = propertyType.toLowerCase();
    if (type.includes('multi')) return 0.08; // 8% for multi-family
    if (type.includes('single')) return 0.05; // 5% for single family
    return 0.06; // 6% default
  };

  const transformData = () => {
    setUploadProgress(75);
    
    const headers = Object.keys(originalData[0] || {});
    const transformed = [];
    const processingErrors = [];
    const summaryDetails = [];

    // Column mapping
    const columnMap = {
      address: findBestMatch(headers, ['address', 'property_address', 'street_address']),
      city: findBestMatch(headers, ['city', 'municipality']),
      state: findBestMatch(headers, ['state', 'province']),
      zip_code: findBestMatch(headers, ['zip', 'zipcode', 'postal_code', 'zip_code']),
      bedrooms: findBestMatch(headers, ['bedrooms', 'bedroom_count', 'beds']),
      bathrooms: findBestMatch(headers, ['bathrooms', 'bathroom_count', 'baths']),
      square_feet: findBestMatch(headers, ['living_sqft', 'sqft', 'square_feet', 'total_sqft']),
      year_built: findBestMatch(headers, ['built_year', 'year_built', 'construction_year']),
      yearly_taxes: findBestMatch(headers, ['tax_amount', 'taxes', 'property_tax', 'annual_tax'])
    };

    summaryDetails.push(`Column Mappings:`);
    Object.entries(columnMap).forEach(([target, source]) => {
      summaryDetails.push(`  ${target}: ${source || 'NOT FOUND'}`);
    });

    originalData.forEach((row, index) => {
      try {
        if (!row[columnMap.address] || !row[columnMap.city] || !row[columnMap.state]) {
          processingErrors.push(`Row ${index + 1}: Missing critical address information`);
          return;
        }

        const priceEstimate = estimatePrice(row, headers);
        const propertyType = determinePropertyType(row, headers);
        const monthlyRent = estimateRent(priceEstimate.value, propertyType, row[columnMap.city]);
        const vacancyRate = determineVacancyRate(propertyType, row[columnMap.city]);

        const transformedRow = {
          address: row[columnMap.address] || '',
          city: row[columnMap.city] || '',
          state: row[columnMap.state] || '',
          zip_code: row[columnMap.zip_code] || '',
          price: priceEstimate.value,
          bedrooms: row[columnMap.bedrooms] || 3,
          bathrooms: row[columnMap.bathrooms] || 2,
          square_feet: row[columnMap.square_feet] || 1500,
          year_built: row[columnMap.year_built] || 1980,
          property_type: propertyType,
          monthly_rent: monthlyRent,
          yearly_taxes: row[columnMap.yearly_taxes] || Math.round(priceEstimate.value * 0.012),
          yearly_insurance: Math.round(priceEstimate.value * 0.005),
          maintenance_percentage: Math.round(priceEstimate.value * 0.01),
          vacancy_rate: vacancyRate
        };

        transformed.push(transformedRow);

        if (index < 3) {
          summaryDetails.push(`\nRow ${index + 1} Processing:`);
          summaryDetails.push(`  Price: $${priceEstimate.value} (from ${priceEstimate.source})`);
          summaryDetails.push(`  Property Type: ${propertyType}`);
          summaryDetails.push(`  Monthly Rent: $${monthlyRent} (${((monthlyRent / priceEstimate.value) * 100).toFixed(2)}% of price)`);
          summaryDetails.push(`  Vacancy Rate: ${(vacancyRate * 100).toFixed(1)}%`);
        }
      } catch (error) {
        processingErrors.push(`Row ${index + 1}: ${error.message}`);
      }
    });

    setTransformedData(transformed);
    setErrors(processingErrors);

    const fullSummary = `
TRANSFORMATION SUMMARY
=====================

Original CSV: ${originalData.length} rows, ${headers.length} columns
Transformed CSV: ${transformed.length} rows, ${targetColumns.length} columns
Errors: ${processingErrors.length}

${summaryDetails.join('\n')}

ESTIMATION LOGIC APPLIED:
- Monthly Rent: 0.8% of price (adjusted by property type)
- Yearly Taxes: 1.2% of price if not available
- Yearly Insurance: 0.5% of price
- Maintenance: 1% of price annually
- Vacancy Rate: 5% single family, 8% multi-family
- Default Bedrooms: 3, Bathrooms: 2, Square Feet: 1500

ERRORS ENCOUNTERED:
${processingErrors.join('\n')}
    `;

    setSummary(fullSummary);
    setUploadProgress(100);
    
    // Complete processing after a short delay
    setTimeout(() => {
      setProcessing(false);
    }, 500);
  };

  const downloadCSV = () => {
    const csv = Papa.unparse(transformedData, {
      columns: targetColumns,
      header: true
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'transformed_real_estate_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetTransformer = () => {
    setFile(null);
    setOriginalData([]);
    setTransformedData([]);
    setProcessing(false);
    setSummary('');
    setErrors([]);
    setUploadProgress(0);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Real Estate CSV Transformer</h1>
        <p className="text-gray-600">Transform complex real estate CSV files into a standardized 15-column format automatically</p>
      </div>

      {/* File Upload */}
      <div className={`bg-gray-50 border-2 border-dashed rounded-lg p-8 mb-6 transition-all ${
        processing ? 'border-blue-300 bg-blue-50' : 'border-gray-300'
      }`}>
        <div className="text-center">
          {processing ? (
            <div className="space-y-4">
              <Loader className="mx-auto h-12 w-12 text-blue-500 animate-spin" />
              <div className="space-y-2">
                <p className="text-blue-700 font-medium">Processing your CSV file...</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{uploadProgress}% complete</p>
              </div>
            </div>
          ) : (
            <>
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="flex justify-center gap-4">
                <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  Choose CSV File
                </label>
                {transformedData.length > 0 && (
                  <button
                    onClick={resetTransformer}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    Upload New File
                  </button>
                )}
              </div>
              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {file.name}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Results - Only show when transformation is complete */}
      {!processing && transformedData.length > 0 && (
        <div className="space-y-6">
          {/* Success Message & Download Button */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800">Transformation Complete!</h3>
                  <p className="text-sm text-green-700">{transformedData.length} rows successfully processed</p>
                </div>
              </div>
              <button
                onClick={downloadCSV}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Download className="h-4 w-4" />
                Download Transformed CSV
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Preview (First 5 rows)
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    {targetColumns.map(col => (
                      <th key={col} className="text-left p-2 font-medium bg-gray-100">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transformedData.slice(0, 5).map((row, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      {targetColumns.map(col => (
                        <td key={col} className="p-2 border-r border-gray-200">
                          {typeof row[col] === 'number' ? row[col].toLocaleString() : row[col]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          {summary && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Processing Summary</h3>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto bg-white p-3 rounded border">
                {summary}
              </pre>
            </div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                Processing Errors ({errors.length})
              </h3>
              <div className="text-sm text-red-600 space-y-1 bg-white p-3 rounded border max-h-40 overflow-y-auto">
                {errors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold mb-3">How It Works</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
          <li>Upload your complex real estate CSV file using the file picker above</li>
          <li>The file will be automatically parsed and transformed in real-time</li>
          <li>Review the preview and summary to ensure the transformation is correct</li>
          <li>Download the transformed CSV file for use in your real estate application</li>
        </ol>
        
        <h4 className="font-semibold mt-4 mb-2">Target Format (15 columns):</h4>
        <div className="text-sm text-gray-600 grid grid-cols-3 gap-2">
          {targetColumns.map(col => (
            <div key={col} className="bg-white px-2 py-1 rounded border">{col}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CSVTransformer;
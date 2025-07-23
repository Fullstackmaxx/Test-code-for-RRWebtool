import { useState, useCallback, useEffect } from 'react';
import { Property, SortOption } from '../types';
import { supabase } from '../supabaseClient';
import { PostgrestError } from '@supabase/supabase-js';


export const useProperties = () => {
  const [properties, setProperties]               = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading]                     = useState(false);
  const [error, setError]                         = useState<string | null>(null);

  /* ------------- 1. READ from Supabase ----------------- */
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('rerich')
      .select('*')

      console.log('rerich query ?', { data, error });

    if (error) {
      setError(error.message);
    } else if (data) {
      // Map DB rows ? Property type expected in UI.
      const mapped: Property[] = data.map((row) => {
  /* ---------- basic conversions ---------- */
  // 1. choose a “price” we can always fall back to
  const price =
    Number(row.last_sale_price)            ||   // best
    Number(row.total_assessed_value)       ||   // 2nd best
    Number(row.est_equity)                 ||   // 3rd best
    0;

  // 2. bedroom / bath counts
  const bedrooms   = row.bedroom_count  != null ? Number(row.bedroom_count)  : null;
  const bathrooms  = row.bathroom_count != null ? Number(row.bathroom_count) : null;

  // 3. living area, lot size, year built …
  const sqft       = row.living_sqft    != null ? Number(row.living_sqft)    : null;
  const lotSqft    = row.lot_size_sqft  != null ? Number(row.lot_size_sqft)  : null;
  const yearBuilt  = row.built_year     != null ? Number(row.built_year)     : null;

  // 4. client-side rent model (use 0 if you have none for now)
  const monthlyRent = 0;
  const annualRent  = monthlyRent * 12;

  /* ---------- derived metrics ---------- */
  const roi       = price ? ((annualRent - price * 0.02) / price) * 100 : 0;
  const cashflow  = price ? monthlyRent - price * 0.004                : 0;
  const caprate   = price ? (annualRent / price) * 100                 : 0;
  const grossYield= caprate;   // same formula – keep both for UI filters

  /* ---------- assemble the Property object ---------- */
  return {
    id:           row.full_address,                            // surrogate key
    address:      row.full_address,
    city:         row.city,
    state:        row.state,
    zipCode:      row.zip != null ? String(row.zip) : null,
    imageUrl:     row.image_url,
    description:  row.overall_report,

    price,
    bedrooms,
    bathrooms,
    squareFootage: sqft,
    lotSizeSqft:   lotSqft,
    yearBuilt,

    monthlyRent,
    roi:       Number(roi.toFixed(2)),
    cashflow:  Number(cashflow.toFixed(0)),
    caprate:   Number(caprate.toFixed(2)),
    grossYield:Number(grossYield.toFixed(2)),

    distressScore: row.distress_score != null ? Number(row.distress_score) : null,
    leadScore:     row.lead_score     != null ? Number(row.lead_score)     : null,
  };
});

      setProperties(mapped);
      setFilteredProperties(mapped);
    }

    setLoading(false);
  }, []);

  /* Fetch once on mount */
  useEffect(() => {
    fetchProperties();

    // (Optional) realtime subscription so table edits show up instantly
    const channel = supabase
      .channel('public:rerich')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rerich' },
        (_payload) => fetchProperties() // eslint-disable-line @typescript-eslint/no-unused-vars
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchProperties]);

  /* ------------- 2. CSV ? insert rows into Supabase ----- */
  const uploadFile = useCallback(
    async (file: File) => {
      setLoading(true);
      setError(null);

      try {
        const csv = await file.text();
        const [headerLine, ...rows] = csv.split('\n').filter(Boolean);
        const headers = headerLine.split(',').map((h) => h.trim().replace(/"/g, ''));

        const objects = rows.map((line) => {
          const values = line.split(',').map((v) => v.trim().replace(/"/g, ''));
          const row: Record<string, unknown> = {};
          headers.forEach((h, i) => (row[h] = values[i]));
          return row;
        });

        // Bulk insert
        const { error } = await supabase.from('rerich').insert(objects);
        if (error) throw error;

        await fetchProperties(); // refresh list
      } catch (err) {
          const supaErr = err as PostgrestError;
          setError(supaErr.message);
      } finally {
        setLoading(false);
      }
    },
    [fetchProperties]
  );

  /* ------------- 3. Sorting stays unchanged ------------- */
  const sortProperties = useCallback((sortBy: SortOption) => {
    setFilteredProperties((prev) => {
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
    uploadFile,          // now writes to Supabase, then refreshes
    fetchProperties,     // in case you want manual refetch
    sortProperties,
    setFilteredProperties,
  };
};
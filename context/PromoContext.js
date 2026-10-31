import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../config/supabase';

const PromoContext = createContext(null);

export function PromoProvider({ children }) {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPromos = useCallback(async () => {
    setLoading(true);

    const { data, error: fetchError } = await supabase
      .from('promo')
      .select('*')
      .order('id', { ascending: false });

    if (fetchError) {
      setError(`Gagal memuat voucher: ${fetchError.message}`);
    } else {
      setPromos(data || []);
      setError('');
    }

    setLoading(false);
  }, []);

  const addPromo = useCallback(async (newPromo) => {
    setLoading(true);

    const { data, error: insertError } = await supabase
      .from('promo')
      .insert([newPromo])
      .select()
      .single();

    setLoading(false);

    if (insertError) {
      setError(`Gagal merilis voucher: ${insertError.message}`);
      return null;
    }

    setPromos((prev) => [data, ...prev]);
    setError('');
    return data;
  }, []);

  useEffect(() => {
    fetchPromos();
  }, [fetchPromos]);

  const value = useMemo(
    () => ({ promos, loading, error, fetchPromos, addPromo }),
    [promos, loading, error, fetchPromos, addPromo]
  );

  return <PromoContext.Provider value={value}>{children}</PromoContext.Provider>;
}

export function usePromo() {
  const context = useContext(PromoContext);
  if (!context) throw new Error('usePromo harus dipakai di dalam PromoProvider');
  return context;
}

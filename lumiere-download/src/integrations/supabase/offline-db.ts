/**
 * Offline Database Utility (Chainable Version)
 * This provides a localStorage-backed persistence layer that mimics Supabase's API.
 */

import { products as initialProducts } from '../../data/products';

const STORAGE_KEYS = {
  PRODUCTS: 'lumiere_offline_products',
  ORDERS: 'lumiere_offline_orders',
  USERS: 'lumiere_offline_users',
};

// Helper to get data with initial seeding
const getTableData = (key: string, initialData: any[] = []) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(data);
};

export const offlineDb = {
  from: (table: string) => {
    const key = table === 'products' ? STORAGE_KEYS.PRODUCTS : 
                table === 'orders' ? STORAGE_KEYS.ORDERS : 
                `lumiere_offline_${table}`;
    
    const initial = table === 'products' ? initialProducts : [];
    let currentData = getTableData(key, initial);

    // Filter/Sort state
    let filteredData = [...currentData];

    const builder = {
      select: (query = '*') => {
        return builder;
      },
      order: (column: string, { ascending = true } = {}) => {
        filteredData.sort((a, b) => {
          const valA = a[column];
          const valB = b[column];
          if (ascending) return valA > valB ? 1 : -1;
          return valA < valB ? 1 : -1;
        });
        return builder;
      },
      eq: (column: string, value: any) => {
        filteredData = filteredData.filter(item => item[column] === value);
        return builder;
      },
      single: () => {
        return Promise.resolve({ data: filteredData[0] || null, error: null });
      },
      // Terminal method that returns a Promise
      then: (onfulfilled?: (value: any) => any) => {
        const promise = Promise.resolve({ data: filteredData, error: null });
        return promise.then(onfulfilled);
      },
      // Mutations
      insert: async (payload: any) => {
        const newItems = Array.isArray(payload) ? payload : [payload];
        const itemsWithId = newItems.map(item => ({
          id: item.id || Math.random().toString(36).substr(2, 9),
          created_at: new Date().toISOString(),
          ...item
        }));
        const updatedData = [...itemsWithId, ...currentData];
        localStorage.setItem(key, JSON.stringify(updatedData));
        return { data: itemsWithId, error: null };
      },
      update: (payload: any) => {
        return {
          eq: (column: string, value: any) => {
            const updated = currentData.map((item: any) => 
              item[column] === value ? { ...item, ...payload, updated_at: new Date().toISOString() } : item
            );
            localStorage.setItem(key, JSON.stringify(updated));
            return Promise.resolve({ data: updated, error: null });
          }
        };
      },
      delete: () => {
        return {
          eq: (column: string, value: any) => {
            const updated = currentData.filter((item: any) => item[column] !== value);
            localStorage.setItem(key, JSON.stringify(updated));
            return Promise.resolve({ data: null, error: null });
          }
        };
      }
    };

    return builder;
  }
};

import {useEffect, useState} from 'react';
import {getLoginToken} from '../utils/localStorageUtils';

export interface UseFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

export function useAPI<Data>(url: string, options: UseFetchOptions) {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('woohooo');

    const token = getLoginToken();
    async function fetchData() {
      setLoading(true);
      try {
        const request = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
          method: options.method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        });
        if (request.ok) {
          const response = await request.json();
          setData(response);
        } else {
          setError(request.statusText);
        }
      } catch (error) {
        setError(error as unknown as string);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return {data, error, loading};
}

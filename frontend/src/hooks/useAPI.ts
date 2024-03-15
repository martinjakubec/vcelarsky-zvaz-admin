import { useEffect, useState } from "react";
import { getLoginToken } from "../utils/localStorageUtils";

export interface UseFetchOptions {
  body?: unknown;
  headers?: Record<string, string>;
}

export function useAPI<Data>(url: string, options?: UseFetchOptions) {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState<() => Promise<void>>(async () => {});

  useEffect(() => {
    const token = getLoginToken();
    async function fetchData() {
      setLoading(true);
      try {
        const request = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
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
    setRefetch(() => fetchData);
    fetchData();
  }, []);

  return { data, error, loading, refetch };
}

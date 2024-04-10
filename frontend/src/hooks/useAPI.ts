import { useEffect, useState } from "react";
import { getLoginToken } from "../utils/localStorageUtils";
import { fetchAPI } from "../utils/fetchAPI";

export interface UseFetchOptions {
  body?: unknown;
}

export function useAPI<Data>(url: string, options?: UseFetchOptions) {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState<() => Promise<void>>(async () => {});

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const request = await fetchAPI(url);
        if (request.ok) {
          const response = await request.json();
          setLoading(false);
          setData(response);
        } else {
          setLoading(false);
          setError(request.statusText);
        }
      } catch (error) {
        setLoading(false);
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

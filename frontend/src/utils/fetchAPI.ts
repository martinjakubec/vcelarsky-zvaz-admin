import { getLoginToken } from "./localStorageUtils";

export interface FetchAPIOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: string | FormData;
  contentType?: string | null;
}

export async function fetchAPI(
  url: string,
  options: FetchAPIOptions = {
    body: undefined,
    method: "GET",
    contentType: "application/json",
  }
) {
  const headers: HeadersInit = {
    Authorization: `${getLoginToken()}`,
    "Content-Type": "application/json",
  };

  if (options?.contentType === null) {
    delete headers["Content-Type"];
  }

  return fetch(import.meta.env.VITE_API_URL + url, {
    headers,
    body: options?.body,
    method: options?.method || "GET",
  });
}

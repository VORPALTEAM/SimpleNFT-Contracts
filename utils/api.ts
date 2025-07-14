export async function post<T>(
    endpoint: string,
    body: T | FormData,
    method: "POST" | "PUT" | "PATCH"
  ) {
    try {
      const headers: HeadersInit = {
        Accept: "application/json",
      };

      // Only add Content-Type for JSON bodies, not FormData
      if (!(body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
      }

      const bodyToSend =
        body instanceof FormData
          ? (() => {
              return body;
            })()
          : { ...body };

      const response = await fetch(endpoint, {
        method: method,
        mode: "cors",
        // credentials: "include",
        body:
          bodyToSend instanceof FormData
            ? bodyToSend
            : JSON.stringify({ ...body }),
        headers: new Headers(headers),
      });

      if (!response.ok) {
        const json = await response.json();
        throw new Error(json?.error);
      }

      return await response.json();
    } catch (e: any) {
      throw new Error(e);
    }
  }
const getBaseUrl = () => {
  if (import.meta.env.DEV) {
    return "/api";
  }
  
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return `${envUrl.replace(/\/$/, "")}/api`;
  }
  
  return "https://modakasha.runasp.net/api";
};

const BASE_URL = getBaseUrl();
console.log("Using API Base URL:", BASE_URL);

const getHeaders = (skipAuth = false, isGet = false) => {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Accept": "*/*",
  };

  if (!isGet) {
    headers["Content-Type"] = "application/json";
  }

  if (token && !skipAuth) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response: Response) => {
  const text = await response.text();
  let result;
  try {
    result = text ? JSON.parse(text) : {};
  } catch (e) {
    result = text;
  }

  if (response.status === 401) {
    // If we are not on the login page already, redirect to login
    if (!response.url.includes("/auth/signin")) {
      localStorage.removeItem("token");
      // Use window.location.hash for HashRouter compatibility
      window.location.hash = "#/login";
    }
    throw new Error(result.message || result.error || "Unauthorized");
  }

  if (!response.ok) {
    console.error("API Error Details:", {
      status: response.status,
      statusText: response.statusText,
      body: result,
      url: response.url,
    });
    throw new Error(
      result.message ||
        result.error ||
        `Error: ${response.status} ${response.statusText}`,
    );
  }

  return result;
};

export const api = {
  async get(endpoint: string) {
    try {
      // Ensure endpoint starts with /
      const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
      const response = await fetch(`${BASE_URL}${path}`, {
        method: "GET",
        headers: getHeaders(false, true),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  async post(endpoint: string, data: any) {
    try {
      const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
      const skipAuth = endpoint.includes("/auth/signin");
      const response = await fetch(`${BASE_URL}${path}`, {
        method: "POST",
        headers: getHeaders(skipAuth),
        body: JSON.stringify(data),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  async put(endpoint: string, data: any) {
    try {
      const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
      const response = await fetch(`${BASE_URL}${path}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  async delete(endpoint: string) {
    try {
      const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
      const response = await fetch(`${BASE_URL}${path}`, {
        method: "DELETE",
        headers: getHeaders(false, true),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },
};

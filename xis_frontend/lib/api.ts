// ── api.ts ──

const BASE =
  process.env.NEXT_PUBLIC_API_URL!;

// ── TYPES ──
export type ImageItem = {
  id: number;
  filename: string;
  size: number;
  label: string;

  //  FIXED: always required (Django auto_now_add always returns value)
  timestamp: string;

  width: number;
  height: number;

  image_url: string | null;
};

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous?: string | null;
  items: T[];
};

// ── TOKEN HELPERS ──
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("xis_token");
}

function clearToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("xis_token");
  }
}

// ── CORE REQUEST ──
async function req<T>(
  path: string,
  opts: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    ...(opts.headers as Record<string, string>),
  };

  // Only set JSON header if not FormData
  if (!(opts.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers,
  });

  // ── AUTH ERROR ──
  if (res.status === 401) {
    clearToken();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }

  // ── ERROR HANDLING ──
  if (!res.ok) {
    let message = "Request failed";
    try {
      const data = await res.json();
      message = data.error || JSON.stringify(data);
    } catch {
      message = await res.text();
    }
    throw new Error(message);
  }

  return res.json();
}

// ── API METHODS ──
export const api = {
  // AUTH
  login: async (username: string, password: string) => {
    const data = await req<{ access: string }>("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    if (typeof window !== "undefined") {
      localStorage.setItem("xis_token", data.access);
    }

    return data;
  },

  logout: () => {
    clearToken();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },

  // STATS
  count: () =>
    req<{ count: number }>("/images/count/"),

  byLabel: () =>
    req<{ label: string; count: number }[]>(
      "/images/group-by-label/"
    ),

  byDay: () =>
    req<{ date: string; count: number }[]>(
      "/images/group-by-day/"
    ),

  // LIST (PAGINATION FIXED)
  images: (page = 1, limit = 8, label?: string) => {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(limit),
    });

    if (label) {
      params.append("label", label);
    }

    return req<Paginated<ImageItem>>(
      `/images/?${params.toString()}`
    );
  },

  // UPLOAD
  upload: (file: File) => {
    const form = new FormData();
    form.append("image", file);

    return req<ImageItem>("/images/upload/", {
      method: "POST",
      body: form,
    });
  },
};

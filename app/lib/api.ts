/**
 * API Client Store
 * Replaces usePuterStore with a Zustand store that communicates
 * with the Django REST backend.
 */
import { create } from "zustand";

// ─── Configuration ───
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// ─── Types ───
interface User {
  id: string;
  email: string;
}

interface Session {
  access_token: string;
  refresh_token: string;
}

interface GeneratedResume {
  id: string;
  user_id?: string;
  job_title: string;
  job_description: string;
  experience: string;
  skills: string;
  education: string;
  template: string;
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  citizenship: string;
  resume_content: string;
  created_at: string;
  updated_at: string;
}

interface AnalyzedResume {
  id: string;
  user_id?: string;
  company_name: string;
  job_title: string;
  job_description: string;
  resume_file_path: string;
  image_file_path: string;
  feedback: any;
  checked_tips: string[];
  created_at: string;
}

interface ApiStore {
  isLoading: boolean;
  error: string | null;
  auth: {
    user: User | null;
    session: Session | null;
    isAuthenticated: boolean;
    signUp: (email: string, password: string) => Promise<{ emailConfirmationRequired: boolean }>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => void;
    getUser: () => User | null;
    loadSession: () => void;
  };
  resumes: {
    list: () => Promise<GeneratedResume[]>;
    get: (id: string) => Promise<GeneratedResume | null>;
    save: (data: Partial<GeneratedResume>) => Promise<GeneratedResume | null>;
    update: (id: string, data: Partial<GeneratedResume>) => Promise<GeneratedResume | null>;
    delete: (id: string) => Promise<boolean>;
    deleteAll: () => Promise<boolean>;
  };
  analyzed: {
    get: (id: string) => Promise<AnalyzedResume | null>;
    save: (id: string, data: any) => Promise<AnalyzedResume | null>;
    update: (id: string, data: any) => Promise<AnalyzedResume | null>;
  };
  ai: {
    generate: (prompt: string) => Promise<string>;
    analyze: (resumeText: string, instructions: string) => Promise<any>;
    suggest: (sectionName: string, currentContent: string, suggestion: string) => Promise<string>;
  };
  upload: {
    uploadResume: (file: File) => Promise<{
      file_url: string;
      file_path: string;
      extracted_text: string;
      file_id: string;
    }>;
  };
  clearError: () => void;
}

// ─── Helpers ───

function getStoredSession(): Session | null {
  try {
    const raw = localStorage.getItem("resumely_session");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem("resumely_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function storeSession(session: Session | null, user: User | null) {
  if (session && user) {
    localStorage.setItem("resumely_session", JSON.stringify(session));
    localStorage.setItem("resumely_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("resumely_session");
    localStorage.removeItem("resumely_user");
  }
}

async function apiFetch(
  path: string,
  options: RequestInit = {},
  token?: string,
  isRetry = false
): Promise<any> {
  const session = token ? { access_token: token } : getStoredSession();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }

  // Don't set Content-Type for FormData (browser sets it with boundary)
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  let response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && !isRetry) {
    // Attempt to refresh token
    const currentSession = getStoredSession();
    if (currentSession?.refresh_token) {
      try {
        const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: currentSession.refresh_token })
        });
        
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          if (data.session && data.user) {
            storeSession(data.session, data.user);
            // Retry original request with new token
            headers["Authorization"] = `Bearer ${data.session.access_token}`;
            response = await fetch(`${API_BASE_URL}${path}`, {
              ...options,
              headers,
            });
            // Update the auth store asynchronously to reflect the new session
            setTimeout(() => useApiStore.getState().auth.loadSession(), 0);
          } else {
            useApiStore.getState().auth.signOut();
          }
        } else {
          useApiStore.getState().auth.signOut();
        }
      } catch (err) {
        useApiStore.getState().auth.signOut();
      }
    } else {
      useApiStore.getState().auth.signOut();
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

// ─── Store ───

export const useApiStore = create<ApiStore>((set, get) => {
  const initialSession = getStoredSession();
  const initialUser = getStoredUser();

  return {
    isLoading: false,
    error: null,

    auth: {
      user: initialUser,
      session: initialSession,
      isAuthenticated: !!(initialSession && initialUser),

      signUp: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const data = await apiFetch("/auth/signup", {
            method: "POST",
            body: JSON.stringify({ email, password }),
          });

          if (data.session && data.user) {
            storeSession(data.session, data.user);
            set({
              auth: {
                ...get().auth,
                user: data.user,
                session: data.session,
                isAuthenticated: true,
              },
              isLoading: false,
            });
            return { emailConfirmationRequired: false };
          } else if (data.email_confirmation_required || (data.user && !data.session)) {
            set({ isLoading: false });
            return { emailConfirmationRequired: true };
          } else {
            set({ isLoading: false });
            throw new Error("Signup failed. Unexpected response from server.");
          }
        } catch (err: any) {
          set({
            error: err.message || "Signup failed",
            isLoading: false,
          });
          throw err;
        }
      },

      signIn: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const data = await apiFetch("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
          });

          storeSession(data.session, data.user);
          set({
            auth: {
              ...get().auth,
              user: data.user,
              session: data.session,
              isAuthenticated: true,
            },
            isLoading: false,
          });
        } catch (err: any) {
          set({
            error: err.message || "Login failed",
            isLoading: false,
          });
          throw err;
        }
      },

      signOut: () => {
        storeSession(null, null);
        set({
          auth: {
            ...get().auth,
            user: null,
            session: null,
            isAuthenticated: false,
          },
        });
        // Fire and forget the server-side logout
        apiFetch("/auth/logout", { method: "POST" }).catch(() => {});
      },

      getUser: () => get().auth.user,

      loadSession: () => {
        const session = getStoredSession();
        const user = getStoredUser();
        if (session && user) {
          set({
            auth: {
              ...get().auth,
              user,
              session,
              isAuthenticated: true,
            },
          });
        }
      },
    },

    // ─── Generated Resumes ───
    resumes: {
      list: async () => {
        const data = await apiFetch("/resumes/generated/");
        return data.resumes || [];
      },

      get: async (id: string) => {
        try {
          const data = await apiFetch(`/resumes/generated/${id}/`);
          return data.resume || null;
        } catch {
          return null;
        }
      },

      save: async (resumeData: Partial<GeneratedResume>) => {
        const data = await apiFetch("/resumes/generated/", {
          method: "POST",
          body: JSON.stringify(resumeData),
        });
        return data.resume || null;
      },

      update: async (id: string, resumeData: Partial<GeneratedResume>) => {
        const data = await apiFetch(`/resumes/generated/${id}/`, {
          method: "PUT",
          body: JSON.stringify(resumeData),
        });
        return data.resume || null;
      },

      delete: async (id: string) => {
        await apiFetch(`/resumes/generated/${id}/`, { method: "DELETE" });
        return true;
      },

      deleteAll: async () => {
        await apiFetch("/resumes/generated/?all=true", { method: "DELETE" });
        return true;
      },
    },

    // ─── Analyzed Resumes ───
    analyzed: {
      get: async (id: string) => {
        try {
          const data = await apiFetch(`/resumes/analyzed/${id}/`);
          return data.resume || null;
        } catch {
          return null;
        }
      },

      save: async (id: string, resumeData: any) => {
        const data = await apiFetch(`/resumes/analyzed/${id}/`, {
          method: "POST",
          body: JSON.stringify(resumeData),
        });
        return data.resume || null;
      },

      update: async (id: string, data: any) => {
        const result = await apiFetch(`/resumes/analyzed/${id}/`, {
          method: "PUT",
          body: JSON.stringify(data),
        });
        return result.resume || null;
      },
    },

    // ─── AI ───
    ai: {
      generate: async (prompt: string) => {
        const data = await apiFetch("/ai/generate", {
          method: "POST",
          body: JSON.stringify({ prompt }),
        });
        return data.content;
      },

      analyze: async (resumeText: string, instructions: string) => {
        const data = await apiFetch("/ai/analyze", {
          method: "POST",
          body: JSON.stringify({ resume_text: resumeText, instructions }),
        });
        return data.feedback;
      },

      suggest: async (sectionName: string, currentContent: string, suggestion: string) => {
        const data = await apiFetch("/ai/suggest", {
          method: "POST",
          body: JSON.stringify({
            section_name: sectionName,
            current_content: currentContent,
            suggestion,
          }),
        });
        return data.content;
      },
    },

    // ─── Upload ───
    upload: {
      uploadResume: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return apiFetch("/upload/resume", {
          method: "POST",
          body: formData,
        });
      },
    },

    clearError: () => set({ error: null }),
  };
});

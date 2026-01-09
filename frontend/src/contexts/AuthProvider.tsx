import api from "../api/axios";
import { type ReactNode, useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { AuthContext, type User } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

type AuthLoading = "login" | "register" | "logout" | "user" | "facebook" | null;

function getStoredToken(): string | null {
  return localStorage.getItem("token");
}

function storeToken(token: string) {
  localStorage.setItem("token", token);
}

function clearTokens() {
  localStorage.removeItem("token");
}

function decodeUser(): User | null {
  const token = getStoredToken();
  if (!token) return null;
  try {
    const decoded = jwtDecode<User & { exp?: number }>(token);
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      clearTokens();
      return null;
    }
    return decoded as User;
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(() => decodeUser());
  const [authLoading, setAuthLoading] = useState<AuthLoading>(null);
  const [error, setError] = useState<any>(null);

  const { data, refetch, isFetching } = useQuery<User | null>({
    queryKey: ["me"],
    queryFn: async () => {
      const token = getStoredToken();
      if (!token) return null;
      try {
        const res = await api.get<{ status: string; user: User }>("/auth/me");
        return res.data.user;
      } catch {
        return null;
      }
    },
    initialData: user ?? undefined,
    initialDataUpdatedAt: user ? Date.now() - 10 * 60 * 1000 : undefined,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isFetching) {
      setAuthLoading("user");
    } else {
      setAuthLoading((prev) => (prev === "user" ? null : prev));
    }
  }, [isFetching]);

  useEffect(() => {
    setUser(data ?? null);
  }, [data]);

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      setAuthLoading("login");
      try {
        const res = await api.post<any>("/auth/login", {
          email,
          password,
        });
        storeToken(res.data.token);
        setUser(decodeUser());
        await refetch();
      } catch (err: any) {
        setError(err.response.data.message);
      } finally {
        setAuthLoading(null);
      }
    },
    [refetch]
  );

  const register = useCallback(
    async (name: string, email: string, password: string, role: string = "READER"): Promise<void> => {
      setAuthLoading("register");
      try {
        const res = await api.post<{ status: string; token: string }>(
          "/auth/register",
          {
            name,
            email,
            password,
            role,
          }
        );
        storeToken(res.data.token);
        setUser(decodeUser());
        await refetch();
      } catch (err: any) {
        setError(err.response.data.message);
      } finally {
        setAuthLoading(null);
      }
    },
    [refetch]
  );

  const facebookAuth = useCallback(
    async (fbResponse: { accessToken: string }) => {
      if (!fbResponse.accessToken) return;
      setAuthLoading("facebook");
      try {
        const res = await api.post<{ status: string; tokens: Tokens }>(
          "/auth/facebook",
          { accessToken: fbResponse.accessToken }
        );
        storeToken(res.data.tokens.accessToken);
        setUser(decodeUser());
        await refetch();
      } finally {
        setAuthLoading(null);
      }
    },
    [refetch]
  );

  const logout = useCallback(async (): Promise<void> => {
    setAuthLoading("logout");
    try {
      await api.post("/auth/logout");
    } finally {
      clearTokens();
      queryClient.clear();
      setUser(null);
      setAuthLoading(null);
    }
  }, [queryClient]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        authLoading,
        refetchUser: refetch,
        facebookAuth,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "@/store/types";

const TOKEN_KEY = "shopsphere_token";
const USER_KEY = "shopsphere_user";

function loadFromStorage<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrate(state) {
      state.token = loadFromStorage<string>(TOKEN_KEY);
      state.user = loadFromStorage(USER_KEY);
    },
    setCredentials(
      state,
      action: PayloadAction<{ user: AuthState["user"]; token: string }>
    ) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      if (typeof window !== "undefined") {
        localStorage.setItem(TOKEN_KEY, JSON.stringify(action.payload.token));
        localStorage.setItem(USER_KEY, JSON.stringify(action.payload.user));
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { hydrate, setCredentials, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;

export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsAdmin = (state: { auth: AuthState }) =>
  state.auth.user?.role === "admin";
export const selectIsLoading = (state: { auth: AuthState }) =>
  state.auth.isLoading;

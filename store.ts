import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  user: { email: string } | null;
  token: string | null;
  loading: boolean;
}

const initialAuthState: AuthState = {
  isAuthenticated: !!localStorage.getItem("token"),
  user: localStorage.getItem("userEmail")
    ? { email: localStorage.getItem("userEmail")! }
    : null,
  token: localStorage.getItem("token"),
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string; token: string }>) => {
      state.isAuthenticated = true;
      state.user = { email: action.payload.email };
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("userEmail", action.payload.email);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
    },
  },
});

export const { login, logout } = authSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import React from "react";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useSelector, Provider } from "react-redux";
import { store, RootState } from "./store";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { PostManagement } from "./pages/PostManagement";
import { CategoryManagement } from "./pages/CategoryManagement";
import { UserManagement } from "./pages/UserManagement";
import { RechargeManagement } from "./pages/RechargeManagement";
import { ReportManagement } from "./pages/ReportManagement";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
};

const AuthRoutes = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const location = useLocation();

  if (isAuthenticated && location.pathname === "/login") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/posts"
        element={
          <ProtectedRoute>
            <PostManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <UserManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recharges"
        element={
          <ProtectedRoute>
            <RechargeManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <CategoryManagement />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <HashRouter>
        <AuthRoutes />
      </HashRouter>
    </Provider>
  );
};

export default App;

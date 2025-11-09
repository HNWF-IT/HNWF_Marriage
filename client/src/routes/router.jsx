import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Login from "../components/login/Login";
import Layout from "../components/commons/Layout";
import CandidateDashboard from "../components/candidate/CandidateDashboard";
import Dashboard from "../components/dashboard/Dashboard";
import isLoggedIn from "../utils";
import BookList from "../components/library/BookList";
import CandidateProfile from "../components/candidate/CandidateProfile";
import AdminUserManagement from "../components/user/AdminUserManagement";
import ProtectedRoute from "../components/commons/ProtectedRoute";

let ROUTES = <></>;

if (isLoggedIn()) {
  // if (true) {
  ROUTES = <>
    <Route path="/" element={<Layout />}>
      <Route path="login" element={<Login />} />

      {/* Admin-only routes */}
      <Route
        path="dashboard"
        element={
          <ProtectedRoute requiresAdmin={true}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="users"
        element={
          <ProtectedRoute requiresAdmin={true}>
            <AdminUserManagement />
          </ProtectedRoute>
        }
      />

      {/* Marriage app routes - requires 'marriage' permission */}
      <Route
        path="marriage"
        element={
          <ProtectedRoute requiredPermission="marriage">
            <CandidateDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidates/:id"
        element={
          <ProtectedRoute requiredPermission="marriage">
            <CandidateProfile />
          </ProtectedRoute>
        }
      />

      {/* Library app routes - requires 'library' permission */}
      <Route
        path="library"
        element={
          <ProtectedRoute requiredPermission="library">
            <BookList />
          </ProtectedRoute>
        }
      />
    </Route>
  </>
} else {
  ROUTES = <><Route path="*" element={<Login />} /></>
}

const routes = createRoutesFromElements(ROUTES);
const router = createBrowserRouter(routes);

export default router;

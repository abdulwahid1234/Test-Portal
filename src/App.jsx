import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Auth/Login/Login";
import Signup from "./Auth/Signup/Signup";
import DashboardLayout from "./Layout/Layout";
import HomeContent from "./AdminHome/HomeContent";
import CreateTest from "./AdminHome/CreateTest/CreateTest";
import Payment from "./Payment/Payment";
import UploadQuestion from "./AdminHome/UploadQuestion/UploadQuestion";
import Result from "./AdminHome/Results/Result";

// Import your new Super Admin components!
import SuperAdminDashboard from "./SuperAdmin/SuperDashboard/SuperAdminDashboard";
import AdminDetails from "./SuperAdmin/AdminDetails/AdminDetails";
import StatusCode from "./SuperAdmin/StatusCode/StatusCode";

function getUserRole() {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.role || null;
}

function PrivateRoute({ children, allowedRoles }) {
  const isLoggedIn = !!localStorage.getItem("token");
  const role = getUserRole();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role)) return <Navigate to="/" replace />;
  return children;
}

function App() {
  const role = getUserRole();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

         {/* Admin routes */}
      <Route
        path="/"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<HomeContent />} />
        <Route path="create-test" element={<CreateTest />} />
        <Route path="result" element={<Result />} />
        <Route path="payment" element={<Payment />} />
        <Route path="upload-question/:id" element={<UploadQuestion />} />  {/* NESTED */}
      </Route>

      {/* Super Admin routes */}
      <Route
        path="/superadmin"
        element={
          <PrivateRoute allowedRoles={["superadmin"]}>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<SuperAdminDashboard />} />
        <Route path="dashboard" element={<SuperAdminDashboard />} />
        <Route path="admin" element={<AdminDetails />} />
        <Route path="statuscode" element={<StatusCode />} />
      </Route>

      {/* Standalone page */}
      <Route path="/upload-question/:id" element={<UploadQuestion />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to={role === "superadmin" ? "/superadmin" : "/"} replace />} />
    </Routes>
  );
}

export default App;

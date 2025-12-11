import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "./Pages/LandingPage"
import Login from "./Pages/Login"
import Register from "./Pages/Register"
import Dashboard from "./Pages/UserPages/Dashboard"
import AdminDashboard from "./Pages/AdminPages/AdminDashboard"
import ManageReports from "./Pages/AdminPages/ManageReports"
import CreatePetugas from "./Pages/AdminPages/CreatePetugas"
import PetugasDashboard from "./Pages/PetugasPages/PetugasDashboard"
import CreateReports from "./Pages/UserPages/CreateReports"
import MyReports from "./Pages/UserPages/MyReports"
import EditReport from "./Pages/UserPages/EditReport"
import EditProfile from "./Pages/UserPages/EditProfile"


import ProtectedRoute from "./middleware/ProtectedRoute"
import RoleRoute from "./middleware/RoleRoute"
import GuestRoute from "./middleware/GuestRoute"

function AppRoutes() {
  return (
    <Router>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

        {/* USER */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["user"]}>
                <Dashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/create-report"            
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["user"]}>
                <CreateReports />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/my-reports"            
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["user"]}>
                <MyReports />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/edit-report/:id"            
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["user"]}>
                <EditReport />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/edit-profile"            
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["user"]}>
                <EditProfile />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        {/* ADMIN */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin"]}>
                <ManageReports />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/create-petugas"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin"]}>
                <CreatePetugas />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* PETUGAS */}
        <Route
          path="/petugas/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["petugas"]}>
                <PetugasDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route path="/test-profile" element={<div>Test Profile Page</div>} />
        <Route path="/forbidden" element={<h1>Akses Ditolak</h1>} />
      </Routes>
    </Router>
  )
}

export default AppRoutes

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "./Pages/LandingPage"
import Login from "./Pages/Login"
import Register from "./Pages/Register"
import Dashboard from "./Pages/UserPages/Dashboard"
import AdminDashboard from "./Pages/AdminPages/AdminDashboard"
import ManageReports from "./Pages/AdminPages/ManageReports"
import CreatePetugas from "./Pages/AdminPages/CreatePetugas"
import ManageRecycling from "./Pages/AdminPages/ManageRecycling"
import AssignPetugas from "./Pages/AdminPages/AssignPetugas"
import PetugasDashboard from "./Pages/PetugasPages/PetugasDashboard"
import CreateReports from "./Pages/UserPages/CreateReports"
import MyReports from "./Pages/UserPages/MyReports"
import EditReport from "./Pages/UserPages/EditReport"
import EditProfile from "./Pages/UserPages/EditProfile"
import CreateRecyclingOrder from "./Pages/UserPages/CreateRecyclingOrder"
import MyRecyclingOrders from "./Pages/UserPages/MyRecyclingOrders"
import MyRecyclingTasks from "./Pages/PetugasPages/MyRecyclingTasks"
import EditProfilePetugas from "./Pages/PetugasPages/EditProfilePetugas"


import ProtectedRoute from "./middleware/ProtectedRoute"
import RoleRoute from "./middleware/RoleRoute"
import GuestRoute from "./middleware/GuestRoute"
import ProfileCompleteCheck from "./middleware/ProfileCompleteCheck"

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
                <ProfileCompleteCheck>
                  <CreateReports />
                </ProfileCompleteCheck>
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

        <Route
          path="/dashboard/create-recycling"            
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["user"]}>
                <ProfileCompleteCheck>
                  <CreateRecyclingOrder />
                </ProfileCompleteCheck>
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/my-recycling"            
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["user"]}>
                <MyRecyclingOrders />
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

        <Route
          path="/admin/recycling"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin"]}>
                <ManageRecycling />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/assign-petugas"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin"]}>
                <AssignPetugas />
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

        <Route
          path="/petugas/edit-profile"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["petugas"]}>
                <EditProfilePetugas />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/petugas/recycling-tasks"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["petugas"]}>
                <MyRecyclingTasks />
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

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import ProtectedRoute from "./middleware/ProtectedRoute"

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED ROUTE */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default AppRoutes

import { Navigate } from "react-router-dom"

function GuestRoute({ children }) {
  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  // Jika sudah login, redirect ke dashboard sesuai role
  if (token) {
    if (user.roles?.includes("admin")) {
      return <Navigate to="/admin/dashboard" replace />
    } else if (user.roles?.includes("petugas")) {
      return <Navigate to="/petugas/dashboard" replace />
    } else {
      return <Navigate to="/dashboard" replace />
    }
  }

  return children
}

export default GuestRoute

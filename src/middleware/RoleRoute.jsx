import { Navigate } from "react-router-dom"

function RoleRoute({ children, allowedRoles = [] }) {
  const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "null")
  const roles = user?.roles || []

  // Jika user tidak punya salah satu role yang dibutuhkan
  const hasAccess = roles.some((role) => allowedRoles.includes(role))

  if (!hasAccess) {
    // Redirect berdasarkan role yang ada
    if (roles.includes('admin')) {
      return <Navigate to="/admin/dashboard" />
    } else if (roles.includes('petugas')) {
      return <Navigate to="/petugas/dashboard" />
    } else {
      return <Navigate to="/dashboard" />
    }
  }

  return children
}

export default RoleRoute

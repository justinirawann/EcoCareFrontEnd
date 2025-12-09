import { Navigate } from "react-router-dom"

function RoleRoute({ children, allowedRoles = [] }) {
  const user = JSON.parse(localStorage.getItem("user"))
  const roles = user?.roles || []

  // Jika user tidak punya salah satu role yang dibutuhkan
  const hasAccess = roles.some((role) => allowedRoles.includes(role))

  if (!hasAccess) {
    return <Navigate to="/forbidden" />
  }

  return children
}

export default RoleRoute

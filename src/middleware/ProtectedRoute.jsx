import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      setAuthorized(false)
      setLoading(false)
      return
    }

    fetch("http://127.0.0.1:8000/api/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.id) {
          // Jika sukses → simpan user ke localStorage
          localStorage.setItem("user", JSON.stringify(data))
          setAuthorized(true)
        } else {
          setAuthorized(false)
          localStorage.removeItem("token")
          localStorage.removeItem("user")
        }
        setLoading(false)
      })
      .catch(() => {
        setAuthorized(false)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading...</div>
  if (!authorized) return <Navigate to="/login" />

  return children
}

export default ProtectedRoute

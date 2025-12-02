import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

// Temporary components for features
const Reports = () => <div className="p-8"><h1 className="text-3xl font-bold">Laporan Sampah</h1></div>
const Recycling = () => <div className="p-8"><h1 className="text-3xl font-bold">Daur Ulang</h1></div>
const Pickup = () => <div className="p-8"><h1 className="text-3xl font-bold">Pengangkutan</h1></div>
const Education = () => <div className="p-8"><h1 className="text-3xl font-bold">Edukasi</h1></div>

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/recycling" element={<Recycling />} />
        <Route path="/pickup" element={<Pickup />} />
        <Route path="/education" element={<Education />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes
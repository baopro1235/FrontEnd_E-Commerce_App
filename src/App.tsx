import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import LoginPage from './features/auth/pages/login/LoginPage'
import RegisterPage from './features/auth/pages/register/RegisterPage'
import ProfilePage from './features/profile/pages/ProfilePage'
import { useAuth } from './context/AuthContext'

function AuthenticatedProfile() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <ProfilePage /> : <Navigate replace to="/login" />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate replace to="/profile" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<AuthenticatedProfile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

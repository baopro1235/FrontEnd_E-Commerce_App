import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import ForgotPasswordPage from './features/auth/pages/forgot-password/ForgotPasswordPage'
import LoginPage from './features/auth/pages/login/LoginPage'
import RegisterPage from './features/auth/pages/register/RegisterPage'
import ProfilePage from './features/profile/pages/ProfilePage'
import ProtectedRoute from './routes/ProtectedRoute'
import { Toaster } from './components/ui/toast'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate replace to="/profile" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
      <Toaster timeout={10000} />
    </BrowserRouter>
  )
}

export default App

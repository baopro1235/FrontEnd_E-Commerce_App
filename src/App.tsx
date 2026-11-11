import './App.css'
import { BrowserRouter, Routes ,Route} from 'react-router'
import LoginPage from './features/auth/pages/login/LoginPage'
import RegisterPage from './features/auth/pages/register/RegisterPage'
function App() {

  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>


      
  )
}

export default App

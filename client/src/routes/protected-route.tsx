import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { authService } from '@services/auth.service'

function ProtectedRoute() {
  const location = useLocation()
  const [isReady, setIsReady] = useState(false)

  // Mirror App.tsx's mount pattern so both guards agree on the same truth
  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('auth_user')
    if (token && savedUser) {
      try {
        authService.setTokens(token, localStorage.getItem('refreshToken') || '')
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('auth_user')
      }
    }
    setIsReady(true)
  }, [])

  if (!isReady) return null

  const isAuthenticated = authService.isAuthenticated()

  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" state={{ from: location }} replace />
}

export default ProtectedRoute
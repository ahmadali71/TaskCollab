import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import ProtectedRoute from './protected-route'

const Dashboard = lazy(() => import('@pages/Dashboard'))
const Tasks = lazy(() => import('@pages/Tasks'))
const TaskDetail = lazy(() => import('@pages/TaskDetail'))
const Calendar = lazy(() => import('@pages/Calendar'))
const Analytics = lazy(() => import('@pages/Analytics'))
const Team = lazy(() => import('@pages/Team'))
const Settings = lazy(() => import('@pages/Settings'))
const Login = lazy(() => import('@pages/Login'))
const Register = lazy(() => import('@pages/Register'))
const NotFound = lazy(() => import('@pages/NotFound'))

function AppRoutes() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/:id" element={<TaskDetail />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/team" element={<Team />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
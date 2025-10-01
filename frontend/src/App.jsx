import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/ProminAuthContext'
import { useEffect } from 'react'

// Layout Components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Sidebar from './components/layout/Sidebar'

// Public Pages
import LandingPage from './pages/public/LandingPage'
import LoginPage from './pages/public/LoginPage'
import RegisterPage from './pages/public/RegisterPage'
import ForgotPasswordPage from './pages/public/ForgotPasswordPage'
import AboutPage from './pages/public/AboutPage'
import Error404Page from './pages/public/Error404Page'
import Error401Page from './pages/public/Error401Page'
import Error500Page from './pages/public/Error500Page'

// Shared Pages
import Dashboard from './pages/shared/Dashboard'
import ProfilePage from './pages/shared/ProfilePage'
import SettingsPage from './pages/shared/SettingsPage'
import MessagesPage from './pages/shared/MessagesPage'

// Requester Pages
import RequesterDashboard from './pages/requester/RequesterDashboard'
import JobCreatePage from './pages/requester/JobCreatePage'
import JobListPage from './pages/requester/JobListPage'
import JobViewPage from './pages/requester/JobViewPage'

// Tasker Pages
import TaskerDashboard from './pages/tasker/TaskerDashboard'
import JobBrowsePage from './pages/tasker/JobBrowsePage'
import JobViewTaskerPage from './pages/tasker/JobViewTaskerPage'
import MyApplicationsPage from './pages/tasker/MyApplicationsPage'
import DeliverablesPage from './pages/tasker/DeliverablesPage'
import RatingsPage from './pages/tasker/RatingsPage'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import UserManagementPage from './pages/admin/UserManagementPage'
import JobManagementPage from './pages/admin/JobManagementPage'
import AuditLogsPage from './pages/admin/AuditLogsPage'
import AnalyticsPage from './pages/admin/AnalyticsPage'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

// Layout Wrapper Component
const LayoutWrapper = ({ children, showSidebar = false }) => {
  const { user } = useAuth()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        {showSidebar && user && <Sidebar />}
        <main className={`flex-1 ${showSidebar ? 'ml-64' : ''}`}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Prominis...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/404" element={<Error404Page />} />
      <Route path="/401" element={<Error401Page />} />
      <Route path="/500" element={<Error500Page />} />
      <Route path="/unauthorized" element={<Error401Page />} />

      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <LayoutWrapper showSidebar={true}>
              <Dashboard />
            </LayoutWrapper>
          </ProtectedRoute>
        } 
      />

      {/* Shared Routes */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <LayoutWrapper showSidebar={true}>
              <ProfilePage />
            </LayoutWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <LayoutWrapper showSidebar={true}>
              <SettingsPage />
            </LayoutWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/messages" 
        element={
          <ProtectedRoute>
            <LayoutWrapper showSidebar={true}>
              <MessagesPage />
            </LayoutWrapper>
          </ProtectedRoute>
        } 
      />

      {/* Requester Routes */}
      <Route 
        path="/requester/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['REQUESTER']}>
            <LayoutWrapper showSidebar={true}>
              <RequesterDashboard />
            </LayoutWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/requester/jobs/create" 
        element={
          <ProtectedRoute allowedRoles={['REQUESTER']}>
            <LayoutWrapper showSidebar={true}>
              <JobCreatePage />
            </LayoutWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/requester/jobs" 
        element={
          <ProtectedRoute allowedRoles={['REQUESTER']}>
            <LayoutWrapper showSidebar={true}>
              <JobListPage />
            </LayoutWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/requester/jobs/:id" 
        element={
          <ProtectedRoute allowedRoles={['REQUESTER']}>
            <LayoutWrapper showSidebar={true}>
              <JobViewPage />
            </LayoutWrapper>
          </ProtectedRoute>
        } 
      />

      {/* Tasker Routes */}
      <Route 
        path="/tasker/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['TASKER']}>
            <LayoutWrapper showSidebar={true}>
              <TaskerDashboard />
            </LayoutWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tasker/jobs" 
        element={
          <ProtectedRoute allowedRoles={['TASKER']}>
            <LayoutWrapper showSidebar={true}>
              <JobBrowsePage />
            </LayoutWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tasker/jobs/:id" 
        element={
          <ProtectedRoute allowedRoles={['TASKER']}>
            <LayoutWrapper showSidebar={true}>
              <JobViewTaskerPage />
            </LayoutWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tasker/applications" 
        element={
          <ProtectedRoute allowedRoles={['TASKER']}>
            <LayoutWrapper showSidebar={true}>
              <MyApplicationsPage />
            </LayoutWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tasker/deliverables" 
        element={
          <ProtectedRoute allowedRoles={['TASKER']}>
            <LayoutWrapper showSidebar={true}>
              <DeliverablesPage />
            </LayoutWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tasker/ratings" 
        element={
          <ProtectedRoute allowedRoles={['TASKER']}>
            <LayoutWrapper showSidebar={true}>
              <RatingsPage />
            </LayoutWrapper>
          </ProtectedRoute>
        } 
      />

      {/* Admin Routes */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <LayoutWrapper showSidebar={true}>
              <AdminDashboard />
            </LayoutWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <LayoutWrapper showSidebar={true}>
              <UserManagementPage />
            </LayoutWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/jobs" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <LayoutWrapper showSidebar={true}>
              <JobManagementPage />
            </LayoutWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/audit-logs" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <LayoutWrapper showSidebar={true}>
              <AuditLogsPage />
            </LayoutWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/analytics" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <LayoutWrapper showSidebar={true}>
              <AnalyticsPage />
            </LayoutWrapper>
          </ProtectedRoute>
        } 
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}

export default App


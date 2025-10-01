import { useAuth } from '../../context/ProminAuthContext'
import { Navigate } from 'react-router-dom'

const Dashboard = () => {
  const { user } = useAuth()

  // Redirect to role-specific dashboard
  if (user) {
    switch (user.role) {
      case 'REQUESTER':
        return <Navigate to="/requester/dashboard" replace />
      case 'TASKER':
        return <Navigate to="/tasker/dashboard" replace />
      case 'ADMIN':
        return <Navigate to="/admin/dashboard" replace />
      default:
        return <Navigate to="/" replace />
    }
  }

  return <Navigate to="/login" replace />
}

export default Dashboard

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"

// Using path aliases for cleaner imports
import LandingPage from "@pages/LandingPage"
import Login from "@auth/Login"
import Signup from "@auth/Signup"
import Dashboard from "@pages/Dashboard"
import ProjectBoard from "@pages/ProjectBoard"
import OrganizationPage from "@pages/OrganizationPage"
import OrganizationSettings from "@pages/OrganizationSettings"
import ProfileSettings from "@pages/ProfileSettings"
import Conversations from "@pages/ConversationsPage"
import Profile from "@pages/Profile"

// Components
import ProtectedRoute from "@components/ProtectedRoute"

// Context
import { AuthProvider } from "@context/AuthContext"
import { ProjectProvider } from "@context/ProjectContext"
import { OrganizationProvider } from "@context/OrganizationContext"
import { NotificationProvider } from "@context/NotificationContext"
import { ConversationProvider } from "@context/ConversationContext"

// Simplified layout component for protected routes
const ProtectedLayout = ({ children }) => {
  return (
    <div className="min-h-screen">
      <main>{children}</main>
    </div>
  )
}

// AppContent component to handle the AnimatePresence
const AppContent = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/organization/:orgId"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <OrganizationPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/organization/:orgId/settings"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <OrganizationSettings />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/organization/:orgId/projects/:projectId"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <ProjectBoard />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/conversations"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Conversations />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/settings"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <ProfileSettings />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Profile />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Profile />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ConversationProvider>
          <OrganizationProvider>
            <ProjectProvider>
              <NotificationProvider>
                <AppContent />
              </NotificationProvider>
            </ProjectProvider>
          </OrganizationProvider>
        </ConversationProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
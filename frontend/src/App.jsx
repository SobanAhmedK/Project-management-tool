"use client"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"

// Using path aliases for cleaner imports
import LandingPage from "@pages/LandingPage"
import Login from "@auth/Login"
import Signup from "@auth/Signup"
import Dashboard from "@pages/Dashboard"
import ProjectBoard from "@pages/ProjectBoard"
import OrganizationPage from "@pages/OrganizationPage"
import OrganizationSettings from "@pages/OrganizationSettings" // Import the new component
import ProfileSettings from "@pages/ProfileSettings"
import Profile from "@pages/Profile"

// Components
import ProtectedRoute from "@components/ProtectedRoute"

// Context
import { AuthProvider } from "@context/AuthContext"
import { ProjectProvider } from "@context/ProjectContext"
import { OrganizationProvider } from "@context/OrganizationContext"
import { NotificationProvider } from "@context/NotificationContext"

function App() {
  return (
    <Router>
      <AuthProvider>
        <OrganizationProvider>
          <ProjectProvider>
            <NotificationProvider>
              <AnimatePresence mode="wait">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />

                  {/* Protected Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/organization/:orgId"
                    element={
                      <ProtectedRoute>
                        <OrganizationPage />
                      </ProtectedRoute>
                    }
                  />
                  {/* Add the new route for organization settings */}
                  <Route
                    path="/organization/:orgId/settings"
                    element={
                      <ProtectedRoute>
                        <OrganizationSettings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/project/:projectId"
                    element={
                      <ProtectedRoute>
                        <ProjectBoard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile/settings"
                    element={
                      <ProtectedRoute>
                        <ProfileSettings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile/:userId"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback Route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AnimatePresence>
            </NotificationProvider>
          </ProjectProvider>
        </OrganizationProvider>
      </AuthProvider>
    </Router>
  )
}

export default App

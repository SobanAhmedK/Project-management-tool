"use client"

import { createContext, useContext, useState, useEffect } from "react"

// Create context
const AuthContext = createContext()

// Mock user data - in a real app, this would come from an API
const mockUsers = [
  { id: "user1", email: "user@example.com", password: "password", name: "John Doe" },
  { id: "user2", email: "admin@example.com", password: "password", name: "Jane Smith" },
]

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        const user = mockUsers.find((u) => u.email === email && u.password === password)

        if (user) {
          // Remove password before storing
          const { password, ...userWithoutPassword } = user
          setCurrentUser(userWithoutPassword)
          localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))
          resolve(userWithoutPassword)
        } else {
          reject(new Error("Invalid email or password"))
        }
      }, 500)
    })
  }

  const signup = (email, password, name) => {
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        // Check if user already exists
        const existingUser = mockUsers.find((u) => u.email === email)

        if (existingUser) {
          reject(new Error("User already exists"))
          return
        }

        // Create new user
        const newUser = {
          id: `user${mockUsers.length + 1}`,
          email,
          password,
          name,
        }

        // In a real app, this would be an API call to create the user
        mockUsers.push(newUser)

        // Remove password before storing
        const { password: _, ...userWithoutPassword } = newUser
        setCurrentUser(userWithoutPassword)
        localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))

        resolve(userWithoutPassword)
      }, 500)
    })
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem("currentUser")
  }

  const value = {
    currentUser,
    isLoading,
    login,
    signup,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "@context/AuthContext"

// Create the Conversation Context
const ConversationContext = createContext()

// Conversation Provider Component
export const ConversationProvider = ({ children }) => {
  const { currentUser } = useAuth()
  const [conversations, setConversations] = useState([])

  const mockConversations = [
    {
      id: "conv1",
      participants: [
        { id: "user1", full_name: "John Doe" },
        { id: "user2", full_name: "Jane Smith" },
      ],
      messages: [
        {
          id: "msg1",
          sender: { id: "user1", full_name: "John Doe" },
          text: "Hi Jane, how's the project going?",
          timestamp: "2025-04-28T10:00:00Z",
        },
        {
          id: "msg2",
          sender: { id: "user2", full_name: "Jane Smith" },
          text: "Hey John, it's going well! Need any help?",
          timestamp: "2025-04-28T10:05:00Z",
        },
      ],
    },
    {
      id: "conv2",
      participants: [
        { id: "user1", full_name: "John Doe" },
        { id: "user3", full_name: "Alice Johnson" },
      ],
      messages: [
        {
          id: "msg3",
          sender: { id: "user3", full_name: "Alice Johnson" },
          text: "Can we discuss the timeline?",
          timestamp: "2025-04-28T09:30:00Z",
        },
      ],
    },
  ]

  // Load conversations when the component mounts or currentUser changes
  useEffect(() => {
    const loadConversations = async () => {
      try {
       
        setConversations(mockConversations)
      } catch (error) {
        console.error("Failed to load conversations:", error)
      }
    }

    if (currentUser) {
      loadConversations()
    }
  }, [currentUser])

 
  const getConversations = () => {
    if (!currentUser) return []
    return conversations.filter((conv) =>
      conv.participants.some((p) => p.id === currentUser.id)
    )
  }


  const sendMessage = async (conversationId, text) => {
    if (!currentUser || !text.trim()) return

    const newMessage = {
      id: `msg${Date.now()}`, 
      sender: { id: currentUser.id, full_name: currentUser.full_name },
      text,
      timestamp: new Date().toISOString(),
    }

    try {
   
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: [...conv.messages, newMessage],
              }
            : conv
        )
      )
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const startConversation = async (targetUser) => {
    if (!currentUser || !targetUser) return null

    const existingConv = conversations.find((conv) =>
      conv.participants.length === 2 &&
      conv.participants.some((p) => p.id === currentUser.id) &&
      conv.participants.some((p) => p.id === targetUser.id)
    )

    if (existingConv) return existingConv.id

    const newConversation = {
      id: `conv${Date.now()}`, 
      participants: [
        { id: currentUser.id, full_name: currentUser.full_name },
        { id: targetUser.id, full_name: targetUser.full_name },
      ],
      messages: [],
    }

    try {
      // TODO: Replace with actual API call
      // const response = await api.createConversation({
      //   participants: [currentUser.id, targetUser.id],
      // })
      // setConversations((prev) => [...prev, response.data])
      setConversations((prev) => [...prev, newConversation])
      return newConversation.id
    } catch (error) {
      console.error("Failed to start conversation:", error)
      return null
    }
  }

  // Context value
  const value = {
    conversations,
    getConversations,
    sendMessage,
    startConversation,
  }

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  )
}

// Custom hook to use the Conversation Context
export const useConversation = () => {
  const context = useContext(ConversationContext)
  if (!context) {
    throw new Error("useConversation must be used within a ConversationProvider")
  }
  return context
}

export default ConversationContext
import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChatBubbleLeftEllipsisIcon as ChatIcon,
  UserCircleIcon as UserIcon,
  PaperAirplaneIcon,
  MagnifyingGlassIcon as SearchIcon,
  EllipsisVerticalIcon,
  CheckIcon,
  ClockIcon,
} from "@heroicons/react/24/outline"
import { useAuth } from "@context/AuthContext"
import { useConversation } from "@context/ConversationContext"
import { formatDate, formatTime } from "@utils"
import Sidebar from "@components/layout/Sidebar"
import Navbar from "@components/layout/Navbar"

const Conversations = () => {
  const { currentUser } = useAuth()
  const { getConversations, sendMessage } = useConversation()
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef(null)
  const messageInputRef = useRef(null)

  useEffect(() => {
    const loadConversations = async () => {
      const loadedConversations = getConversations() || []
      setConversations(loadedConversations)
      
      if (selectedConversation) {
        const updatedConv = loadedConversations.find(
          conv => conv.id === selectedConversation.id
        )
        if (updatedConv) {
          setSelectedConversation(updatedConv)
        }
      }
    }
    loadConversations()
  }, [getConversations])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [selectedConversation?.messages])

  useEffect(() => {
    if (selectedConversation) {
      messageInputRef.current?.focus()
    }
  }, [selectedConversation])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!messageText.trim() || !selectedConversation || !currentUser || isSending) return

    setIsSending(true)
    
    // Create temporary message for optimistic UI update
    const tempMessage = {
      id: `temp-${Date.now()}`,
      sender: { id: currentUser.id, full_name: currentUser.full_name },
      text: messageText,
      timestamp: new Date().toISOString(),
      status: 'sending'
    }

    // Optimistically update the UI
    setSelectedConversation(prev => ({
      ...prev,
      messages: [...prev.messages, tempMessage]
    }))
    setMessageText("")

    try {
      // Send the actual message
      await sendMessage(selectedConversation.id, messageText)
    } catch (error) {
      console.error("Failed to send message:", error)
      setSelectedConversation(prev => ({
        ...prev,
        messages: prev.messages.filter(msg => msg.id !== tempMessage.id)
      }))
      setMessageText(messageText) // Restore the message text
    } finally {
      setIsSending(false)
      messageInputRef.current?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.participants
      .filter(p => p.id !== currentUser?.id)
      .some(p => p.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const getOtherParticipant = useCallback((participants) =>
    participants.find(p => p.id !== currentUser?.id),
    [currentUser]
  )

  const getMessageStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckIcon className="w-3 h-3 text-gray-400" />
      case 'read': return <CheckIcon className="w-3 h-3 text-blue-500" />
      case 'sending': return <ClockIcon className="w-3 h-3 text-gray-400" />
      default: return null
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Messages" />

        <main className="flex-1 overflow-hidden p-6">
          <div className="max-w-7xl mx-auto flex h-[calc(100vh-140px)] gap-6">
            {/* Conversation List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="w-96 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Conversations</h2>
                <div className="relative">
                  <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search people..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
              
              <ul className="flex-1 overflow-y-auto divide-y divide-gray-100">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map(conv => {
                    const otherParticipant = getOtherParticipant(conv.participants)
                    const lastMessage = conv.messages[conv.messages.length - 1]
                    
                    return (
                      <motion.li
                        key={conv.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => setSelectedConversation(conv)}
                        className={`p-3 cursor-pointer transition-all duration-200 ease-in-out ${
                          selectedConversation?.id === conv.id 
                            ? "bg-cyan-50" 
                            : "bg-white hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                              <UserIcon className="w-5 h-5" />
                            </div>
                            {conv.unreadCount > 0 && (
                              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <h3 className="text-sm font-medium text-gray-800 truncate">
                                {otherParticipant?.full_name || 'Unknown'}
                              </h3>
                              {lastMessage && (
                                <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                  {formatTime(lastMessage.timestamp)}
                                </span>
                              )}
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="text-xs text-gray-500 truncate">
                                {lastMessage 
                                  ? `${lastMessage.sender.id === currentUser?.id ? 'You: ' : ''}${lastMessage.text}`
                                  : "No messages yet"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    )
                  })
                ) : (
                  <div className="p-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <ChatIcon className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="text-gray-500 font-medium">No conversations</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Start a conversation from a user's profile
                    </p>
                  </div>
                )}
              </ul>
            </motion.div>

            {/* Chat Window */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col"
            >
              {selectedConversation ? (
                <>
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-gray-800">
                          {getOtherParticipant(selectedConversation.participants)?.full_name || 'Unknown'}
                        </h2>
                        <p className="text-xs text-gray-500">
                          {selectedConversation.messages.length > 0 ? 
                            `Last seen ${formatTime(selectedConversation.messages[selectedConversation.messages.length - 1].timestamp)}` : 
                            'No activity yet'}
                        </p>
                      </div>
                    </div>
                    <button className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200">
                      <EllipsisVerticalIcon className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                    <AnimatePresence>
                      {selectedConversation.messages.map(msg => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`flex mb-4 ${
                            msg.sender.id === currentUser?.id ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${
                              msg.sender.id === currentUser?.id
                                ? "bg-gradient-to-r from-cyan-500 to-indigo-500 text-white rounded-tr-none"
                                : "bg-white text-gray-800 rounded-tl-none shadow-xs"
                            }`}
                          >
                            <p className="text-sm">{msg.text}</p>
                            <div className={`flex items-center justify-end mt-1 space-x-1 text-xs ${
                              msg.sender.id === currentUser?.id ? 'text-cyan-100' : 'text-gray-400'
                            }`}>
                              <span>{formatTime(msg.timestamp)}</span>
                              {msg.sender.id === currentUser?.id && getMessageStatusIcon(msg.status)}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                  </div>

                  <form
                    onSubmit={handleSendMessage}
                    className="p-4 border-t border-gray-100 bg-white sticky bottom-0"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        ref={messageInputRef}
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Write a message..."
                        className="flex-1 p-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                        disabled={isSending}
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={!messageText.trim() || isSending}
                        className={`p-3 rounded-xl flex items-center justify-center transition-colors duration-200 ${
                          messageText.trim() && !isSending
                            ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-white'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {isSending ? (
                          <ClockIcon className="w-5 h-5 animate-pulse" />
                        ) : (
                          <PaperAirplaneIcon className="w-5 h-5" />
                        )}
                      </motion.button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50">
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                    <ChatIcon className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-700 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-500 text-sm text-center max-w-md">
                    Choose a conversation from the list to start chatting or start a new conversation
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Conversations
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/ProminAuthContext'
import { prominApi } from '../../api/prominApi'
import { 
  MessageSquare, 
  Send, 
  Search,
  MoreVertical,
  Online,
  Clock
} from 'lucide-react'

const MessagesPage = () => {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id)
    }
  }, [selectedConversation])

  const fetchConversations = async () => {
    try {
      const response = await prominApi.messages.getConversations()
      setConversations(response.data)
      if (response.data.length > 0) {
        setSelectedConversation(response.data[0])
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    }
  }

  const fetchMessages = async (conversationId) => {
    try {
      const response = await prominApi.messages.getMessages(conversationId)
      setMessages(response.data)
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    setLoading(true)
    try {
      await prominApi.messages.sendMessage({
        conversationId: selectedConversation.id,
        content: newMessage
      })
      setNewMessage('')
      fetchMessages(selectedConversation.id)
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date

    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return date.toLocaleDateString()
  }

  const filteredConversations = conversations.filter(conv =>
    conv.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-2">Communicate with other users on Prominis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <div className="card h-full flex flex-col">
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto space-y-2">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedConversation?.id === conversation.id
                      ? 'bg-primary-50 border border-primary-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium text-sm">
                          {conversation.otherUser.name.charAt(0)}
                        </span>
                      </div>
                      {conversation.otherUser.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 truncate">
                          {conversation.otherUser.name}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.lastMessage?.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage?.content || 'No messages yet'}
                      </p>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <div className="w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="lg:col-span-2">
          <div className="card h-full flex flex-col">
            {selectedConversation ? (
              <>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium text-sm">
                          {selectedConversation.otherUser.name.charAt(0)}
                        </span>
                      </div>
                      {selectedConversation.otherUser.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {selectedConversation.otherUser.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {selectedConversation.otherUser.isOnline ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === user.id
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.senderId === user.id
                              ? 'text-primary-100'
                              : 'text-gray-500'
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 input-field"
                    />
                    <button
                      type="submit"
                      disabled={loading || !newMessage.trim()}
                      className="btn-primary flex items-center"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
                  <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessagesPage

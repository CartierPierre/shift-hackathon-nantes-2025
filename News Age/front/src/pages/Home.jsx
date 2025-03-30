import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { v4 as uuidv4 } from 'uuid'
import ChatChannels from '../components/ChatChannels'
import ChatArticles from '../components/ChatArticles'
import clsx from 'clsx'
import { Send, Plus, Database } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

function MaskImages({ hasClickedInput }) {
  return (
    <>
      <motion.img
        src="images/haut.png"
        alt="Top decoration"
        className="absolute top-0 left-0 w-full z-40"
        animate={hasClickedInput ? { y: '-100%' } : {}}
        transition={{ duration: 0.7 }}
      />
      <motion.img
        src="images/bas.png"
        alt="Bottom decoration"
        className="absolute bottom-0 left-0 w-full z-40"
        animate={hasClickedInput ? { y: '100%' } : {}}
        transition={{ duration: 0.7 }}
      />
    </>
  )
}

function InputSection({ onMessageSend, hasSentMessage, activeMode, setActiveMode, setHasClickedInput, loading }) {
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim()) return

    onMessageSend({ content: message })
    setMessage('')
  }

  return (
    <motion.div
      className="absolute left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl"
      animate={hasSentMessage ? { top: '0px', y: '0%' } : { top: '50%', y: '-50%' }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => navigate('/sources')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm bg-gray-50 hover:bg-gray-100 text-gray-900"
          >
            <Database size={16} />
            <span>Mes Refs</span>
          </button>
          <div className="flex-1" />
          <button
            onClick={() => setActiveMode(activeMode === 'brief' ? null : 'brief')}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm",
              activeMode === 'brief'
                ? "bg-violet-600 text-white shadow-md"
                : "bg-gray-50 hover:bg-gray-100 text-gray-900"
            )}
          >
            <Plus size={16} />
            <span>Brief</span>
          </button>

          <button
            onClick={() => setActiveMode(activeMode === 'deepdive' ? null : 'deepdive')}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm",
              activeMode === 'deepdive'
                ? "bg-violet-600 text-white shadow-md"
                : "bg-gray-50 hover:bg-gray-100 text-gray-900"
            )}
          >
            <Plus size={16} />
            <span>DeepDive</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setHasClickedInput(true)}
            placeholder="Chercher une tendance, trouver un article, ..."
            className="w-full px-6 py-4 bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-violet focus:ring-opacity-50 pr-16"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-violet text-white p-3 rounded-full hover:bg-violet-dark transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </motion.div>
  )
}

function ChatDisplay({ messages, loading }) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-8 overflow-y-auto" style={{ marginTop: '200px', maxHeight: 'calc(100vh - 200px)' }}>
      <div className="space-y-4">
        {messages.length > 0 && (
          <div className={`flex ${messages[messages.length - 1].type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={clsx(
                "max-w-[80%] rounded-2xl px-4 py-2",
                messages[messages.length - 1].type === 'user'
                  ? 'bg-violet text-white'
                  : messages[messages.length - 1].type === 'error'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-900'
              )}
            >
              {(() => {
                const lastMessage = messages[messages.length - 1]
                if (!lastMessage?.content) return null

                if (lastMessage.type === 'user') {
                  return lastMessage.content
                }

                const content = lastMessage.content

                if (typeof content === 'string') {
                  return content
                }

                if (typeof content === 'object' && content !== null) {
                  return (
                    <div className="space-y-4">
                      {content.output?.output && (
                        <div className="whitespace-pre-wrap text-sm">
                          {content.output.output}
                        </div>
                      )}

                      {content.output?.component === 'channel' && Array.isArray(content.output.components_id) && (
                        <div className="w-full">
                          <ChatChannels channelIds={content.output.components_id} />
                        </div>
                      )}

                      {content.output?.component === 'article' && Array.isArray(content.output.components_id) && (
                        <div className="w-full">
                          <ChatArticles articleIds={content.output.components_id} />
                        </div>
                      )}
                    </div>
                  )
                }

                return (
                  <pre className="whitespace-pre-wrap text-sm">
                    {JSON.stringify(content, null, 2)}
                  </pre>
                )
              })()}
            </div>
          </div>
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 max-w-[80%] rounded-2xl px-4 py-2">
              <div className="flex gap-1">
                <span className="w-1 h-1 bg-gray-500 rounded-full animate-[blink_1s_ease-in-out_0s_infinite]"></span>
                <span className="w-1 h-1 bg-gray-500 rounded-full animate-[blink_1s_ease-in-out_0.2s_infinite]"></span>
                <span className="w-1 h-1 bg-gray-500 rounded-full animate-[blink_1s_ease-in-out_0.4s_infinite]"></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Home() {
  const [hasClickedInput, setHasClickedInput] = useState(false)
  const [hasSentMessage, setHasSentMessage] = useState(false)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [userId, setUserId] = useState(null)
  const [activeMode, setActiveMode] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id)
      }
    })
  }, [])

  useEffect(() => {
    setSessionId(uuidv4())
  }, [])

  useEffect(() => {
    if (location.state?.message) {
      handleMessageSend({ 
        content: location.state.message.text,
        body: location.state.message.body
      })
      // Clear the message from location state
      navigate('/', { replace: true })
    }
  }, [location])

  const handleMessageSend = async (message) => {
    if (!message.content?.trim() || !sessionId || !userId) return

    const userMessage = message.content.trim()
    setMessages(prev => [...prev, { type: 'user', content: userMessage }])
    setHasSentMessage(true)
    setLoading(true)

    try {
      let option = 'other'
      if (activeMode === 'brief') {
        option = 'summary'
      } else if (activeMode === 'deepdive') {
        option = 'deepsearch'
      } else if (userMessage.startsWith('/test')) {
        option = 'test'
      }

      const response = await fetch('n8nchatlink', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          action: 'sendMessage',
          option,
          prompt: userMessage, 
          ...(message.body || {}),
          user_id: userId
        })
      })

      const data = await response.text()
      let parsedContent
      try {
        parsedContent = JSON.parse(data)
        if (typeof parsedContent === 'object' && parsedContent !== null) {
          setMessages(prev => [...prev, { type: 'bot', content: parsedContent }])
        } else {
          const reparsed = JSON.parse(parsedContent)
          setMessages(prev => [...prev, { type: 'bot', content: reparsed }])
        }
      } catch (error) {
        console.error('Error parsing response:', error)
        setMessages(prev => [...prev, { type: 'bot', content: data }])
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        type: 'error',
        content: 'Désolé, une erreur est survenue.'
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative w-full h-screen bg-offwhite overflow-hidden">
      <MaskImages hasClickedInput={hasClickedInput} />
      <div className="absolute inset-0 overflow-y-auto">
      <InputSection
        onMessageSend={(message) => handleMessageSend(message)}
        hasSentMessage={hasSentMessage}
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        setHasClickedInput={setHasClickedInput}
        loading={loading}
      />

      <ChatDisplay messages={messages} loading={loading} />
      </div>
    </div>
  )
}

export default Home

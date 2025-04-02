import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Home from './pages/Home'
import Sidebar from './components/Sidebar'
import MyMonitoring from './pages/MyMonitoring'
import Sources from './pages/Sources'
import Collaborations from './pages/Collaborations'
import Notifications from './pages/Notifications'
import Settings from './pages/Settings'
import Login from './pages/Login'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet"></div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen">
        {!session ? (
          <Login />
        ) : (
          <div className="min-h-screen">
            <Sidebar />
            <main className="p-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/feeds" element={<MyMonitoring />} />
                <Route path="/sources" element={<Sources />} />
                <Route path="/collaborations" element={<Collaborations />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
        )}
      </div>
    </Router>
  )
}

export default App
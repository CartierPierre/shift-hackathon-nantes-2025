import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

function Settings() {
  const [user, setUser] = useState(null)
  const [fullName, setFullName] = useState('')
  const [preferences, setPreferences] = useState({
    email_notifications: false
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const fetchUserAndPreferences = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      
      setUser(user)
      setFullName(user?.user_metadata?.full_name || '')
      
      try {
        // First try to get existing preferences
        let { data: prefs, error } = await supabase
          .from('preferences')
          .select('*')
          .eq('user_id', user.id)

        if (error) {
          console.error('Error checking preferences:', error)
          return
        }

        // If no preferences exist, create them
        if (!prefs || prefs.length === 0) {
          const { data: newPrefs, error: insertError } = await supabase
            .from('preferences')
            .insert({ user_id: user.id })
            .select()

          if (insertError) {
            if (insertError.code === '23505') {
              // If we get a duplicate key error, try fetching again
              const { data: retryPrefs, error: retryError } = await supabase
                .from('preferences')
                .select('*')
                .eq('user_id', user.id)

              if (!retryError && retryPrefs?.length > 0) {
                setPreferences(retryPrefs[0])
              }
            } else {
              console.error('Error creating preferences:', insertError)
            }
          } else if (newPrefs?.length > 0) {
            setPreferences(newPrefs[0])
          }
        } else {
          // Use existing preferences
          setPreferences(prefs[0])
        }
      } catch (error) {
        console.error('Error in preferences setup:', error)
      }
    }

    fetchUserAndPreferences()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      })

      if (error) throw error
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès' })
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleEmailNotifications = async () => {
    try {
      const newValue = !preferences.email_notifications
      
      const { error } = await supabase
        .from('preferences')
        .update({ 
          email_notifications: newValue,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

      if (error) throw error

      setPreferences(prev => ({
        ...prev,
        email_notifications: newValue
      }))

      setMessage({ type: 'success', text: 'Préférences mises à jour avec succès' })
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Paramètres</h1>
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Profil</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {message && (
              <div className={`p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-red-50 text-red-700'
              }`}>
                {message.text}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Nom</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-violet focus:ring-1 focus:ring-violet"
                placeholder="Votre nom"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <div className="w-full px-4 py-2 rounded-lg bg-gray-50 text-gray-500">
                {user?.email}
              </div>
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="bg-violet text-white px-6 py-2 rounded-lg hover:bg-violet-600 transition disabled:opacity-50"
            >
              {loading ? 'Enregistrement...' : 'Sauvegarder'}
            </button>
          </form>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Préférences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Notifications par email</span>
              <button
                onClick={handleToggleEmailNotifications}
                className={`w-12 h-6 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-violet ${
                  preferences.email_notifications ? 'bg-violet' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`block w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                    preferences.email_notifications ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
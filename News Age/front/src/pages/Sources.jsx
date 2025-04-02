import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, ExternalLink, ChevronLeft } from 'lucide-react'
import SourceModal from '../components/SourceModal'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

function Sources() {
  const [sources, setSources] = useState([])
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false)
  const [sourceToEdit, setSourceToEdit] = useState(null)
  const [sourceToDelete, setSourceToDelete] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Get the current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    fetchSources()
  }, [])

  const fetchSources = async () => {
    try {
      const { data, error } = await supabase
        .from('sources')
        .select('*')

      if (error) throw error

      setSources(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Calculate source statistics
  const totalSources = sources.length
  const sourcesWithNotes = sources.filter(source => source.notes?.trim()).length

  const handleSaveSource = async (source) => {
    try {
      if (!user) throw new Error('User not authenticated')

      if (source.id) {
        const { error } = await supabase
          .from('sources')
          .update({
            name: source.name,
            description: source.description,
            url: source.url,
            notes: source.notes,
            user_id: user.id
          })
          .eq('id', source.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('sources')
          .insert({
            name: source.name,
            description: source.description,
            url: source.url,
            notes: source.notes,
            user_id: user.id
          })

        if (error) throw error
      }

      await fetchSources()
    } catch (error) {
      console.error('Error saving source:', error)
    }
  }

  const handleDeleteSource = async (sourceId) => {
    try {
      const { error } = await supabase
        .from('sources')
        .delete()
        .eq('id', sourceId)

      if (error) throw error

      await fetchSources()
    } catch (error) {
      console.error('Error deleting source:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        Une erreur est survenue: {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-violet transition"
          >
            <ChevronLeft size={20} />
            <span>Retour au chat</span>
          </button>
          <h1 className="text-3xl font-bold">Mes Refs</h1>
        </div>
        <button
          onClick={() => setIsSourceModalOpen(true)}
          className="bg-violet-dark text-white px-4 py-2 rounded-lg hover:bg-violet-darker shadow-md hover:shadow-violet/20 transition flex items-center gap-2"
        >
          <Plus size={20} />
          Nouvelle Source
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Mes Sources</h2>
          <span className="text-sm text-gray-600">
            {totalSources} élément{totalSources !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="space-y-4">
          {sources.map((source) => (
            <div key={source.id} className="flex items-center justify-between p-4 bg-offwhite rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-violet rounded-full flex items-center justify-center text-white">
                  {source.name.split(' ').map(word => word[0]).join('').toUpperCase()}
                </div>
                <div>
                  <h3 className="font-medium">{source.name}</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600">{source.description}</p>
                    {source.notes?.trim() && (
                      <span className="px-2 py-0.5 bg-violet/10 text-violet rounded-full text-xs">
                        Note
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-violet transition rounded-full hover:bg-violet/5"
                  >
                    <ExternalLink size={18} />
                  </a>
                )}
                <button
                  onClick={() => setSourceToEdit(source)}
                  className="p-2 text-gray-400 hover:text-violet transition rounded-full hover:bg-violet/5"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => setSourceToDelete(source)}
                  className="p-2 text-gray-400 hover:text-red-600 transition rounded-full hover:bg-red-50"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SourceModal
        isOpen={isSourceModalOpen || !!sourceToEdit}
        onClose={() => {
          setIsSourceModalOpen(false)
          setSourceToEdit(null)
        }}
        onSave={handleSaveSource}
        source={sourceToEdit}
      />

      <DeleteConfirmationModal
        isOpen={!!sourceToDelete}
        onClose={() => setSourceToDelete(null)}
        onConfirm={() => handleDeleteSource(sourceToDelete.id)}
        title="Supprimer la source"
        message={`Êtes-vous sûr de vouloir supprimer la source "${sourceToDelete?.name}" ? Cette action est irréversible.`}
      />
    </div>
  )
}

export default Sources
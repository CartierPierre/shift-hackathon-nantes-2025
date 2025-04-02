import { useState, useEffect } from 'react'
import { Plus, ChevronLeft, Maximize2, Pencil, Trash2, RefreshCw } from 'lucide-react'
import ArticleModal from '../components/ArticleModal'
import NewChannelModal from '../components/NewChannelModal'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'
import { supabase } from '../lib/supabase'

function MyMonitoring() {
  const [selectedChannel, setSelectedChannel] = useState(null)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [isNewChannelModalOpen, setIsNewChannelModalOpen] = useState(false)
  const [channelToDelete, setChannelToDelete] = useState(null)
  const [channelToEdit, setChannelToEdit] = useState(null)
  const [monitorings, setMonitorings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    // Get the current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    fetchChannels()
  }, [])

  const handleUpdate = async () => {
    if (!user) return
    
    setUpdating(true)
    try {
      const payload = {
        user_id: user.id,
        channels: monitorings.map(channel => ({
          id: channel.id,
          prompt: channel.prompt,
          description: channel.description || '',
          tags: channel.tags
        })),
        sources: [] // We'll fetch sources separately
      }

      // Fetch sources
      const { data: sources, error: sourcesError } = await supabase
        .from('sources')
        .select('name, description, url, notes')

      if (sourcesError) throw sourcesError

      payload.sources = sources.map(source => ({
        name: source.name,
        description: source.description || '',
        url: source.url,
        notes: source.notes || ''
      }))

      const response = await fetch('https://www.n8n-dev.meetmagnet.fr/webhook/start-scraping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) throw new Error('Failed to trigger update')

    } catch (error) {
      console.error('Error triggering update:', error)
      setError('Erreur lors de la mise à jour')
    } finally {
      setUpdating(false)
    }
  }

  const fetchChannels = async () => {
    try {
      const { data: channels, error: channelsError } = await supabase
        .from('channels')
        .select(`
          id,
          name,
          prompt,
          description,
          tags,
          articles (
            id,
            created_at,
            url,
            pourquoi,
            resume,
            img,
            date_article,
            auteur,
            acteurs,
            source,
            thematique
          )
        `)

      if (channelsError) throw channelsError

      setMonitorings(channels)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    setSelectedChannel(null)
  }

  const handleOpenArticle = (article) => {
    setSelectedArticle(article)
  }

  const handleCloseArticle = () => {
    setSelectedArticle(null)
  }

  const handleCreateChannel = async (newChannel) => {
    try {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('channels')
        .insert({
          name: newChannel.name,
          prompt: newChannel.prompt,
          description: newChannel.description || null,
          tags: newChannel.tags,
          user_id: user.id
        })
        .select()

      if (error) throw error

      await fetchChannels()
    } catch (error) {
      console.error('Error creating channel:', error)
    }
  }

  const handleEditChannel = async (updatedChannel) => {
    try {
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('channels')
        .update({
          name: updatedChannel.name,
          prompt: updatedChannel.prompt,
          description: updatedChannel.description,
          tags: updatedChannel.tags,
          user_id: user.id
        })
        .eq('id', updatedChannel.id)

      if (error) throw error

      await fetchChannels()
    } catch (error) {
      console.error('Error updating channel:', error)
    }
  }

  const handleDeleteChannel = async (channelId) => {
    try {
      const { error } = await supabase
        .from('channels')
        .delete()
        .eq('id', channelId)

      if (error) throw error

      await fetchChannels()
    } catch (error) {
      console.error('Error deleting channel:', error)
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
      {selectedChannel ? (
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-4 flex-1">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-violet transition"
            >
              <ChevronLeft size={20} />
              <span>Retour aux canaux</span>
            </button>
            <div className="flex items-center text-gray-400">
              <span>Mes Feeds</span>
              <span className="mx-2">•</span>
              <span className="text-navy font-medium">{selectedChannel.name}</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 max-w-xs">
            <h3 className="font-medium text-lg">{selectedChannel.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{selectedChannel.description}</p>
            <div className="flex gap-2 mt-2">
              {selectedChannel.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-violet/10 text-violet text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Mes Feeds</h1>
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              disabled={updating}
              className="bg-violet-dark text-white px-4 py-2 rounded-lg hover:bg-violet-darker shadow-md hover:shadow-violet/20 transition flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw size={20} className={updating ? 'animate-spin' : ''} />
              Mise à jour
            </button>
            <button
              onClick={() => setIsNewChannelModalOpen(true)}
              className="bg-violet-dark text-white px-4 py-2 rounded-lg hover:bg-violet-darker shadow-md hover:shadow-violet/20 transition flex items-center gap-2"
            >
              <Plus size={20} />
              Nouveau Canal
            </button>
          </div>
        </div>
      )}

      {selectedChannel && <h1 className="text-3xl font-bold mb-6">Articles</h1>}

      {selectedChannel ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedChannel.articles.map((article) => (
            <button
              key={article.id}
              onClick={() => handleOpenArticle(article)}
              className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition relative text-left"
            >
              {article.img && (
                <img 
                  src={article.img} 
                  alt={article.pourquoi || 'Article image'} 
                  className="w-full h-48 object-cover" 
                />
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-gray-600">{article.source}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="text-sm text-gray-600">
                    {new Date(article.date_article).toLocaleDateString()}
                  </span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  {article.url && (
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-violet hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Voir l'article
                    </a>
                  )}
                  <div className="flex gap-1">
                    <span
                      className="px-2 py-0.5 bg-violet/10 text-violet text-xs rounded-full"
                    >
                      {article.thematique}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{article.pourquoi || 'Sans titre'}</h3>
                {/* <p className="text-gray-600 line-clamp-3">
                  {article.resume || 'Aucun résumé disponible'}
                </p> */}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {monitorings.map((monitoring) => (
            <button
              key={monitoring.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition text-left"
            >
              <div
                className="p-6 cursor-pointer"
                onClick={() => setSelectedChannel(monitoring)}
              >
                <h3 className="text-xl font-semibold mb-2">{monitoring.name}</h3>
                <p className="text-gray-600 line-clamp-2 mb-4">
                  {monitoring.prompt}
                </p>
                <div className="flex flex-wrap gap-2">
                  {monitoring.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-violet/10 text-violet rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-end gap-2 mt-4 border-t pt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setChannelToEdit(monitoring)
                    }}
                    className="p-2 text-gray-400 hover:text-violet transition rounded-full hover:bg-violet/5"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setChannelToDelete(monitoring)
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 transition rounded-full hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
      
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          isOpen={!!selectedArticle}
          onClose={handleCloseArticle}
        />
      )}

      <NewChannelModal
        isOpen={isNewChannelModalOpen}
        onClose={() => setIsNewChannelModalOpen(false)}
        onCreateChannel={handleCreateChannel}
      />

      <NewChannelModal
        isOpen={!!channelToEdit}
        onClose={() => setChannelToEdit(null)}
        onCreateChannel={handleEditChannel}
        initialChannel={channelToEdit}
      />

      <DeleteConfirmationModal
        isOpen={!!channelToDelete}
        onClose={() => setChannelToDelete(null)}
        onConfirm={() => handleDeleteChannel(channelToDelete.id)}
        title="Supprimer le canal"
        message={`Êtes-vous sûr de vouloir supprimer le canal "${channelToDelete?.name}" ? Cette action est irréversible.`}
      />
    </div>
  )
}

export default MyMonitoring
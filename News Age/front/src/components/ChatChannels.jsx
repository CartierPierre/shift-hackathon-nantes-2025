import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { ChannelCard } from './GenericComponents'
import NewChannelModal from './NewChannelModal'
import DeleteConfirmationModal from './DeleteConfirmationModal'
import { useNavigate } from 'react-router-dom'

function ChatChannels({ channelIds }) {
  const [channels, setChannels] = useState([])
  const [loading, setLoading] = useState(true)
  const [channelToEdit, setChannelToEdit] = useState(null)
  const [channelToDelete, setChannelToDelete] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const { data, error } = await supabase
          .from('channels')
          .select('*')
          .in('id', channelIds)

        if (error) throw error
        setChannels(data)
      } catch (error) {
        console.error('Error fetching channels:', error)
      } finally {
        setLoading(false)
      }
    }

    if (channelIds?.length > 0) {
      fetchChannels()
    }
  }, [channelIds])

  const handleEditChannel = async (updatedChannel) => {
    try {
      const { error } = await supabase
        .from('channels')
        .update({
          name: updatedChannel.name,
          prompt: updatedChannel.prompt,
          description: updatedChannel.description,
          tags: updatedChannel.tags,
        })
        .eq('id', updatedChannel.id)

      if (error) throw error

      // Refresh channels list
      const { data, error: fetchError } = await supabase
        .from('channels')
        .select('*')
        .in('id', channelIds)

      if (fetchError) throw fetchError
      setChannels(data)
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

      setChannels(channels.filter(c => c.id !== channelId))
    } catch (error) {
      console.error('Error deleting channel:', error)
    }
  }

  const handleSelectChannel = (channel) => {
    // Send message to chat with channel_id in body
    const message = {
      text: `Utilise le canal ${channel.name} pour chercher des articles`,
      body: {
        channel_id: channel.id
      }
    }
    navigate('/', { state: { message } })
  }

  if (loading) {
    return <div className="animate-pulse space-y-4">
      {[...Array(channelIds?.length || 0)].map((_, i) => (
        <div key={i} className="h-40 bg-gray-200 rounded-xl"></div>
      ))}
    </div>
  }

  return (
    <div className="space-y-4">
      {channels.map(channel => (
        <ChannelCard
          key={channel.id}
          channel={channel}
          onSelect={handleSelectChannel}
          onEdit={setChannelToEdit}
          onDelete={setChannelToDelete}
        />
      ))}

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

export default ChatChannels
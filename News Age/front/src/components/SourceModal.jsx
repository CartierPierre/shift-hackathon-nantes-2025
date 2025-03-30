import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useState, useEffect } from 'react'

function SourceModal({ isOpen, onClose, onSave, source = null }) {
  const [name, setName] = useState(source?.name || '')
  const [description, setDescription] = useState(source?.description || '')
  const [url, setUrl] = useState(source?.url || '')
  const [notes, setNotes] = useState(source?.notes || '')

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setName(source?.name || '')
      setDescription(source?.description || '')
      setUrl(source?.url || '')
      setNotes(source?.notes || '')
    }
  }, [isOpen, source])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      id: source?.id,
      name,
      description,
      url,
      notes,
      initials: name.split(' ').map(word => word[0]).join('').toUpperCase()
    })
    onClose()
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-2xl font-semibold">
              {source ? 'Modifier la source' : 'Nouvelle source'}
            </Dialog.Title>
            <Dialog.Close className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL du site
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-32 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent resize-none"
                placeholder="Notes personnelles sur cette source..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-violet-dark text-white px-4 py-2 rounded-lg hover:bg-violet-darker shadow-md hover:shadow-violet/20 transition"
            >
              {source ? 'Modifier' : 'Ajouter'}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default SourceModal
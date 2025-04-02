import * as Dialog from '@radix-ui/react-dialog'
import { X, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRef } from 'react'

function NewChannelModal({ isOpen, onClose, onCreateChannel, initialChannel = null }) {
  const [name, setName] = useState(initialChannel?.name || '')
  const [prompt, setPrompt] = useState(initialChannel?.prompt || '')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState(initialChannel?.tags || [])
  const [modalHeight, setModalHeight] = useState('85vh')
  const tagInputRef = useRef(null)
  const resizeRef = useRef(null)
  const modalRef = useRef(null)

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setName(initialChannel?.name || '')
      setPrompt(initialChannel?.prompt || '')
      setTags(initialChannel?.tags || [])
      setTagInput('')
    }
  }, [isOpen, initialChannel])

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setName(initialChannel?.name || '')
      setPrompt(initialChannel?.prompt || '')
      setTags(initialChannel?.tags || [])
      setTagInput('')
    }
  }, [isOpen, initialChannel])

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name && prompt && tags.length > 0) {
      onCreateChannel({
        id: initialChannel?.id,
        name,
        prompt,
        tags,
        articles: initialChannel?.articles || [], // Keep existing articles or start empty
      })
      setName('')
      setPrompt('')
      setTags([])
      onClose()
    }
  }

  const handleMouseDown = (e) => {
    e.preventDefault()
    const startY = e.clientY
    const startHeight = resizeRef.current.clientHeight

    const handleMouseMove = (e) => {
      const delta = e.clientY - startY
      const newHeight = Math.max(100, startHeight + delta)
      resizeRef.current.style.height = `${newHeight}px`
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <Dialog.Content 
          ref={modalRef}
          style={{ maxHeight: modalHeight }}
          className="fixed top-[50%] left-[50%] w-[90vw] max-w-[800px] translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white p-6 shadow-xl overflow-hidden flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-2xl font-semibold">
              {initialChannel ? 'Modifier le canal' : 'Nouveau Canal'}
            </Dialog.Title>
            <Dialog.Close className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 flex-1 overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du canal
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Veille Tech"
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prompt de veille
              </label>
              <div className="relative">
                <textarea
                  ref={resizeRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Décrivez le type de contenu que vous souhaitez suivre..."
                  className="w-full h-48 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent resize-y"
                  required
                />
                <div
                  className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize bg-transparent hover:bg-violet/10 transition-colors"
                  onMouseDown={handleMouseDown}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-3 flex-wrap">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-violet/10 text-violet rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-violet/60 hover:text-violet"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  ref={tagInputRef}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="Ajouter un tag"
                  className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => handleAddTag()}
                  className="bg-violet-dark text-white px-4 py-2 rounded-lg hover:bg-violet-darker shadow-md hover:shadow-violet/20 transition flex items-center gap-2"
                >
                  <Plus size={20} />
                  Ajouter
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-violet-dark text-white px-4 py-2 rounded-lg hover:bg-violet-darker shadow-md hover:shadow-violet/20 transition"
            >
              {initialChannel ? 'Modifier' : 'Créer le canal'}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default NewChannelModal
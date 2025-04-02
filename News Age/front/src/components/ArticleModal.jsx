import * as Dialog from '@radix-ui/react-dialog'
import { X, MessageSquare, Bookmark, Share2 } from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'

function ArticleModal({ article, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('summary')
  const [note, setNote] = useState('')
  const [question, setQuestion] = useState('')
  const [aiResponse, setAiResponse] = useState('')

  const handleAskQuestion = () => {
    // Simulate AI response - replace with actual AI integration
    setAiResponse('Je suis désolé, mais je ne peux pas répondre à votre question pour le moment. La fonctionnalité de chat IA sera bientôt disponible.')
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[95vh] w-[98vw] max-w-[1200px] translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white shadow-xl flex">
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-6">
                <Dialog.Title className="sr-only">{article.title}</Dialog.Title>
                {article.img && (
                  <img
                    src={article.img}
                    alt={article.resume || 'Article image'}
                    className="w-48 h-32 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h2 className="text-2xl font-semibold">{article.pourquoi || 'Sans résumé'}</h2>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                    <span>{article.source}</span>
                    {article.url && (
                      <>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span>{new Date(article.date_article).toLocaleDateString()}</span>
                      </>
                    )}
                    {article.url && (
                      <>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-violet hover:underline"
                        >
                          Lire l'article complet
                        </a>
                      </>
                    )}
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <div className="flex gap-1">
                      <span
                        className="px-2 py-0.5 bg-violet/10 text-violet rounded-full"
                      >
                        {article.thematique}
                      </span>
                      {article.acteurs?.map((acteur, index) => typeof acteur === 'object' ? (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-violet/10 text-violet rounded-full"
                        >
                          {acteur.name}
                        </span>
                      ) : (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-violet/10 text-violet rounded-full"
                        >
                          {acteur}
                        </span>
                      ))}
                    </div>
                  </div>
                  {article.source && (
                    <div className="mt-2 text-sm text-gray-500">
                      Sources: {Array.isArray(article.source) 
                        ? article.source.map(s => typeof s === 'object' ? s.name : s).join(', ')
                        : typeof article.source === 'object' 
                          ? article.source.name 
                          : article.source}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: article.pourquoi || 'Article partagé',
                        text: article.resume || '',
                        url: window.location.href,
                      }).catch((error) => console.log('Error sharing:', error));
                    } else {
                      navigator.clipboard.writeText(window.location.href)
                        .then(() => alert('Lien copié dans le presse-papier !'))
                        .catch((error) => console.log('Error copying:', error));
                    }
                  }}
                  className="text-[#A284BF] hover:text-[#A360A2] transition"
                >
                  <Share2 size={20} />
                </button>
                <Dialog.Close className="text-[#A284BF] hover:text-[#A360A2]">
                  <X size={24} />
                </Dialog.Close>
              </div>
            </div>

            <div className="flex gap-4 border-b mb-6">
              <button
                onClick={() => setActiveTab('summary')}
                className={clsx(
                  'px-4 py-2 font-medium transition-colors',
                  activeTab === 'summary'
                    ? 'text-violet border-b-2 border-violet'
                    : 'text-gray-600 hover:text-violet'
                )}
              >
                Résumé
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={clsx(
                  'px-4 py-2 font-medium transition-colors flex items-center gap-2',
                  activeTab === 'notes'
                    ? 'text-violet border-b-2 border-violet'
                    : 'text-gray-600 hover:text-violet'
                )}
              >
                <Bookmark size={18} />
                Notes personnelles
              </button>
            </div>

            <div className="overflow-y-auto">
              {activeTab === 'summary' && (
                <div className="prose max-w-none">
                  <p className="text-gray-600">{article.resume || 'Aucune explication disponible'}</p>
                </div>
              )}

              {activeTab === 'notes' && (
                <div>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ajoutez vos notes personnelles ici..."
                    className="w-full h-32 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent resize-none"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="w-80 border-l bg-gray-50 p-6">
            <div className="sticky top-0">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <MessageSquare size={18} />
                Chat IA
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Posez une question sur cet article..."
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
                  />
                  <button
                    onClick={handleAskQuestion}
                    className="bg-violet-dark text-white px-4 py-2 rounded-lg hover:bg-violet-darker shadow-md hover:shadow-violet/20 transition"
                  >
                    Envoyer
                  </button>
                </div>
                {aiResponse && (
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-gray-600">{aiResponse}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default ArticleModal
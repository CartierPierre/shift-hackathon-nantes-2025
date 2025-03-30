import { Pencil, Trash2, ExternalLink } from 'lucide-react'
import clsx from 'clsx'
import ArticleModal from './ArticleModal'
import { useState } from 'react'

export function ChannelCard({ channel, onSelect, onEdit, onDelete }) {
  return (
    <button className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition text-left w-full">
      <div
        className="p-6 cursor-pointer"
        onClick={() => onSelect?.(channel)}
      >
        <h3 className="text-xl font-semibold mb-2">{channel.name}</h3>
        <p className="text-gray-600 line-clamp-2 mb-4">
          {channel.prompt}
        </p>
        <div className="flex flex-wrap gap-2">
          {channel.tags.map((tag) => (
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
              onEdit?.(channel)
            }}
            className="p-2 text-gray-400 hover:text-violet transition rounded-full hover:bg-violet/5"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete?.(channel)
            }}
            className="p-2 text-gray-400 hover:text-red-600 transition rounded-full hover:bg-red-50"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </button>
  )
}

export function ArticleCard({ article, onClick }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition relative text-left w-full"
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
              className="text-sm text-violet hover:underline flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={14} />
              Voir l'article
            </a>
          )}
        </div>
        <div className="flex gap-1 mb-3">
          <span className={clsx(
            "px-2 py-0.5 bg-violet/10 text-violet text-xs rounded-full"
          )}>
            {article.thematique}
          </span>
        </div>
        <h3 className="text-xl font-semibold mb-2">{article.pourquoi || 'Sans titre'}</h3>
        <p className="text-gray-600 line-clamp-3">
          {article.resume || 'Aucun résumé disponible'}
        </p>
      </div>
      </button>

      <ArticleModal
        article={article}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
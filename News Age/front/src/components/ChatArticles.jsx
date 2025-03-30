import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { ArticleCard } from './GenericComponents'

function ChatArticles({ articleIds }) {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .in('id', articleIds)

        if (error) throw error
        setArticles(data)
      } catch (error) {
        console.error('Error fetching articles:', error)
      } finally {
        setLoading(false)
      }
    }

    if (articleIds?.length > 0) {
      fetchArticles()
    }
  }, [articleIds])

  if (loading) {
    return <div className="animate-pulse space-y-4">
      {[...Array(articleIds?.length || 0)].map((_, i) => (
        <div key={i} className="h-40 bg-gray-200 rounded-xl"></div>
      ))}
    </div>
  }

  return (
    <div className="space-y-4">
      {articles.map(article => (
        <ArticleCard
          key={article.id}
          article={article}
        />
      ))}
    </div>
  )
}

export default ChatArticles
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { getMoodByDay } from '../models/mood-model'

type Bindings = {
  USERNAME: string
  PASSWORD: string
}

const api_mood = new Hono<{ Bindings: Bindings }>()
api_mood.use('/moods/*', cors())

api_mood.get('/moods', async (c) => {
  const moods = await getMoodByDay()
  return c.json({ moods: moods }, 200)
})

export default api_mood
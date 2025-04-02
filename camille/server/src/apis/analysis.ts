import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { getAnalysis } from '../models/analyse-model'

type Bindings = {
  USERNAME: string
  PASSWORD: string
}

const api_analysis = new Hono<{ Bindings: Bindings }>()
api_analysis.use('/analysis/*', cors())

api_analysis.get('/analysis', async (c) => {
  const analysis = await getAnalysis()
  return c.json({ analysis: analysis }, 200)
})

export default api_analysis
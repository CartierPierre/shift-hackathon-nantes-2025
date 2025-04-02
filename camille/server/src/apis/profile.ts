import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { getLastProfile, postProfile } from '../models/profile-model'

type Bindings = {
  USERNAME: string
  PASSWORD: string
}

const api_profile = new Hono<{ Bindings: Bindings }>()
api_profile.use('/profiles/*', cors())

api_profile.get('/profile', async (c) => {
  const lastprofile = await getLastProfile()
  return c.json({ profile: lastprofile }, 200)
})

export default api_profile
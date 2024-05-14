import fastify from 'fastify'
import cookie from '@fastify/cookie'
import websocket from '@fastify/websocket'

import { createPoll } from './routes/create-poll'
import { getPoll } from './routes/get-poll'
import { voteOnPoll } from './routes/vote-on-poll'
import { pollResults } from './ws/poll-results'

const port = Number(process.env.PORT) || 3333

const app = fastify()
app.register(cookie, {
  secret: "polls-app-nlw",
  hook: "onRequest",
})

app.register(websocket)

app.register(createPoll)
app.register(getPoll)
app.register(voteOnPoll)

app.register(pollResults)

app.listen({host: '0.0.0.0' , port: port}).then(() => {
  console.log('HTTP server running! 🚀')  
})

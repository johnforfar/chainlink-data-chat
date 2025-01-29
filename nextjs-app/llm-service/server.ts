import express, { Request, Response } from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.LLM_PORT || 8080
const HOST = process.env.LLM_HOST || '0.0.0.0'

// Add health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' })
})

app.post('/completion', async (req: Request, res: Response) => {
  const { prompt } = req.body
  console.log('Received prompt:', prompt)
  
  // TODO: Add actual LLM integration
  // For now, return a mock response
  const mockResponse = {
    content: `This is a mock response to: ${prompt} - Solana is liiife`
  }
  
  res.json(mockResponse)
})

app.listen(parseInt(PORT as string), HOST, () => {
  console.log(`LLM service listening on ${HOST}:${PORT}`)
})

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
}); 
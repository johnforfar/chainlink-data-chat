import express, { Request, Response } from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.LLM_PORT || 8080

app.post('/completion', async (req: Request, res: Response) => {
  const { prompt } = req.body
  console.log('Received prompt:', prompt)
  
  // TODO: Add actual LLM integration
  // For now, return a mock response
  const mockResponse = {
    content: `This is a mock response to: ${prompt}`
  }
  
  res.json(mockResponse)
})

app.listen(PORT, () => {
  console.log(`LLM service listening on port ${PORT}`)
}) 
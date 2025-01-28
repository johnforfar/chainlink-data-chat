import axios from 'axios'

interface LLMConfig {
  temperature?: number
  maxTokens?: number
}

export class LLMClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.LLM_SERVICE_URL || 'http://localhost:8080'
  }

  async generate(prompt: string, config: LLMConfig = {}) {
    const response = await axios.post(`${this.baseUrl}/completion`, {
      prompt: `\u0000${prompt}\u0000`,
      temperature: config.temperature ?? 0.6,
      max_tokens: config.maxTokens ?? 200,
    })
    
    return response.data.content
  }
} 
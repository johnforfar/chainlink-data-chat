import { LLMClient } from './llm-client'

const llm = new LLMClient()

export async function createEmbedding(text: string): Promise<number[]> {
  try {
    const response = await llm.generate(`Convert to embedding: ${text}`)
    const embedding = JSON.parse(response)
    return Array.isArray(embedding) ? embedding : new Array(384).fill(0)
  } catch (error) {
    console.error('Embedding failed:', error)
    return new Array(384).fill(0)
  }
} 
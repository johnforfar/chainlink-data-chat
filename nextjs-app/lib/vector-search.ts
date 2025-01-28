import { Client } from 'pg'
import { Console } from 'console'
import { createEmbedding } from '@/lib/embeddings'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      POSTGRES_HOST: string
      POSTGRES_PORT: string
      POSTGRES_USER: string
      POSTGRES_PASSWORD: string
      POSTGRES_DB: string
    }
  }
}

export class VectorSearch {
  private client: Client
  private logger: Console

  constructor() {
    this.client = new Client({
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB || 'chainlink_data'
    })
    this.logger = new Console({
      stdout: process.stdout,
      stderr: process.stderr,
    })
  }

  async connect() {
    await this.client.connect()
  }

  async disconnect() {
    await this.client.end()
  }

  async search(query: string, limit: number = 5) {
    this.logger.log(`Searching for: "${query}" with limit ${limit}`)
    const embedding = await createEmbedding(query)
    
    const result = await this.client.query(`
      SELECT data, 1 - (embedding <=> $1) AS similarity
      FROM price_feeds
      ORDER BY embedding <=> $1
      LIMIT $2
    `, [embedding, limit])
    
    this.logger.log(`Found ${result.rows.length} results`)
    return result.rows
  }
} 
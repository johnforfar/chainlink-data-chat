import { NextResponse } from "next/server"
import { LLMClient } from "@/lib/llm-client"

const llm = new LLMClient()

export async function POST(request: Request) {
  try {
    const { message } = await request.json()
    console.log("Received chat request:", message)

    const response = await llm.generate(message)
    console.log("LLM response:", response)

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error processing chat request:", error)
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
} 
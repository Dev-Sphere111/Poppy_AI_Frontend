import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, category } = await req.json()

  // Prepare system message based on selected category
  let systemMessage = "You are SearchBot, a helpful AI assistant that can search the web for information."

  if (category) {
    const categoryMap: Record<string, string> = {
      web: "general web search",
      companies: "information about companies, their profiles, history, and business details",
      linkedin: "professional profiles similar to LinkedIn, including work history and skills",
      twitter: "social media posts and trends similar to Twitter/X",
      news: "recent news articles and events",
      images: "image search results (describe images)",
      videos: "video content (describe videos)",
      academic: "academic papers and research",
    }

    systemMessage += ` The user has selected the "${categoryMap[category] || category}" category for their search.`
    systemMessage += ` Format your responses to highlight information relevant to this category.`
  }

  // Add instructions for simulating search results
  systemMessage += " For this demo, simulate search results based on the query and selected category."
  systemMessage += " Include 3-5 relevant results with titles and brief descriptions."

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    system: systemMessage,
  })

  return result.toDataStreamResponse()
}

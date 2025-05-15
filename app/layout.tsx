import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "../app/components/theme-provider"
import { ChatProvider } from "./ChatBotContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "SearchBot - Category-Based Web Search",
  description: "AI-powered chatbot with category-based web search capabilities",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
         <ChatProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        </ChatProvider>
      </body>
    </html>
  )
}

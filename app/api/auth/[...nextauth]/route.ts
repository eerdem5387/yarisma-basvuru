import { handlers } from "@/lib/auth"
import { NextRequest } from "next/server"

// Wrapper function to handle errors gracefully
async function handleAuthRequest(
  handler: (req: NextRequest) => Promise<Response>,
  req: NextRequest
): Promise<Response> {
  try {
    return await handler(req)
  } catch (error) {
    console.error('NextAuth handler error:', error)
    
    // Production'da detaylı hata gösterme
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    // Error endpoint için özel handling
    if (req.nextUrl.pathname.includes('/error')) {
      return new Response(
        JSON.stringify({
          error: 'Authentication error',
          message: process.env.NODE_ENV === 'development' ? errorMessage : 'Bir hata oluştu'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    
    // Diğer endpoint'ler için
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? errorMessage : 'Bir hata oluştu'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

export async function GET(req: NextRequest) {
  return handleAuthRequest(handlers.GET, req)
}

export async function POST(req: NextRequest) {
  return handleAuthRequest(handlers.POST, req)
}

// Enable debug logging
if (process.env.NODE_ENV === 'development') {
  console.log('NextAuth handlers initialized')
  console.log('AUTH_SECRET:', process.env.AUTH_SECRET ? 'Set' : 'Missing')
  console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing')
  console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL)
}


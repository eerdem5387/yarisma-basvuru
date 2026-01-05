import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null // NextAuth için null döndürmek daha güvenli
          }

          const admin = await prisma.admin.findUnique({
            where: { email: credentials.email as string }
          })

          if (!admin) {
            return null // Güvenlik için aynı mesaj
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            admin.password
          )

          if (!isPasswordValid) {
            return null // Güvenlik için aynı mesaj
          }

          return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
          }
        } catch (error) {
          console.error("Auth error:", error)
          // Prisma hatalarını kontrol et
          if (error && typeof error === 'object' && 'code' in error) {
            if (error.code === 'P1001' || error.code === 'P1002') {
              console.error("Database connection error during auth")
            }
          }
          return null // Hata durumunda null döndür
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 saat
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  secret: (() => {
    const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
    if (!secret) {
      console.error('❌ CRITICAL: AUTH_SECRET or NEXTAUTH_SECRET is not set!')
      console.error('   Please set AUTH_SECRET or NEXTAUTH_SECRET in your environment variables.')
      console.error('   For Vercel: Go to Settings → Environment Variables')
      throw new Error('AUTH_SECRET or NEXTAUTH_SECRET must be set')
    }
    return secret
  })(),
  debug: process.env.NODE_ENV === 'development',
  trustHost: true, // Vercel için gerekli
})

// Secret kontrolü - development'ta uyarı ver
if (process.env.NODE_ENV === 'development' && !process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET) {
  console.warn('⚠️  UYARI: AUTH_SECRET veya NEXTAUTH_SECRET tanımlı değil!')
  console.warn('   .env.local dosyasına ekleyin:')
  console.warn('   AUTH_SECRET="your-secret-key-here"')
  console.warn('   veya şunu çalıştırın: npm run generate-secret')
}

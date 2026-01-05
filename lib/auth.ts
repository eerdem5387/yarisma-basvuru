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
            throw new Error("Email ve şifre gerekli")
          }

          const admin = await prisma.admin.findUnique({
            where: { email: credentials.email as string }
          })

          if (!admin) {
            throw new Error("Geçersiz email veya şifre")
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            admin.password
          )

          if (!isPasswordValid) {
            throw new Error("Geçersiz email veya şifre")
          }

          return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
          }
        } catch (error) {
          console.error("Auth error:", error)
          throw error
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
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
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


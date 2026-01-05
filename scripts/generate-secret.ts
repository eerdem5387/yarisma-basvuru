import { randomBytes } from 'crypto'

const secret = randomBytes(32).toString('base64')

console.log('\n🔑 AUTH_SECRET oluşturuldu:\n')
console.log(secret)
console.log('\nBu değeri .env.local dosyanızdaki AUTH_SECRET değişkenine ekleyin:')
console.log('\nAUTH_SECRET="' + secret + '"\n')
console.log('Not: NEXTAUTH_SECRET da kullanılabilir, ancak NextAuth v5 için AUTH_SECRET önerilir.\n')


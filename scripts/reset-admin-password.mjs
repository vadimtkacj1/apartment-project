/**
 * Reset admin password script
 * Usage: node scripts/reset-admin-password.mjs [username] [new_password]
 * Example: node scripts/reset-admin-password.mjs admin "$#@!SecurePassword2026"
 */

import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db'
console.log('📦 Database URL:', databaseUrl)

const adapter = new PrismaBetterSqlite3({ url: databaseUrl })
const prisma = new PrismaClient({ adapter })

const username = process.argv[2] || process.env.ADMIN_USERNAME || 'admin'
const newPassword = process.argv[3] || process.env.ADMIN_PASSWORD

if (!newPassword) {
  console.error('❌ Please provide a new password as the second argument.')
  console.error('   Usage: node scripts/reset-admin-password.mjs admin "YourNewPassword"')
  process.exit(1)
}

async function main() {
  const user = await prisma.user.findUnique({ where: { username } })

  if (!user) {
    console.error(`❌ User "${username}" not found in database.`)
    console.log('   Available users:')
    const all = await prisma.user.findMany({ select: { username: true, role: true } })
    all.forEach(u => console.log(`   - ${u.username} (${u.role})`))
    process.exit(1)
  }

  const hashed = await bcrypt.hash(newPassword, 10)
  await prisma.user.update({
    where: { username },
    data: { password: hashed },
  })

  console.log(`✅ Password for "${username}" updated successfully!`)
  console.log(`   You can now log in with: ${username} / ${newPassword}`)
}

main()
  .catch(e => {
    console.error('❌ Error:', e.message)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())


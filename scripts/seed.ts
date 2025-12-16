import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const schools = [
  { id: 'fau', name: 'Florida Atlantic University', logoUrl: '🦉' },
  { id: 'um', name: 'University of Miami', logoUrl: '🌴' },
  { id: 'uf', name: 'University of Florida', logoUrl: '🐊' },
  { id: 'fiu', name: 'Florida International University', logoUrl: '🔥' },
  { id: 'pbsc', name: 'Palm Beach State College', logoUrl: '📚' },
  { id: 'fsu', name: 'Florida State University', logoUrl: '⚡' },
  { id: 'ucf', name: 'University of Central Florida', logoUrl: '🛡️' },
  { id: 'usf', name: 'University of South Florida', logoUrl: '🐂' },
]

async function main() {
  console.log('Seeding schools...')

  for (const school of schools) {
    await prisma.school.upsert({
      where: { id: school.id },
      update: {},
      create: school,
    })
    console.log(`✓ Seeded school: ${school.name}`)
  }

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


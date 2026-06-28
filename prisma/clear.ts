import { PrismaClient } from "@prisma/client";

// Wipes all demo/real data so the admin panel starts empty.
// Documents and messages cascade-delete with their application.
// Run locally:  npm run db:clear
const prisma = new PrismaClient();

async function main() {
  const apps = await prisma.application.deleteMany({});
  const contacts = await prisma.contactMessage.deleteMany({});
  console.log(`Deleted ${apps.count} application(s) and ${contacts.count} contact message(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

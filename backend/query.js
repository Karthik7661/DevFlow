const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const members = await prisma.workspaceMember.findMany();
  console.log("All workspace members:", members);
  const users = await prisma.user.findMany();
  console.log("All users:", users);
}
main().catch(console.error).finally(() => prisma.$disconnect());

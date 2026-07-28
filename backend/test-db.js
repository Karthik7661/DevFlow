const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const messages = await prisma.message.findMany();
  console.log(messages);
  const notifications = await prisma.notification.findMany();
  console.log(notifications);
}
main().finally(() => prisma.$disconnect());

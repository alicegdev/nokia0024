import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const game1 = await prisma.game.upsert({
    where: { name: 'Snake' },
    update: {},
    create: { name: 'Snake' },
  });

  const game2 = await prisma.game.upsert({
    where: { name: 'Space Blast' },
    update: {},
    create: { name: 'Space Blast' },
  });

  const game3 = await prisma.game.upsert({
    where: { name: 'Breakout' },
    update: {},
    create: { name: 'Breakout' },
  });

  console.log('Trois jeux créés ou existants vérifiés :', game1, game2, game3);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

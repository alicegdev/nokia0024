import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const game1 = await prisma.game.create({
    data: {
      name: 'Snake',
    },
  });

  const game2 = await prisma.game.create({
    data: {
      name: 'Space Blast ',
    },
  });

  const game3 = await prisma.game.create({
    data: {
      name: 'Breakout',
    },
  });

  console.log('Trois jeux créés :', game1, game2, game3);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient, Match } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function seedMatches() {

  await prisma.match.deleteMany();

  try {
    console.log('Starting match seeding...');

    // Fetch all users
    const users = await prisma.user.findMany({
      select: { id: true },
    });

    if (users.length < 2) {
      console.error('Not enough users to create matches. At least 2 users are required.');
      return;
    }

    console.log(`Found ${users.length} users.`);

    // For each user, create at least 10 matches
    for (const user of users) {
      const userId = user.id;

      // Get existing matches for this user to avoid duplicates
      const existingMatches = await prisma.match.findMany({
        where: {
          OR: [
            { userId: userId },
            { matchedId: userId },
          ],
        },
        select: {
          userId: true,
          matchedId: true,
        },
      });

      // Extract user IDs that this user is already matched with
      const matchedUserIds = new Set(
        existingMatches.flatMap((match) => [
          match.userId === userId ? match.matchedId : match.userId,
        ])
      );

      // Exclude the user themselves and already matched users
      const availableUsers = users
        .filter((u) => u.id !== userId && !matchedUserIds.has(u.id))
        .map((u) => u.id);

      // Shuffle available users to randomize matches
      const shuffledUsers = availableUsers.sort(() => Math.random() - 0.5);

      // Determine how many matches to create (at least 10, or all available users if fewer)
      const matchesToCreate = Math.min(10, shuffledUsers.length);

      if (matchesToCreate < 10) {
        console.warn(
          `User ${userId} has only ${matchesToCreate} available users to match with.`
        );
      }

      // Explicitly type the matchPromises array
      const matchPromises: Promise<Match>[] = [];
      for (let i = 0; i < matchesToCreate; i++) {
        const matchedId = shuffledUsers[i];

        matchPromises.push(
          prisma.match.create({
            data: {
              userId: userId,
              matchedId: matchedId,
              createdAt: faker.date.recent(),
              updatedAt: faker.date.recent(),
            },
          })
        );
      }

      // Execute match creation in parallel
      await Promise.all(matchPromises);
      console.log(`Created ${matchesToCreate} matches for user ${userId}.`);
    }

    console.log('Match seeding completed successfully.');
  } catch (error) {
    console.error('Error seeding matches:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedMatches();
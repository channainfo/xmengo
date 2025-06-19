import { PrismaClient, Like } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function seedLikes() {
  await prisma.like.deleteMany();

  try {
    console.log('Starting likes seeding (sent and received)...');

    // Fetch all users
    const users = await prisma.user.findMany({
      select: { id: true },
    });

    if (users.length < 2) {
      console.error('Not enough users to create likes. At least 2 users are required.');
      return;
    }

    console.log(`Found ${users.length} users.`);

    // Process each user
    for (const user of users) {
      const userId = user.id;

      // Get existing likes for this user (both sent and received)
      const existingLikes = await prisma.like.findMany({
        where: {
          OR: [{ fromUserId: userId }, { toUserId: userId }],
        },
        select: {
          fromUserId: true,
          toUserId: true,
        },
      });

      // Extract users this user has sent likes to
      const sentLikeUserIds = new Set(
        existingLikes
          .filter((like) => like.fromUserId === userId)
          .map((like) => like.toUserId)
      );

      // Extract users who have liked this user
      const receivedLikeUserIds = new Set(
        existingLikes
          .filter((like) => like.toUserId === userId)
          .map((like) => like.fromUserId)
      );

      // Create a set of all existing like pairs to check for duplicates
      const existingLikePairs = new Set(
        existingLikes.map((like) => `${like.fromUserId}:${like.toUserId}`)
      );

      // Available users for sending likes (exclude self and already liked users)
      const availableToSend = users
        .filter((u) => u.id !== userId && !sentLikeUserIds.has(u.id))
        .map((u) => u.id);

      // Available users for receiving likes (exclude self and users who already liked them)
      const availableToReceive = users
        .filter((u) => u.id !== userId && !receivedLikeUserIds.has(u.id))
        .map((u) => u.id);

      // Shuffle available users for randomization
      const shuffledToSend = availableToSend.sort(() => Math.random() - 0.5);
      const shuffledToReceive = availableToReceive.sort(() => Math.random() - 0.5);

      // Determine how many likes to create
      const sentLikesToCreate = Math.min(10, shuffledToSend.length);
      const receivedLikesToCreate = Math.min(10, shuffledToReceive.length);

      if (sentLikesToCreate < 10) {
        console.warn(
          `User ${userId} can only send ${sentLikesToCreate} likes due to limited available users.`
        );
      }
      if (receivedLikesToCreate < 10) {
        console.warn(
          `User ${userId} can only receive ${receivedLikesToCreate} likes due to limited available users.`
        );
      }

      // Explicitly type the likePromises array
      const likePromises: Promise<Like>[] = [];

      // Create sent likes
      for (let i = 0; i < sentLikesToCreate; i++) {
        const toUserId = shuffledToSend[i];
        const likePair = `${userId}:${toUserId}`;

        // Skip if this like pair already exists
        if (existingLikePairs.has(likePair)) {
          continue;
        }

        const isMatch = faker.datatype.boolean({ probability: 0.3 }); // 30% chance of match

        likePromises.push(
          prisma.like.create({
            data: {
              fromUserId: userId,
              toUserId: toUserId,
              isMatch,
              createdAt: faker.date.recent(),
              updatedAt: faker.date.recent(),
            },
          })
        );
        existingLikePairs.add(likePair); // Track created pair

        // If isMatch is true, create reciprocal like if it doesn't exist
        if (isMatch) {
          const reciprocalPair = `${toUserId}:${userId}`;
          if (!existingLikePairs.has(reciprocalPair)) {
            likePromises.push(
              prisma.like.create({
                data: {
                  fromUserId: toUserId,
                  toUserId: userId,
                  isMatch: true,
                  createdAt: faker.date.recent(),
                  updatedAt: faker.date.recent(),
                },
              })
            );
            existingLikePairs.add(reciprocalPair); // Track reciprocal pair
          }
        }
      }

      // Create received likes (only if not already covered)
      for (let i = 0; i < receivedLikesToCreate; i++) {
        const fromUserId = shuffledToReceive[i];
        const likePair = `${fromUserId}:${userId}`;

        // Skip if this like pair already exists
        if (existingLikePairs.has(likePair)) {
          continue;
        }

        likePromises.push(
          prisma.like.create({
            data: {
              fromUserId: fromUserId,
              toUserId: userId,
              isMatch: faker.datatype.boolean({ probability: 0.3 }),
              createdAt: faker.date.recent(),
              updatedAt: faker.date.recent(),
            },
          })
        );
        existingLikePairs.add(likePair); // Track created pair
      }

      // Execute like creation in parallel
      await Promise.all(likePromises);
      console.log(
        `Created ${sentLikesToCreate} sent likes and ${receivedLikesToCreate} received likes for user ${userId}.`
      );
    }

    console.log('Likes seeding (sent and received) completed successfully.');
  } catch (error) {
    console.error('Error seeding likes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedLikes();
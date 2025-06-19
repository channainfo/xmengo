import { PrismaClient, Message } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function seedMessageThreads() {
  try {
    console.log('Starting message thread seeding...');

    // Fetch all users
    const users = await prisma.user.findMany({
      select: { id: true },
    });

    if (users.length < 2) {
      console.error('Not enough users to create message threads. At least 2 users are required.');
      return;
    }

    console.log(`Found ${users.length} users.`);

    // Shuffle users to create random pairs
    const shuffledUsers = users.sort(() => Math.random() - 0.5);

    // Process users in pairs
    for (let i = 0; i < shuffledUsers.length - 1; i += 2) {
      const user1Id = shuffledUsers[i].id;
      const user2Id = shuffledUsers[i + 1].id;

      console.log(`Creating message thread between users ${user1Id} and ${user2Id}.`);

      // Check for existing match between user1 and user2
      let match = await prisma.match.findFirst({
        where: {
          OR: [
            { userId: user1Id, matchedId: user2Id },
            { userId: user2Id, matchedId: user1Id },
          ],
        },
        select: {
          id: true,
          userId: true,
          matchedId: true,
        },
      });

      // Create a match if none exists
      if (!match) {
        match = await prisma.match.create({
          data: {
            userId: user1Id,
            matchedId: user2Id,
            createdAt: faker.date.recent(),
            updatedAt: faker.date.recent(),
          },
        });
        console.log(`Created match ${match.id} for users ${user1Id} and ${user2Id}.`);
      }

      // Check for existing messages in this match
      const existingMessages = await prisma.message.findMany({
        where: { matchId: match.id },
        select: { senderId: true },
      });

      const user1MessageCount = existingMessages.filter((m) => m.senderId === user1Id).length;
      const user2MessageCount = existingMessages.filter((m) => m.senderId === user2Id).length;

      const messagesNeededUser1 = Math.max(20 - user1MessageCount, 0);
      const messagesNeededUser2 = Math.max(20 - user2MessageCount, 0);

      if (messagesNeededUser1 === 0 && messagesNeededUser2 === 0) {
        console.log(`Users ${user1Id} and ${user2Id} already have 20+ messages each. Skipping.`);
        continue;
      }

      console.log(
        `User ${user1Id} needs ${messagesNeededUser1} more messages, User ${user2Id} needs ${messagesNeededUser2} more messages.`
      );

      // Track promises and their senderIds
      const messageEntries: { promise: Promise<Message>; senderId: string }[] = [];

      // Generate alternating messages
      const totalMessages = Math.max(messagesNeededUser1, messagesNeededUser2) * 2;
      const baseTime = faker.date.recent().getTime();

      for (let j = 0; j < totalMessages; j++) {
        const isUser1Sender = j % 2 === 0;
        const senderId = isUser1Sender ? user1Id : user2Id;
        const receiverId = isUser1Sender ? user2Id : user1Id;

        // Count messages already promised for this sender
        const promisedForSender = messageEntries.filter((entry) => entry.senderId === senderId).length;

        // Skip if this user has enough messages
        if (
          (isUser1Sender && promisedForSender >= messagesNeededUser1) ||
          (!isUser1Sender && promisedForSender >= messagesNeededUser2)
        ) {
          continue;
        }

        // Generate message with increasing timestamp
        const messageTime = new Date(baseTime + j * 1000);

        const messagePromise = prisma.message.create({
          data: {
            content: faker.lorem.sentence({ min: 3, max: 15 }),
            senderId: senderId,
            receiverId: receiverId,
            matchId: match.id,
            read: faker.datatype.boolean({ probability: 0.5 }),
            createdAt: messageTime,
            updatedAt: messageTime,
          },
        });

        messageEntries.push({ promise: messagePromise, senderId });
      }

      // Execute message creation in parallel
      await Promise.all(messageEntries.map((entry) => entry.promise));

      const createdUser1Messages = messageEntries.filter((entry) => entry.senderId === user1Id).length;
      const createdUser2Messages = messageEntries.filter((entry) => entry.senderId === user2Id).length;

      console.log(
        `Created ${createdUser1Messages} messages for user ${user1Id} and ${createdUser2Messages} messages for user ${user2Id} in match ${match.id}.`
      );
    }

    // Handle odd number of users
    if (shuffledUsers.length % 2 !== 0) {
      console.warn(
        `User ${shuffledUsers[shuffledUsers.length - 1].id} has no pair due to odd number of users. Skipping.`
      );
    }

    console.log('Message thread seeding completed successfully.');
  } catch (error) {
    console.error('Error seeding message threads:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedMessageThreads();
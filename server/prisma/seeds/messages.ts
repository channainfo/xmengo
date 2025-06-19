import { PrismaClient, Message } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function seedMessages() {
  await prisma.message.deleteMany();
  try {
    console.log('Starting message seeding...');

    // Fetch all users
    const users = await prisma.user.findMany({
      select: { id: true },
    });

    if (users.length < 2) {
      console.error('Not enough users to create messages. At least 2 users are required.');
      return;
    }

    console.log(`Found ${users.length} users.`);

    // Process each user
    for (const user of users) {
      const senderId = user.id;

      // Fetch matches where the user is either userId or matchedId
      const matches = await prisma.match.findMany({
        where: {
          OR: [{ userId: senderId }, { matchedId: senderId }],
        },
        select: {
          id: true,
          userId: true,
          matchedId: true,
        },
      });

      if (matches.length === 0) {
        console.warn(`User ${senderId} has no matches. Skipping message creation.`);
        continue;
      }

      // Randomly determine number of messages to send (5 to 33)
      const numMessages = faker.number.int({ min: 5, max: 33 });

      // Calculate how many messages to distribute across matches
      const messagesToCreate = Math.min(numMessages, matches.length * 5); // Cap at 5 messages per match
      const messagesPerMatch = Math.ceil(messagesToCreate / matches.length);

      console.log(
        `Creating ${messagesToCreate} messages for user ${senderId} across ${matches.length} matches.`
      );

      // Explicitly type the messagePromises array
      const messagePromises: Promise<Message>[] = [];

      // Shuffle matches for randomization
      const shuffledMatches = matches.sort(() => Math.random() - 0.5);

      // Create messages
      for (const match of shuffledMatches.slice(0, Math.ceil(messagesToCreate / messagesPerMatch))) {
        const receiverId = match.userId === senderId ? match.matchedId : match.userId;

        // Create 1 to messagesPerMatch messages per match
        const messagesInThisMatch = Math.min(
          messagesPerMatch,
          messagesToCreate - messagePromises.length
        );

        for (let i = 0; i < messagesInThisMatch && messagePromises.length < messagesToCreate; i++) {
          messagePromises.push(
            prisma.message.create({
              data: {
                content: faker.lorem.sentence({ min: 3, max: 15 }),
                senderId: senderId,
                receiverId: receiverId,
                matchId: match.id,
                read: faker.datatype.boolean({ probability: 0.5 }), // 50% chance of being read
                createdAt: faker.date.recent(),
                updatedAt: faker.date.recent(),
              },
            })
          );
        }
      }

      // Execute message creation in parallel
      await Promise.all(messagePromises);
      console.log(`Created ${messagePromises.length} messages for user ${senderId}.`);
    }

    console.log('Message seeding completed successfully.');
  } catch (error) {
    console.error('Error seeding messages:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedMessages();
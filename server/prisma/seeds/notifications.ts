import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function seedNotifications() {
  try {
    console.log('Starting notification seeding...');

    // Fetch all users
    const users = await prisma.user.findMany({
      select: { id: true, name: true },
    });

    if (users.length === 0) {
      console.error('No users found. At least 1 user is required to create notifications.');
      return;
    }

    console.log(`Found ${users.length} users.`);

    // Fetch related data for entityId references
    const likes = await prisma.like.findMany({
      select: { id: true, fromUserId: true, toUserId: true },
    });
    const matches = await prisma.match.findMany({
      select: { id: true, userId: true, matchedId: true },
    });
    const messages = await prisma.message.findMany({
      select: { id: true, senderId: true, receiverId: true },
    });
    const subscriptions = await prisma.subscription.findMany({
      select: { id: true, userId: true, tier: true },
    });
    const payments = await prisma.payment.findMany({
      select: { id: true, userId: true, amount: true, currency: true },
    });

    // Create a map of user IDs to names for message personalization
    const userNameMap = new Map(users.map((user) => [user.id, user.name || 'Someone']));

    // Define notification types, titles, and message templates
    const notificationTypes = [
      {
        type: 'like',
        title: (fromUserId: string) => `New Like!`,
        message: (fromUserId: string) =>
          `${userNameMap.get(fromUserId)} liked your profile!`,
      },
      {
        type: 'match',
        title: (matchedId: string) => `New Match!`,
        message: (matchedId: string) =>
          `You matched with ${userNameMap.get(matchedId)}!`,
      },
      {
        type: 'message',
        title: (senderId: string) => `New Message!`,
        message: (senderId: string) =>
          `${userNameMap.get(senderId)} sent you a message.`,
      },
      {
        type: 'subscription',
        title: () => `Subscription Update`,
        message: (subId: string) =>
          `Your ${subId ? 'subscription' : 'free trial'} has been updated.`,
      },
      {
        type: 'payment',
        title: () => `Payment Confirmation`,
        message: (paymentId: string) =>
          `Your payment ${paymentId ? 'of ' + paymentId : ''} was successful.`,
      },
      {
        type: 'system',
        title: () => `System Notice`,
        message: () => faker.lorem.sentence({ min: 5, max: 10 }),
      },
    ];

    // Process each user
    for (const user of users) {
      const userId = user.id;
      const userName = user.name || 'Someone';

      // Randomly determine number of notifications (5 to 20)
      const numNotifications = faker.number.int({ min: 5, max: 20 });

      console.log(`Creating ${numNotifications} notifications for user ${userId}.`);

      // Filter relevant data for this user
      const userLikes = likes.filter((l) => l.toUserId === userId);
      const userMatches = matches.filter(
        (m) => m.userId === userId || m.matchedId === userId
      );
      const userMessages = messages.filter((m) => m.receiverId === userId);
      const userSubscriptions = subscriptions.filter((s) => s.userId === userId);
      const userPayments = payments.filter((p) => p.userId === userId);

      // Explicitly type the notificationPromises array
      const notificationPromises: Promise<any>[] = [];

      // Create notifications
      for (let i = 0; i < numNotifications; i++) {
        // Randomly select a notification type
        const { type, title, message } = faker.helpers.arrayElement(notificationTypes);

        let entityId: string | null = null;
        let notificationTitle: string;
        let notificationMessage: string;
        let notificationData: string | null = null;

        // Assign entityId, title, message, and data based on type
        switch (type) {
          case 'like':
            if (userLikes.length > 0) {
              const like = faker.helpers.arrayElement(userLikes);
              entityId = like.id;
              notificationTitle = title(like.fromUserId);
              notificationMessage = message(like.fromUserId);
              notificationData = JSON.stringify({
                fromUserId: like.fromUserId,
                fromUserName: userNameMap.get(like.fromUserId),
              });
            } else {
              notificationTitle = title('unknown');
              notificationMessage = message('unknown');
            }
            break;
          case 'match':
            if (userMatches.length > 0) {
              const match = faker.helpers.arrayElement(userMatches);
              entityId = match.id;
              const otherUserId = match.userId === userId ? match.matchedId : match.userId;
              notificationTitle = title(otherUserId);
              notificationMessage = message(otherUserId);
              notificationData = JSON.stringify({
                matchedUserId: otherUserId,
                matchedUserName: userNameMap.get(otherUserId),
              });
            } else {
              notificationTitle = title('unknown');
              notificationMessage = message('unknown');
            }
            break;
          case 'message':
            if (userMessages.length > 0) {
              const msg = faker.helpers.arrayElement(userMessages);
              entityId = msg.id;
              notificationTitle = title(msg.senderId);
              notificationMessage = message(msg.senderId);
              notificationData = JSON.stringify({
                senderId: msg.senderId,
                senderName: userNameMap.get(msg.senderId),
              });
            } else {
              notificationTitle = title('unknown');
              notificationMessage = message('unknown');
            }
            break;
          case 'subscription':
            if (userSubscriptions.length > 0) {
              const sub = faker.helpers.arrayElement(userSubscriptions);
              entityId = sub.id;
              notificationTitle = title(userName);
              notificationMessage = message(sub.tier);
              notificationData = JSON.stringify({
                tier: sub.tier,
                subscriptionId: sub.id,
              });
            } else {
              notificationTitle = title(userName);
              notificationMessage = message('');
            }
            break;
          case 'payment':
            if (userPayments.length > 0) {
              const payment = faker.helpers.arrayElement(userPayments);
              entityId = payment.id;
              notificationTitle = title(userName);
              notificationMessage = message(`${payment.amount} ${payment.currency}`);
              notificationData = JSON.stringify({
                amount: payment.amount,
                currency: payment.currency,
                paymentId: payment.id,
              });
            } else {
              notificationTitle = title(userName);
              notificationMessage = message('');
            }
            break;
          case 'system':
            notificationTitle = title(userName);
            notificationMessage = message('');
            notificationData = JSON.stringify({
              info: faker.lorem.words(3),
            });
            break;
          default:
            notificationTitle = title(userName);
            notificationMessage = message('unknown');
        }

        notificationPromises.push(
          prisma.notification.create({
            data: {
              userId,
              type,
              title: notificationTitle,
              message: notificationMessage,
              entityId,
              data: notificationData,
              isRead: faker.datatype.boolean({ probability: 0.3 }), // 30% chance of being read
              createdAt: faker.date.recent(),
              updatedAt: faker.date.recent(),
            },
          })
        );
      }

      // Execute notification creation in parallel
      await Promise.all(notificationPromises);
      console.log(`Created ${notificationPromises.length} notifications for user ${userId}.`);
    }

    console.log('Notification seeding completed successfully.');
  } catch (error) {
    console.error('Error seeding notifications:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedNotifications();
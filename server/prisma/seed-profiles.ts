import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// List of interests to choose from
const interestsList = [
  'Hiking', 'Travel', 'Photography', 'Cooking', 'Reading',
  'Movies', 'Music', 'Art', 'Dancing', 'Yoga',
  'Fitness', 'Gaming', 'Technology', 'Fashion', 'Sports',
  'Meditation', 'Writing', 'Cycling', 'Swimming', 'Running',
  'Painting', 'Singing', 'Gardening', 'Baking', 'Volunteering',
  'Astronomy', 'Chess', 'Board Games', 'Podcasts', 'DIY',
  'Crafting', 'Kayaking', 'Rock Climbing', 'Skiing', 'Snowboarding',
  'Surfing', 'Tennis', 'Golf', 'Basketball', 'Soccer',
  'Football', 'Baseball', 'Volleyball', 'Martial Arts', 'Archery',
  'Wine Tasting', 'Craft Beer', 'Coffee', 'Tea', 'Vegan Cooking',
  'Sustainability', 'Minimalism', 'Interior Design', 'Architecture', 'History'
];

// Sample profile photos (replace with actual URLs in production)
const samplePhotoUrls = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
  'https://images.unsplash.com/photo-1488161628813-04466f872be2',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
  // Additional photo URLs for more profiles
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
  'https://images.unsplash.com/photo-1519345182560-3f2917c472ef',
  'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f',
  'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7',
  'https://images.unsplash.com/photo-1568602471122-7832951cc4c5',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
  'https://images.unsplash.com/photo-1514315384763-ba401779410f',
  'https://images.unsplash.com/photo-1496440737103-cd88fc85f18d',
  'https://images.unsplash.com/photo-1504257432389-52343af06ae3',
  'https://images.unsplash.com/photo-1514846326710-096e4a8035e0',
  'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c',
  'https://images.unsplash.com/photo-1504439904031-93ded9f93e4e',
  'https://images.unsplash.com/photo-1502767882403-636aee14f873',
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae',
  'https://images.unsplash.com/photo-1546961329-78bef0414d7c',
  'https://images.unsplash.com/photo-1542206395-9feb3edaa68d',
  'https://images.unsplash.com/photo-1507114845806-0347f6150324'
];

// Sample first names
const firstNames = {
  male: ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles',
    'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua',
    'Kenneth', 'Kevin', 'Brian', 'George', 'Timothy', 'Ronald', 'Edward', 'Jason', 'Jeffrey', 'Ryan',
    'Jacob', 'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon',
    'Benjamin', 'Samuel', 'Gregory', 'Alexander', 'Patrick', 'Frank', 'Raymond', 'Jack', 'Dennis', 'Jerry'],
  female: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen',
    'Lisa', 'Nancy', 'Betty', 'Margaret', 'Sandra', 'Ashley', 'Kimberly', 'Emily', 'Donna', 'Michelle',
    'Carol', 'Amanda', 'Dorothy', 'Melissa', 'Deborah', 'Stephanie', 'Rebecca', 'Sharon', 'Laura', 'Cynthia',
    'Kathleen', 'Amy', 'Angela', 'Shirley', 'Anna', 'Brenda', 'Pamela', 'Nicole', 'Samantha', 'Katherine',
    'Emma', 'Ruth', 'Christine', 'Catherine', 'Debra', 'Rachel', 'Carolyn', 'Janet', 'Virginia', 'Maria']
};

// Sample last names
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
  'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes',
  'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper',
  'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson',
  'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes',
  'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez'];

// Sample bios
const bioParts = {
  starters: [
    'Passionate about', 'Enthusiastic', 'Dedicated to', 'Love exploring', 'Obsessed with',
    'Always looking for new adventures in', 'Constantly inspired by', 'Fascinated with',
    'Can\'t get enough of', 'Deeply interested in', 'Committed to', 'Excited about',
    'Curious about', 'Devoted to', 'Eager to share my passion for'
  ],
  activities: [
    'traveling to new places', 'discovering hidden gems', 'trying new cuisines',
    'outdoor adventures', 'artistic pursuits', 'cultural experiences',
    'fitness and wellness', 'reading and learning', 'creative projects',
    'meaningful conversations', 'community involvement', 'personal growth',
    'sustainable living', 'culinary exploration', 'musical journeys'
  ],
  qualities: [
    'Authentic', 'Genuine', 'Thoughtful', 'Ambitious', 'Spontaneous',
    'Creative', 'Adventurous', 'Easygoing', 'Optimistic', 'Reliable',
    'Honest', 'Compassionate', 'Curious', 'Driven', 'Open-minded'
  ],
  seeking: [
    'Looking for someone who appreciates', 'Hoping to connect with people who enjoy',
    'Seeking connections with those who value', 'Interested in meeting others passionate about',
    'Would love to meet someone who shares my interest in', 'Hoping to find people who understand',
    'Wanting to connect with those who are excited about', 'Searching for authentic connections based on'
  ],
  values: [
    'genuine connections', 'meaningful conversations', 'shared adventures',
    'mutual growth', 'honest communication', 'similar values', 'complementary differences',
    'intellectual stimulation', 'emotional intelligence', 'common interests',
    'life balance', 'personal development', 'cultural appreciation'
  ],
  closers: [
    'Let\'s chat and see where it goes!', 'Message me if you think we\'d click!',
    'Excited to meet new people here!', 'Looking forward to meaningful connections!',
    'Say hi if any of this resonates with you!', 'Would love to hear your story!',
    'Let\'s skip the small talk and dive into the good stuff!', 'Life\'s too short for boring conversations!',
    'Always up for interesting discussions!', 'Hoping to make authentic connections here!'
  ]
};

// Helper functions for generating random profiles
const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomElements = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomBirthdate = (minAge: number, maxAge: number): Date => {
  const now = new Date();
  const year = now.getFullYear() - getRandomInt(minAge, maxAge);
  const month = getRandomInt(0, 11);
  const day = getRandomInt(1, 28); // Using 28 to avoid invalid dates
  return new Date(year, month, day);
};

const generateRandomBio = (): string => {
  const starter = getRandomElement(bioParts.starters);
  const activity = getRandomElement(bioParts.activities);
  const quality = getRandomElement(bioParts.qualities);
  const seeking = getRandomElement(bioParts.seeking);
  const value = getRandomElement(bioParts.values);
  const closer = getRandomElement(bioParts.closers);

  return `${starter} ${activity}. ${quality} person who enjoys life. ${seeking} ${value}. ${closer}`;
};

const generateRandomProfile = (id: number): any => {
  const gender = Math.random() > 0.5 ? 'male' : 'female';
  const firstName = getRandomElement(firstNames[gender]);
  const lastName = getRandomElement(lastNames);
  const photoUrl = getRandomElement(samplePhotoUrls);
  const birthdate = getRandomBirthdate(18, 45);
  const interests = getRandomElements(interestsList, getRandomInt(3, 6));
  const bio = generateRandomBio();
  const isOnline = Math.random() > 0.7;

  return {
    id: id.toString(),
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${id}@example.com`,
    password: 'password123', // For development only
    firstName,
    lastName,
    birthdate,
    gender,
    bio,
    interests,
    photos: [{ url: photoUrl }],
    isOnline,
    location: {
      latitude: 37.7749 + (Math.random() - 0.5) * 0.2,
      longitude: -122.4194 + (Math.random() - 0.5) * 0.2,
    },
    lastActive: new Date(),
  };
};

const generateAdditionalProfiles = (count: number, startId: number): any[] => {
  const profiles: any = [];
  for (let i = 0; i < count; i++) {
    profiles.push(generateRandomProfile(startId + i));
  }
  return profiles;
};



// Sample profiles data
const sampleProfiles = [
  {
    email: 'emma.wilson@example.com',
    password: 'password123',
    name: 'Emma Wilson',
    bio: 'Adventure seeker and coffee enthusiast. Love exploring new places and meeting new people.',
    dateOfBirth: new Date('1995-06-12'),
    gender: 'female',
    interestedIn: ['male'],
    location: { latitude: 37.7749, longitude: -122.4194 },
    interests: ['Travel', 'Photography', 'Hiking', 'Cooking'],
    photos: [
      { url: samplePhotoUrls[0], isMain: true },
      { url: samplePhotoUrls[0] + '?v=2', isMain: false }
    ]
  },
  {
    email: 'james.smith@example.com',
    password: 'password123',
    name: 'James Smith',
    bio: 'Tech enthusiast and fitness lover. Enjoy hiking on weekends and trying new restaurants.',
    dateOfBirth: new Date('1992-03-24'),
    gender: 'male',
    interestedIn: ['female'],
    location: { latitude: 37.7833, longitude: -122.4167 },
    interests: ['Fitness', 'Technology', 'Hiking', 'Cooking'],
    photos: [
      { url: samplePhotoUrls[1], isMain: true },
      { url: samplePhotoUrls[1] + '?v=2', isMain: false }
    ]
  },
  {
    email: 'sophia.brown@example.com',
    password: 'password123',
    name: 'Sophia Brown',
    bio: 'Art lover and yoga instructor. Passionate about sustainable living and mindfulness.',
    dateOfBirth: new Date('1994-09-18'),
    gender: 'female',
    interestedIn: ['male', 'female'],
    location: { latitude: 37.7694, longitude: -122.4862 },
    interests: ['Art', 'Yoga', 'Meditation', 'Reading'],
    photos: [
      { url: samplePhotoUrls[2], isMain: true },
      { url: samplePhotoUrls[2] + '?v=2', isMain: false }
    ]
  }
];

// Generate 100 additional profiles
const additionalProfiles = generateAdditionalProfiles(100, 9);

// Combine original sample profiles with additional profiles
const allProfiles = [...sampleProfiles, ...additionalProfiles];

async function main() {
  console.log('Starting to seed sample profiles...');

  // Create interests if they don't exist
  for (const interestName of interestsList) {
    await prisma.interest.upsert({
      where: { name: interestName },
      update: {},
      create: { name: interestName }
    });
  }
  console.log('Interests created');

  // Create users with profiles
  for (const profile of allProfiles) {
    // Use a simple hashed password for development
    // In production, you would use bcrypt.hash()
    const hashedPassword = `dev_hash_${profile.password}`;
    
    // Handle different profile structures between original and generated profiles
    const name = profile.name || `${profile.firstName} ${profile.lastName}`;
    const dateOfBirth = profile.dateOfBirth || profile.birthdate;

    // Create the user
    const user = await prisma.user.upsert({
      where: { email: profile.email },
      update: {
        name: name,
        bio: profile.bio,
        dateOfBirth: dateOfBirth,
        gender: profile.gender,
        interestedIn: profile.interestedIn || ['male', 'female'], // default to both
        location: profile.location,
        profileCompleted: true,
        lastActive: new Date(),
        isVerified: true
      },
      create: {
        email: profile.email,
        password: hashedPassword,
        name: name,
        bio: profile.bio,
        dateOfBirth: dateOfBirth,
        gender: profile.gender,
        interestedIn: profile.interestedIn || ['male', 'female'], // default to both
        location: profile.location,
        profileCompleted: true,
        lastActive: new Date(),
        isVerified: true
      }
    });

    // Add photos
    const photos = profile.photos || [];
    for (const photo of photos) {
      await prisma.photo.upsert({
        where: {
          id: `${user.id}-${photo.url.split('/').pop()}`
        },
        update: {
          url: photo.url,
          isMain: photo.isMain || false
        },
        create: {
          id: `${user.id}-${photo.url.split('/').pop()}`,
          url: photo.url,
          isMain: photo.isMain || false,
          userId: user.id
        }
      });
    }

    // Add interests
    const interests = profile.interests || [];
    for (const interestName of interests) {
      const interest = await prisma.interest.findUnique({
        where: { name: interestName }
      });

      if (interest) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            interests: {
              connect: { id: interest.id }
            }
          }
        });
      }
    }

    console.log(`Created profile for ${name}`);
  }

  console.log('Sample profiles seeding completed!');
}

main()
    .catch((e) => {
      console.error(e);
      // Exit with error code
      // Using a number directly instead of process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect();
    });

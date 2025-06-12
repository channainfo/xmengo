// Global test setup
// This file will be executed before running tests

// Mock PrismaClient to avoid actual database connections during tests
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  };
  
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

# Fmengo Dating Platform Backend

A modern Tinder-like dating platform backend built with NestJS, featuring cryptocurrency payments, multi-platform authentication, and more.

## Features

- 🔐 Multi-platform authentication (Email, Google, Facebook, Telegram)
- 👤 Comprehensive user profiles with photos and interests
- 💞 Advanced matching algorithm
- 💬 Real-time messaging between matches with typing indicators
- 🔔 Real-time notifications for matches, messages, and system events
- 🟢 User online status tracking
- 💰 Subscription tiers with different features
- 💲 Cryptocurrency payment integration
- 📱 Telegram ecosystem integration
- 📊 Analytics for user engagement
- ☁️ Serverless architecture ready

## Tech Stack

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT, Passport strategies
- **Real-time**: WebSockets with Socket.io
- **Containerization**: Docker and Docker Compose
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- PostgreSQL database
- OAuth credentials for social login providers

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/fmengo.git
cd fmengo/server
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

Note: We use `--legacy-peer-deps` to resolve conflicts with some packages like `passport-telegram-official`.

### 3. Set up environment variables

Copy the example environment file and update it with your credentials:

```bash
cp .env.example .env
```

Edit the `.env` file with your database connection string, JWT secret, and OAuth credentials.

### 4. Set up the database

```bash
npx prisma migrate dev --name init
```

This will create the database tables based on the Prisma schema.

### 5. Start the development server

```bash
npm run start:dev
```

The API will be available at http://localhost:3000.

### Alternative: Using Docker

You can also run the application using Docker:

```bash
docker-compose up -d
```

This will start the NestJS application, PostgreSQL database, and pgAdmin for database management.

## API Documentation

Once the server is running, you can access the Swagger API documentation at:

```
http://localhost:3000/api
```

This provides an interactive interface to explore and test all available endpoints.

## Project Structure

```
src/
├── auth/               # Authentication module
│   ├── dto/           # Data transfer objects
│   ├── strategies/    # Passport authentication strategies
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
├── users/              # Users module
│   ├── user-status.service.ts  # User online status tracking
├── profiles/           # Profiles module
├── matches/            # Matches module
├── messages/           # Messages module
├── subscriptions/      # Subscriptions module
├── notifications/      # Notifications module
├── analytics/          # Analytics module
├── websockets/         # WebSockets for real-time features
│   ├── websockets.gateway.ts
│   ├── websocket-client.service.ts
├── payments/           # Payments module
├── prisma/             # Prisma service
├── app.module.ts       # Root module
└── main.ts             # Application entry point
```

## Authentication

The application supports multiple authentication methods:

- Email/password
- Google OAuth
- Facebook OAuth
- Telegram login

JWT tokens are used for maintaining authenticated sessions.

## Subscription Tiers

- **Basic**: Free tier with limited features
- **Premium**: Paid tier with enhanced features
- **Platinum**: Top-tier with all features unlocked

## Payment Methods

- Credit/debit cards
- Cryptocurrency (BTC, ETH, USDT, BNB, ADA)

## Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Core Attributes

- User profiles for matching in a dating app, you want a combination of demographic, personality, interest, and behavioral attributes.
- Physical appearance and fashion style can enhance both visual appeal and filtering in a dating app, especially when done respectfully and inclusively (Make sure to provide inclusive, non-judgmental options, and allow users to skip or prefer not to say).

## Optional Design Notes

- Privacy controls: let users hide or customize visibility of sensitive fields.
- AI/vision enhancements: you could auto-suggest tags (like clothing style or hair type) from uploaded photos — just ensure it’s opt-in and transparent.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

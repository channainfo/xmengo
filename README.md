# Fmengo - Modern Dating Platform

A Tinder-like dating platform built with TypeScript, React, and Express, featuring cryptocurrency payments and multi-platform authentication.

## Tech Stack

### Frontend
- React.js with TypeScript
- Zustand Toolkit for state management
- Use tanstack query for data fetching.
- Tailwind CSS for styling
- Jest for testing
- ESLint for code quality
- Mobile friendly UI.

### Backend
- Express.js with TypeScript
- PostgreSQL database
- Prisma ORM
- JWT for authentication
- Jest for testing
- ESLint for code quality
- Using JSON-api standard format
- Use either: Fortune.js, or endpoints package that support typescript.

### Infrastructure
- Serverless architecture
- AWS S3 / Cloudflare for static assets
- Docker for containerization
- CI/CD pipeline

## Features

1. **Responsive Design**
   - Mobile-first approach
   - Dark/Light mode toggle

2. **Authentication**
   - Email verification
   - Social logins (Google, Facebook, Telegram)
   - Two-factor authentication

3. **User Profiles**
   - Multiple photos
   - Bio and interests
   - Location-based matching
   - Profile completion percentage
   - Profile privacy settings
   - Profile visibility
   - Profile search
   - Profile recommendations
   - Profile analytics
   - Profile notifications
   - Profile history
   - Profile deletion
   - Profile export
   - Profile import
   - Profile backup
   - Profile recovery
   - Profile sharing

4. **Matching System**
   - Swipe interface
   - Match algorithms
   - Chat functionality
   - Match history
   - Match analytics
   - Match notifications

5. **Subscription System**
   - Multiple tiers
   - Cryptocurrency payments (TON, Solana, Ethereum, Bitcoin)
   - Prorated billing

6. **Telegram Ecosystem Integration**
   - Telegram login
   - Telegram Stars payment
   - Notifications via Telegram
   - Telegram analytics

7. **Analytics**
   - User behavior tracking
   - Match analytics
   - Subscription analytics
   - Telegram analytics

8. **Security**
   - Secure authentication
   - Secure data storage
   - Secure data transmission

9. **Payment Settlement**
   - Cryptocurrency payments
   - Prorated billing
   - Payment history
   - Payment analytics
   - Payment notifications

10. **Serverless Architecture**
   - Serverless architecture
   - Docker for containerization
   - CI/CD pipeline

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- Docker (optional)
- Terraform AWS

### Installation

1. Clone the repository
```bash
git clone https://github.com/fmengo/fmengo.git
cd fmengo
```

2. Install dependencies
```bash
# Install client dependencies
cd client

npm install --force --legacy-peer-deps

# Install server dependencies
cd ../server
npm install --force --legacy-peer-deps
```

3. Set up environment variables
```bash
# In server directory
cp .env.example .env
# Edit .env with your configuration
```

4. Start development servers
```bash
# Start client (in client directory)
npm run dev

# Start server (in server directory)
npm run dev
```

5. Run tests
```bash
# Client tests
cd client
npm test

# Server tests
cd server
npm test
```

## License
MIT

## Contributing
Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

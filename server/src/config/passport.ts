import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import dotenv from 'dotenv';
import { prisma } from '../index';

dotenv.config();

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        let user = await prisma.user.findFirst({
          where: { googleId: profile.id },
        });

        if (user) {
          return done(null, user);
        }

        // Check if user exists with same email
        if (profile.emails && profile.emails[0].value) {
          user = await prisma.user.findUnique({
            where: { email: profile.emails[0].value },
          });

          if (user) {
            // Update existing user with Google ID
            user = await prisma.user.update({
              where: { id: user.id },
              data: { googleId: profile.id },
            });
            return done(null, user);
          }
        }

        // Create new user
        const newUser = await prisma.user.create({
          data: {
            googleId: profile.id,
            email: profile.emails?.[0].value || `${profile.id}@google.user`,
            name: profile.displayName || `User ${profile.id.substring(0, 8)}`,
            verified: true, // Google users are pre-verified
            profilePicture: profile.photos?.[0].value,
            photos: profile.photos ? [profile.photos[0].value] : [],
            interestedIn: [],
          },
        });

        return done(null, newUser);
      } catch (error) {
        console.error('Google auth error:', error);
        return done(error as Error);
      }
    }
  )
);

// Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID || '',
      clientSecret: process.env.FACEBOOK_APP_SECRET || '',
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['id', 'displayName', 'photos', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        let user = await prisma.user.findFirst({
          where: { facebookId: profile.id },
        });

        if (user) {
          return done(null, user);
        }

        // Check if user exists with same email
        if (profile.emails && profile.emails[0].value) {
          user = await prisma.user.findUnique({
            where: { email: profile.emails[0].value },
          });

          if (user) {
            // Update existing user with Facebook ID
            user = await prisma.user.update({
              where: { id: user.id },
              data: { facebookId: profile.id },
            });
            return done(null, user);
          }
        }

        // Create new user
        const newUser = await prisma.user.create({
          data: {
            facebookId: profile.id,
            email: profile.emails?.[0].value || `${profile.id}@facebook.user`,
            name: profile.displayName || `User ${profile.id.substring(0, 8)}`,
            verified: true, // Facebook users are pre-verified
            profilePicture: profile.photos?.[0].value,
            photos: profile.photos ? [profile.photos[0].value] : [],
            interestedIn: [],
          },
        });

        return done(null, newUser);
      } catch (error) {
        console.error('Facebook auth error:', error);
        return done(error as Error);
      }
    }
  )
);

// Telegram authentication is handled differently
// It uses the Telegram Login Widget on the frontend
// The backend only verifies the data sent by the widget

// Serialize and deserialize user
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send verification email
export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    const transporter = createTransporter();
    
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Fmengo" <noreply@fmengo.com>',
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6d28d9;">Welcome to Fmengo!</h2>
          <p>Thank you for signing up. Please verify your email address to continue.</p>
          <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(to right, #6d28d9, #db2777); color: white; text-decoration: none; padding: 10px 20px; border-radius: 50px; margin: 20px 0;">Verify Email</a>
          <p>If you didn't create an account, you can safely ignore this email.</p>
          <p>Best regards,<br>The Fmengo Team</p>
        </div>
      `,
    });
    
    console.log(`Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email: string, token: string) => {
  try {
    const transporter = createTransporter();
    
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Fmengo" <noreply@fmengo.com>',
      to: email,
      subject: 'Reset Your Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6d28d9;">Reset Your Password</h2>
          <p>You requested a password reset. Click the button below to set a new password.</p>
          <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(to right, #6d28d9, #db2777); color: white; text-decoration: none; padding: 10px 20px; border-radius: 50px; margin: 20px 0;">Reset Password</a>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
          <p>Best regards,<br>The Fmengo Team</p>
        </div>
      `,
    });
    
    console.log(`Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};

// Send match notification email
export const sendMatchNotificationEmail = async (email: string, matchName: string) => {
  try {
    const transporter = createTransporter();
    
    const matchesUrl = `${process.env.CLIENT_URL}/matches`;
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Fmengo" <noreply@fmengo.com>',
      to: email,
      subject: 'You Have a New Match!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6d28d9;">You Have a New Match!</h2>
          <p>Good news! You and ${matchName} have matched.</p>
          <p>Start a conversation and get to know each other better.</p>
          <a href="${matchesUrl}" style="display: inline-block; background: linear-gradient(to right, #6d28d9, #db2777); color: white; text-decoration: none; padding: 10px 20px; border-radius: 50px; margin: 20px 0;">View Match</a>
          <p>Best regards,<br>The Fmengo Team</p>
        </div>
      `,
    });
    
    console.log(`Match notification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending match notification email:', error);
    return false;
  }
};

// Send subscription confirmation email
export const sendSubscriptionConfirmationEmail = async (
  email: string, 
  planName: string, 
  endDate: Date,
  amount: number,
  currency: string
) => {
  try {
    const transporter = createTransporter();
    
    const subscriptionUrl = `${process.env.CLIENT_URL}/subscription`;
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Fmengo" <noreply@fmengo.com>',
      to: email,
      subject: 'Subscription Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6d28d9;">Subscription Confirmation</h2>
          <p>Thank you for subscribing to Fmengo ${planName} plan!</p>
          <p>Your subscription details:</p>
          <ul>
            <li>Plan: ${planName}</li>
            <li>Amount: ${amount} ${currency}</li>
            <li>Valid until: ${endDate.toLocaleDateString()}</li>
          </ul>
          <a href="${subscriptionUrl}" style="display: inline-block; background: linear-gradient(to right, #6d28d9, #db2777); color: white; text-decoration: none; padding: 10px 20px; border-radius: 50px; margin: 20px 0;">Manage Subscription</a>
          <p>Best regards,<br>The Fmengo Team</p>
        </div>
      `,
    });
    
    console.log(`Subscription confirmation email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending subscription confirmation email:', error);
    return false;
  }
};

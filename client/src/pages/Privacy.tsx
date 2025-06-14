import React from 'react';
import { motion } from 'framer-motion';

const Privacy: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-8"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Privacy Policy</h1>
      
      <div className="prose prose-pink dark:prose-invert max-w-none">
        <p className="lead">
          At Fmengo, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
        </p>
        
        <h2>Information We Collect</h2>
        <p>
          We collect information that you provide directly to us when you:
        </p>
        <ul>
          <li>Create an account and build your profile</li>
          <li>Connect your social media accounts</li>
          <li>Communicate with other users</li>
          <li>Contact our customer support</li>
          <li>Respond to surveys or promotions</li>
        </ul>
        
        <p>This information may include:</p>
        <ul>
          <li>Personal identifiers (name, email address, phone number)</li>
          <li>Profile information (photos, bio, interests, preferences)</li>
          <li>Location data (with your permission)</li>
          <li>Messages and communication content</li>
          <li>Device and usage information</li>
        </ul>
        
        <h2>How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Create and update your account</li>
          <li>Process transactions</li>
          <li>Match you with other users</li>
          <li>Send you technical notices, updates, and support messages</li>
          <li>Respond to your comments and questions</li>
          <li>Prevent fraud and abuse</li>
        </ul>
        
        <h2>Information Sharing</h2>
        <p>
          We may share your information with:
        </p>
        <ul>
          <li>Other users (as part of your profile and interactions)</li>
          <li>Service providers who perform services on our behalf</li>
          <li>Business partners (with your consent)</li>
          <li>Legal authorities when required by law</li>
        </ul>
        
        <h2>Your Rights and Choices</h2>
        <p>
          You have several rights regarding your personal information:
        </p>
        <ul>
          <li>Access and update your profile information</li>
          <li>Control your privacy settings within the app</li>
          <li>Opt out of marketing communications</li>
          <li>Request deletion of your account and data</li>
          <li>Object to certain processing of your data</li>
        </ul>
        
        <h2>Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
        </p>
        
        <h2>International Data Transfers</h2>
        <p>
          Your information may be transferred to and processed in countries other than the one in which you reside. These countries may have different data protection laws than your country of residence.
        </p>
        
        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
        </p>
        
        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at privacy@fmengo.com.
        </p>
        
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          Last updated: June 13, 2025
        </p>
      </div>
    </motion.div>
  );
};

export default Privacy;

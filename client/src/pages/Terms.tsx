import React from 'react';
import { motion } from 'framer-motion';

const Terms: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-8"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Terms of Service</h1>
      
      <div className="prose prose-pink dark:prose-invert max-w-none">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using Fmengo's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
        </p>
        
        <h2>2. Eligibility</h2>
        <p>
          You must be at least 18 years old to create an account on Fmengo and use our services. By registering, you represent and warrant that you are at least 18 years old.
        </p>
        
        <h2>3. Your Account</h2>
        <p>
          You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
        </p>
        
        <h2>4. User Content</h2>
        <p>
          You retain all rights to the content you post, upload, or display on Fmengo. By posting content, you grant Fmengo a non-exclusive, transferable, sub-licensable, royalty-free, worldwide license to use, modify, publicly display, and distribute such content on our services.
        </p>
        
        <h2>5. Prohibited Activities</h2>
        <p>
          You agree not to engage in any of the following prohibited activities:
        </p>
        <ul>
          <li>Using the services for any illegal purpose</li>
          <li>Harassing, threatening, or intimidating other users</li>
          <li>Posting false, misleading, or deceptive content</li>
          <li>Creating multiple accounts</li>
          <li>Sharing your account with others</li>
          <li>Attempting to access the services through automated means</li>
        </ul>
        
        <h2>6. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your account at any time for violations of these terms or for any other reason at our sole discretion.
        </p>
        
        <h2>7. Changes to Terms</h2>
        <p>
          We may modify these Terms of Service at any time. We will provide notice of significant changes through our services or by other means. Your continued use of Fmengo after such modifications constitutes your acceptance of the updated terms.
        </p>
        
        <h2>8. Disclaimer of Warranties</h2>
        <p>
          Fmengo is provided "as is" without warranties of any kind, either express or implied. We do not guarantee that our services will be uninterrupted, secure, or error-free.
        </p>
        
        <h2>9. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, Fmengo shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use our services.
        </p>
        
        <h2>10. Governing Law</h2>
        <p>
          These Terms of Service are governed by the laws of the jurisdiction in which Fmengo is established, without regard to its conflict of law provisions.
        </p>
        
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          Last updated: June 13, 2025
        </p>
      </div>
    </motion.div>
  );
};

export default Terms;

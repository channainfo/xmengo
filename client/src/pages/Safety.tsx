import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, ExclamationTriangleIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const Safety: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-8"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Safety Center</h1>
      
      <div className="prose prose-pink dark:prose-invert max-w-none">
        <p className="lead text-lg">
          Your safety is our top priority at Fmengo. We've developed comprehensive safety features and guidelines to help you have a secure and positive experience.
        </p>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-lg">
            <ShieldCheckIcon className="w-12 h-12 text-pink-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Profile Verification</h2>
            <p>We use photo verification technology to ensure users are who they say they are, reducing the risk of fake profiles.</p>
          </div>
          
          <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-lg">
            <LockClosedIcon className="w-12 h-12 text-pink-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Privacy Controls</h2>
            <p>You have complete control over what information you share and who can see your profile.</p>
          </div>
          
          <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-lg">
            <ExclamationTriangleIcon className="w-12 h-12 text-pink-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Reporting System</h2>
            <p>Our robust reporting system allows you to flag inappropriate behavior, with each report reviewed by our safety team.</p>
          </div>
        </div>
        
        <h2 className="mt-10">Safety Tips for Online Dating</h2>
        
        <h3>Before Meeting in Person</h3>
        <ul>
          <li>Take time to get to know the person through the app's messaging system</li>
          <li>Video chat before meeting in person</li>
          <li>Research your match on social media or through a search engine</li>
          <li>Be wary of anyone who refuses to video chat or keeps postponing in-person meetings</li>
          <li>Be cautious of those who ask for financial assistance or share inconsistent information</li>
        </ul>
        
        <h3>Planning the First Meeting</h3>
        <ul>
          <li>Meet in a public place with plenty of people around</li>
          <li>Tell a friend or family member about your plans, including when and where you're meeting</li>
          <li>Arrange your own transportation to and from the meeting</li>
          <li>Stay sober and alert during the first few meetings</li>
          <li>Keep your personal belongings with you at all times</li>
        </ul>
        
        <h3>During and After the Meeting</h3>
        <ul>
          <li>Trust your instincts—if something feels off, leave</li>
          <li>Don't be afraid to end the date early if you're uncomfortable</li>
          <li>Avoid sharing personal information like your home address or financial details</li>
          <li>Check in with your friend or family member during and after the date</li>
          <li>Report any concerning behavior to Fmengo immediately</li>
        </ul>
        
        <h2 className="mt-10">Reporting Concerns</h2>
        <p>
          If you experience or witness behavior that violates our community guidelines, please report it immediately:
        </p>
        <ol>
          <li>Open the profile of the user you want to report</li>
          <li>Tap the "Report" button</li>
          <li>Select the reason for your report and provide details</li>
          <li>Submit your report</li>
        </ol>
        <p>
          Our safety team reviews all reports and takes appropriate action, which may include removing users from the platform.
        </p>
        
        <h2 className="mt-10">Emergency Situations</h2>
        <p>
          If you're in immediate danger, always call your local emergency services (such as 911 in the US) first. After ensuring your safety, please report the incident to Fmengo so we can take appropriate action.
        </p>
        
        <div className="bg-pink-100 dark:bg-pink-900/30 p-6 rounded-lg mt-8">
          <h3 className="font-bold text-lg mb-2">Remember</h3>
          <p>
            Your safety is more important than politeness. You never have to continue a conversation or relationship that makes you uncomfortable, and you don't owe anyone an explanation.
          </p>
        </div>
        
        <p className="mt-8">
          For additional safety resources or to report concerns, please contact our Safety Team at <a href="mailto:safety@fmengo.com" className="text-pink-600 dark:text-pink-400 hover:underline">safety@fmengo.com</a>.
        </p>
      </div>
    </motion.div>
  );
};

export default Safety;

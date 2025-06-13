import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { motion } from 'framer-motion';

const Settings: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: {
      messages: true,
      matches: true,
      likes: true,
      system: true
    }
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || ''
      }));
    }
  }, [user]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const notificationKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [notificationKey]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Password validation
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required';
      }
      
      if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters';
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Update password if provided
      if (formData.newPassword) {
        // This would be an API call to update password
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
        showToast('success', 'Password updated successfully');
      }
      
      // Update notification preferences
      // This would be an API call to update notification settings
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulating API call
      showToast('success', 'Settings updated successfully');
      
    } catch (error) {
      console.error('Failed to update settings:', error);
      showToast('error', 'Failed to update settings');
    } finally {
      setIsLoading(false);
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setIsLoading(true);
      try {
        // This would be an API call to delete account
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
        showToast('success', 'Account deleted successfully');
        // Redirect to login page or handle logout
      } catch (error) {
        console.error('Failed to delete account:', error);
        showToast('error', 'Failed to delete account');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6"
      >
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Account Settings</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email */}
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled
              helperText="Contact support to change your email address"
            />
            
            {/* Password Change Section */}
            <div className="pt-4 border-t dark:border-gray-700">
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Change Password</h3>
              
              <div className="space-y-4">
                <Input
                  label="Current Password"
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  error={errors.currentPassword}
                />
                
                <Input
                  label="New Password"
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  error={errors.newPassword}
                />
                
                <Input
                  label="Confirm New Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                />
              </div>
            </div>
            
            {/* Notification Settings */}
            <div className="pt-4 border-t dark:border-gray-700">
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Notification Preferences</h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="notifications.messages"
                    name="notifications.messages"
                    type="checkbox"
                    checked={formData.notifications.messages}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="notifications.messages" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    New messages
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="notifications.matches"
                    name="notifications.matches"
                    type="checkbox"
                    checked={formData.notifications.matches}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="notifications.matches" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    New matches
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="notifications.likes"
                    name="notifications.likes"
                    type="checkbox"
                    checked={formData.notifications.likes}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="notifications.likes" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    Profile likes
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="notifications.system"
                    name="notifications.system"
                    type="checkbox"
                    checked={formData.notifications.system}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="notifications.system" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    System notifications
                  </label>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                fullWidth
              >
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
      
      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
      >
        <h2 className="text-lg font-medium text-red-600 dark:text-red-400 mb-4">Danger Zone</h2>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        
        <Button
          variant="danger"
          onClick={handleDeleteAccount}
          isLoading={isLoading}
        >
          Delete Account
        </Button>
      </motion.div>
    </div>
  );
};

export default Settings;

import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const LandingPage: React.FC = () => {
  const { mode } = useSelector((state: RootState) => state.theme);

  return (
    <div className={`min-h-screen ${mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 opacity-90"></div>
        <div className="relative container mx-auto px-4 py-32">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-5xl font-bold mb-6">Find Your Perfect Match</h1>
            <p className="text-xl mb-8">
              Connect with like-minded individuals in a secure and modern dating platform.
              Discover meaningful relationships with our advanced matching algorithm.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="bg-white text-purple-600 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition duration-300 text-lg"
              >
                Get Started
              </Link>
              <Link
                to="/features"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-purple-600 transition duration-300 text-lg"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 ${mode === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Fmengo?</h2>
            <p className="text-xl max-w-2xl mx-auto">
              Our platform offers unique features designed to create meaningful connections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className={`p-6 rounded-lg ${mode === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow-lg`}>
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-center">Smart Matching</h3>
              <p className={`text-center ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Our AI-powered algorithm learns your preferences to find your perfect match.
              </p>
            </div>

            {/* Feature 2 */}
            <div className={`p-6 rounded-lg ${mode === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow-lg`}>
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-center">Secure & Private</h3>
              <p className={`text-center ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Your data is encrypted and protected. We never share your information with third parties.
              </p>
            </div>

            {/* Feature 3 */}
            <div className={`p-6 rounded-lg ${mode === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow-lg`}>
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-center">Crypto Payments</h3>
              <p className={`text-center ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Subscribe using various cryptocurrencies including Bitcoin, Ethereum, Solana, and TON.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={`py-20 ${mode === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl max-w-2xl mx-auto">
              Getting started with Fmengo is easy. Follow these simple steps to find your match.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center mb-4 mx-auto text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Profile</h3>
              <p className={`${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Sign up and create your profile with photos and personal information.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center mb-4 mx-auto text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover Matches</h3>
              <p className={`${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Browse through potential matches based on your preferences.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center mb-4 mx-auto text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className={`${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Start conversations with your matches and get to know them better.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center mb-4 mx-auto text-white font-bold text-xl">
                4
              </div>
              <h3 className="text-xl font-semibold mb-2">Meet Up</h3>
              <p className={`${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                When you're ready, arrange to meet in person and start your journey together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`py-20 ${mode === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl max-w-2xl mx-auto">
              Hear from our users who found their perfect match on Fmengo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className={`p-6 rounded-lg ${mode === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center mb-4">
                <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="User" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h4 className="font-semibold">Sarah J.</h4>
                  <p className={`text-sm ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>New York, NY</p>
                </div>
              </div>
              <p className={`${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                "I met my husband on Fmengo two years ago. The matching algorithm really works! We had so much in common from the start."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className={`p-6 rounded-lg ${mode === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center mb-4">
                <img src="https://randomuser.me/api/portraits/men/44.jpg" alt="User" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h4 className="font-semibold">Michael T.</h4>
                  <p className={`text-sm ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Los Angeles, CA</p>
                </div>
              </div>
              <p className={`${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                "After trying several dating apps, Fmengo was the only one that helped me find meaningful connections. The crypto payment option was a bonus!"
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className={`p-6 rounded-lg ${mode === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center mb-4">
                <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="User" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h4 className="font-semibold">Emily R.</h4>
                  <p className={`text-sm ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Chicago, IL</p>
                </div>
              </div>
              <p className={`${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                "The Telegram integration made communication so seamless. I loved getting notifications directly to my Telegram account!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Find Your Match?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Join thousands of users who have found meaningful relationships on Fmengo.
          </p>
          <Link
            to="/register"
            className="bg-white text-purple-600 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition duration-300 text-lg inline-block"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setIsLanguageOpen(!isLanguageOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path: string) => router.pathname === path;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              Mikey
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/features"
              className="text-sm font-medium text-gray-700 hover:text-primary transition duration-150"
            >
              Features
            </Link>
            <Link 
              href="/faqs"
              className="text-sm font-medium text-gray-700 hover:text-primary transition duration-150"
            >
              FAQs
            </Link>
            <Link 
              href="/pricing"
              className="text-sm font-medium text-gray-700 hover:text-primary transition duration-150"
            >
              Pricing
            </Link>
            <Link 
              href="/extend-image"
              className="text-sm font-medium text-gray-700 hover:text-primary transition duration-150"
            >
              Extend Image
            </Link>
            <Link 
              href="/voice-clone"
              className="text-sm font-medium text-gray-700 hover:text-primary transition duration-150"
            >
              AI Voice Clone
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                className="text-sm font-medium text-gray-700 hover:text-primary transition duration-150 flex items-center"
                onClick={toggleLanguage}
              >
                <span>EN</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">English</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">简体中文</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">繁體中文</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">日本語</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Español</a>
                </div>
              )}
            </div>
            
            {user ? (
              <button
                onClick={logout}
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-primary hover:bg-primary-dark transition duration-150"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-primary hover:bg-primary-dark transition duration-150"
              >
                Login
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button 
              type="button" 
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none"
              aria-label="Open main menu"
              onClick={toggleMobileMenu}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/features"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-100"
            >
              Features
            </Link>
            <Link 
              href="/faqs"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-100"
            >
              FAQs
            </Link>
            <Link 
              href="/pricing"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-100"
            >
              Pricing
            </Link>
            <Link 
              href="/extend-image"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-100"
            >
              Extend Image
            </Link>
            <Link 
              href="/voice-clone"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-100"
            >
              AI Voice Clone
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
} 
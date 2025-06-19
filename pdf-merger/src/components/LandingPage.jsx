import { useState } from 'react';
import logo from '../../public/logo-large.svg';

export function LandingPage({ onNavigateToMerger, onNavigateToSplitter }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isSplitterHovered, setIsSplitterHovered] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
              <img 
                src={logo} 
                alt="PDF Tools Logo" 
                className="w-10 h-10"
              />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              PDF Tools
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional PDF tools for merging and splitting documents. 
              Drag, drop, reorder, and customize your PDFs with ease.
            </p>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">PDF Merger</h3>
            <p className="text-gray-600 mb-6">Combine multiple PDF files into a single document with drag-and-drop reordering and real-time previews.</p>
            <ul className="text-left text-sm text-gray-600 space-y-2 mb-6">
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Multiple file upload
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Drag & drop reordering
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Blank page insertion
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Custom filenames
              </li>
            </ul>
            <button
              onClick={onNavigateToMerger}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`
                w-full inline-flex items-center justify-center px-6 py-3 text-lg font-semibold text-white rounded-lg shadow-lg transition-all duration-300 transform
                ${isHovered ? 'scale-105 shadow-xl' : 'scale-100'}
                bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800
              `}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              Start Merging
            </button>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">PDF Splitter</h3>
            <p className="text-gray-600 mb-6">Split a single PDF into multiple parts by specifying page ranges with real-time previews.</p>
            <ul className="text-left text-sm text-gray-600 space-y-2 mb-6">
              <li className="flex items-center">
                <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Page range selection
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Multiple split ranges
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Real-time previews
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Custom part names
              </li>
            </ul>
            <button
              onClick={onNavigateToSplitter}
              onMouseEnter={() => setIsSplitterHovered(true)}
              onMouseLeave={() => setIsSplitterHovered(false)}
              className={`
                w-full inline-flex items-center justify-center px-6 py-3 text-lg font-semibold text-white rounded-lg shadow-lg transition-all duration-300 transform
                ${isSplitterHovered ? 'scale-105 shadow-xl' : 'scale-100'}
                bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
              `}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Start Splitting
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Choose My PDF Tools?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy First</h3>
              <p className="text-gray-600 text-sm">All processing happens in your browser. Your files never leave your device.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600 text-sm">Client-side processing means instant results with no waiting for uploads.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">User Friendly</h3>
              <p className="text-gray-600 text-sm">Intuitive interface with drag-and-drop functionality and real-time previews.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-gray-500 text-sm">
          <p>Built with React, Vite, and Tailwind CSS</p>
          <p className="mt-1">100% client-side processing • No data collection • Privacy guaranteed</p>
        </div>
      </div>
    </div>
  );
} 
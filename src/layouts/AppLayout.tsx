import React from 'react';
import Header from './Header';
import Footer from './Footer';
import BackgroundBlobs from './BackgroundBlobs';
import ThemeProvider from '../providers/ThemeProvider';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <div className="relative min-h-screen flex flex-col transition-colors duration-300">
        {/* Floating gradient blobs */}
        <BackgroundBlobs />

        {/* Navigation */}
        <Header />

        {/* Content body */}
        <main className="flex-grow flex flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </ThemeProvider>
  );
};
export default AppLayout;

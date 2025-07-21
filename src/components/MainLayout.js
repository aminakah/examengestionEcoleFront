import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Navbar */}
        <Navbar />
        
        {/* Page Content */}
        <main className="flex-1 py-20 px-6  overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
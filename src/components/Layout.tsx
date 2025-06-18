
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavigation from './TopNavigation';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-full z-10">
        <Sidebar />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Fixed Top Navigation */}
        <div className="fixed top-0 right-0 left-64 z-10">
          <TopNavigation />
        </div>
        
        {/* Scrollable Content */}
        <main className="flex-1 p-6 mt-20 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

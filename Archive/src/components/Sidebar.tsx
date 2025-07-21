
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: '📊',
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: '⚙️',
    },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col h-screen">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">MyApp</h1>
      </div>

      {/* Navigation Menu - Scrollable if needed */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200",
                  location.pathname === item.path
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                )}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Fixed User Section at Bottom */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="mb-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.user_name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {user?.user_name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.user_email}
              </p>
            </div>
          </div>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

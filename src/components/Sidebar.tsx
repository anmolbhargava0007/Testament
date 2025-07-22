import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  MonitorIcon,
  SettingsIcon,
  LogOutIcon,
} from 'lucide-react';
import logo from './../../public/logo.png';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      name: 'Test Suite',
      path: '/testcase',
      icon: <MonitorIcon className="w-5 h-5" />,
    },
    // {
    //   name: 'Settings',
    //   path: '/settings',
    //   icon: <SettingsIcon className="w-5 h-5" />,
    // },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 shadow-md flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 flex justify-center items-center">
        <img src={logo} alt="Logo" className="h-10 object-contain" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium transition-all',
              location.pathname === item.path
                ? 'bg-blue-100 text-[#0F2F61]-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            )}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">
            {user?.user_name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.user_name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.user_email}
            </p>
          </div>
        </div>
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full text-red-600 hover:bg-red-50 justify-start"
        >
          <LogOutIcon className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;

import { useAuth } from '../contexts/AuthContext';

const TopNavigation = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 h-20">
      <div className="flex items-center justify-between h-full">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome back, {user?.user_name}!
          </h2>
          <p className="text-sm text-gray-600">
            Hope you're having a great day
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">{user?.user_name}</p>
            <p className="text-xs text-gray-500">{user?.user_email}</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-lg">
              {user?.user_name?.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;

import { useAuth } from '../contexts/AuthContext';

const TopNavigation = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-2 py-2 h-15">
      <div className="flex items-center justify-end h-full">
        <div className="flex items-center space-x-4">
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
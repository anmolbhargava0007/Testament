
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  const { user } = useAuth();

  const statsCards = [
    {
      title: 'Total Users',
      value: '1,234',
      description: '+20.1% from last month',
      icon: '👥',
    },
    {
      title: 'Active Sessions',
      value: '573',
      description: '+10.5% from last month',
      icon: '📊',
    },
    {
      title: 'Revenue',
      value: '$12,234',
      description: '+15.3% from last month',
      icon: '💰',
    },
    {
      title: 'Performance',
      value: '98.5%',
      description: '+2.1% from last month',
      icon: '📈',
    },
  ];

  const recentActivities = [
    { action: 'User registered', user: 'john@example.com', time: '2 minutes ago' },
    { action: 'Settings updated', user: 'admin@example.com', time: '5 minutes ago' },
    { action: 'Data exported', user: 'jane@example.com', time: '10 minutes ago' },
    { action: 'Report generated', user: 'bob@example.com', time: '15 minutes ago' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.user_name}! Here's what's happening with your application.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <span className="text-2xl">{stat.icon}</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-green-600 mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions performed in your application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {activity.user}
                    </p>
                  </div>
                  <div className="text-xs text-gray-400">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks you might want to perform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200">
                <div className="font-medium text-blue-900">Create New User</div>
                <div className="text-sm text-blue-600">Add a new user to the system</div>
              </button>
              
              <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200">
                <div className="font-medium text-green-900">Generate Report</div>
                <div className="text-sm text-green-600">Create a detailed analytics report</div>
              </button>
              
              <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200">
                <div className="font-medium text-purple-900">System Settings</div>
                <div className="text-sm text-purple-600">Configure application settings</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

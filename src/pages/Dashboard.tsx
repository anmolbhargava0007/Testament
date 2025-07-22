
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">

    </div>
  );
};

export default Dashboard;

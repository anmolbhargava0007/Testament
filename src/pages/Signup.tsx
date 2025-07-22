
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import logo from './../../public/logo.png';

const Signup = () => {
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    user_pwd: '',
    user_mobile: '',
    gender: 'male',
  });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signup(formData);
      toast({
        title: "Success!",
        description: "Your account has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Signup failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <img src={logo} alt="Logo" className="mx-auto w-46 h-16 object-contain" />
          <CardDescription className="text-center">
            Enter your information to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user_name">Full Name</Label>
              <Input
                id="user_name"
                type="text"
                placeholder="Enter your full name"
                value={formData.user_name}
                onChange={(e) => handleInputChange('user_name', e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user_email">Email</Label>
              <Input
                id="user_email"
                type="email"
                placeholder="Enter your email"
                value={formData.user_email}
                onChange={(e) => handleInputChange('user_email', e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user_mobile">Mobile Number</Label>
              <Input
                id="user_mobile"
                type="tel"
                placeholder="Enter your mobile number"
                value={formData.user_mobile}
                onChange={(e) => handleInputChange('user_mobile', e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user_pwd">Password</Label>
              <Input
                id="user_pwd"
                type="password"
                placeholder="Create a password"
                value={formData.user_pwd}
                onChange={(e) => handleInputChange('user_pwd', e.target.value)}
                required
                className="h-11"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;

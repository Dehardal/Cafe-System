import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Loader2, Coffee } from 'lucide-react';
import { loginStart, loginSuccess, loginFailure } from '@/redux/slices/authSlice';
import api from '@/services/api';
import type { RootState } from '@/redux/store';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    shopName: '',
    email: '',
    password: '',
  });
  const { loading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const { data } = await api.post('/users', formData);
      dispatch(loginSuccess(data));
      toast.success('Account created! Welcome to QuickPrint.');
      navigate('/dashboard');
    } catch (error: any) {
      dispatch(loginFailure(error.response?.data?.message || 'Registration failed'));
      toast.error(error.response?.data?.message || 'Check your details');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-[450px] space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-2">
            <Coffee className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="text-sm text-muted-foreground">
            Join hundreds of shops using QuickPrint today.
          </p>
        </div>

        <Card className="border-none shadow-2xl shadow-primary/5">
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-4 p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Owner Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="shop">Shop Name</Label>
                  <Input
                    id="shop"
                    placeholder="Central Cafe"
                    required
                    value={formData.shopName}
                    onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Min. 8 characters"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 px-8 pb-8">
              <Button type="submit" className="w-full h-11 font-bold" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline font-bold">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Loader2, Coffee } from 'lucide-react';
import { loginStart, loginSuccess, loginFailure } from '@/redux/slices/authSlice';
import api from '@/services/api';
import type { RootState } from '@/redux/store';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { loading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const { data } = await api.post('/users/login', formData);
      dispatch(loginSuccess(data));
      toast.success(`Welcome back, ${data.name}!`);
      navigate('/dashboard');
    } catch (error: any) {
      dispatch(loginFailure(error.response?.data?.message || 'Login failed'));
      toast.error(error.response?.data?.message || 'Check your credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-[400px] space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-2">
            <Coffee className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Sign in to QuickPrint</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to access your shop dashboard.
          </p>
        </div>

        <Card className="border-none shadow-2xl shadow-primary/5">
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1">
              {/* Optional header */}
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="#" className="text-xs text-primary hover:underline font-medium">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full h-11 font-bold" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline font-bold">
                  Create one
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
        
        <p className="px-8 text-center text-xs text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link to="#" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="#" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

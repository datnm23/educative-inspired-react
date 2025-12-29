import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { BookOpen, Loader2, ArrowLeft } from 'lucide-react';

const emailSchema = z.string().email('Email không hợp lệ');
const passwordSchema = z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự');

type AuthMode = 'login' | 'register' | 'forgot' | 'reset';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});
  
  const { signIn, signUp, user, loading, resetPassword, updatePassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const modeParam = searchParams.get('mode');
    if (modeParam === 'reset') {
      setMode('reset');
    }
  }, [searchParams]);

  useEffect(() => {
    if (user && !loading && mode !== 'reset') {
      navigate('/');
    }
  }, [user, loading, navigate, mode]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; confirmPassword?: string } = {};
    
    if (mode !== 'reset') {
      const emailResult = emailSchema.safeParse(email);
      if (!emailResult.success) {
        newErrors.email = emailResult.error.errors[0].message;
      }
    }
    
    if (mode === 'login' || mode === 'register' || mode === 'reset') {
      const passwordResult = passwordSchema.safeParse(password);
      if (!passwordResult.success) {
        newErrors.password = passwordResult.error.errors[0].message;
      }
    }
    
    if ((mode === 'register' || mode === 'reset') && password !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              variant: 'destructive',
              title: 'Đăng nhập thất bại',
              description: 'Email hoặc mật khẩu không đúng',
            });
          } else {
            toast({
              variant: 'destructive',
              title: 'Đăng nhập thất bại',
              description: error.message,
            });
          }
        } else {
          toast({
            title: 'Đăng nhập thành công!',
            description: 'Chào mừng bạn quay lại',
          });
        }
      } else if (mode === 'register') {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              variant: 'destructive',
              title: 'Đăng ký thất bại',
              description: 'Email này đã được sử dụng',
            });
          } else {
            toast({
              variant: 'destructive',
              title: 'Đăng ký thất bại',
              description: error.message,
            });
          }
        } else {
          toast({
            title: 'Đăng ký thành công!',
            description: 'Tài khoản của bạn đã được tạo',
          });
        }
      } else if (mode === 'forgot') {
        const { error } = await resetPassword(email);
        if (error) {
          toast({
            variant: 'destructive',
            title: 'Không thể gửi email',
            description: error.message,
          });
        } else {
          toast({
            title: 'Email đã được gửi!',
            description: 'Vui lòng kiểm tra hộp thư của bạn để đặt lại mật khẩu',
          });
          setMode('login');
        }
      } else if (mode === 'reset') {
        const { error } = await updatePassword(password);
        if (error) {
          toast({
            variant: 'destructive',
            title: 'Không thể đặt lại mật khẩu',
            description: error.message,
          });
        } else {
          toast({
            title: 'Đặt lại mật khẩu thành công!',
            description: 'Bạn có thể đăng nhập với mật khẩu mới',
          });
          navigate('/');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Đăng nhập';
      case 'register': return 'Đăng ký tài khoản';
      case 'forgot': return 'Quên mật khẩu';
      case 'reset': return 'Đặt lại mật khẩu';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'login': return 'Chào mừng bạn quay lại! Đăng nhập để tiếp tục học tập.';
      case 'register': return 'Tạo tài khoản mới để bắt đầu hành trình học tập.';
      case 'forgot': return 'Nhập email của bạn để nhận liên kết đặt lại mật khẩu.';
      case 'reset': return 'Nhập mật khẩu mới cho tài khoản của bạn.';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {(mode === 'forgot' || mode === 'reset') && (
            <button
              type="button"
              onClick={() => setMode('login')}
              className="absolute left-6 top-6 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {getTitle()}
          </CardTitle>
          <CardDescription>
            {getDescription()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode !== 'reset' && (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>
            )}
            
            {mode !== 'forgot' && (
              <div className="space-y-2">
                <Label htmlFor="password">
                  {mode === 'reset' ? 'Mật khẩu mới' : 'Mật khẩu'}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>
            )}
            
            {(mode === 'register' || mode === 'reset') && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isSubmitting}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {mode === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                  onClick={() => {
                    setMode('forgot');
                    setErrors({});
                  }}
                >
                  Quên mật khẩu?
                </button>
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                mode === 'login' ? 'Đăng nhập' : 
                mode === 'register' ? 'Đăng ký' :
                mode === 'forgot' ? 'Gửi email đặt lại' :
                'Đặt lại mật khẩu'
              )}
            </Button>
          </form>
          
          {(mode === 'login' || mode === 'register') && (
            <div className="mt-6 text-center">
              <button
                type="button"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setErrors({});
                }}
              >
                {mode === 'login' 
                  ? 'Chưa có tài khoản? Đăng ký ngay' 
                  : 'Đã có tài khoản? Đăng nhập'}
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;

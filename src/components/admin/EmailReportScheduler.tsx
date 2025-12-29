import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Mail, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ScheduleConfig {
  email: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  enabled: boolean;
  time: string;
}

interface EmailReportSchedulerProps {
  reportData?: {
    totalRevenue: number;
    totalStudents: number;
    totalCourses: number;
    revenueChange: number;
    studentsChange: number;
  };
}

export const EmailReportScheduler = ({ reportData }: EmailReportSchedulerProps) => {
  const [schedule, setSchedule] = useState<ScheduleConfig>({
    email: '',
    frequency: 'weekly',
    enabled: false,
    time: '09:00'
  });
  const [isSending, setIsSending] = useState(false);
  const [lastSent, setLastSent] = useState<Date | null>(null);

  const frequencyLabels = {
    daily: 'Hàng ngày',
    weekly: 'Hàng tuần',
    monthly: 'Hàng tháng'
  };

  const handleSendTestEmail = async () => {
    if (!schedule.email) {
      toast.error('Vui lòng nhập địa chỉ email');
      return;
    }

    if (!schedule.email.includes('@')) {
      toast.error('Email không hợp lệ');
      return;
    }

    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-report-email', {
        body: {
          email: schedule.email,
          reportType: schedule.frequency,
          reportData: reportData || {
            totalRevenue: 125000000,
            totalStudents: 1250,
            totalCourses: 45,
            revenueChange: 12.5,
            studentsChange: 8.3
          }
        }
      });

      if (error) throw error;

      if (data.demo) {
        toast.info('Chế độ demo: Email sẽ được gửi khi cấu hình RESEND_API_KEY', {
          description: 'Liên hệ quản trị viên để cấu hình API key'
        });
      } else {
        toast.success('Đã gửi email báo cáo thành công!');
        setLastSent(new Date());
      }
    } catch (error: any) {
      console.error('Error sending email:', error);
      toast.error('Lỗi gửi email: ' + error.message);
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveSchedule = () => {
    if (!schedule.email) {
      toast.error('Vui lòng nhập địa chỉ email');
      return;
    }
    
    // Save to localStorage for demo
    localStorage.setItem('emailReportSchedule', JSON.stringify({
      ...schedule,
      savedAt: new Date().toISOString()
    }));
    
    toast.success('Đã lưu lịch gửi báo cáo', {
      description: `Báo cáo ${frequencyLabels[schedule.frequency].toLowerCase()} sẽ được gửi lúc ${schedule.time}`
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Gửi báo cáo qua Email</CardTitle>
          </div>
          {schedule.enabled && (
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <CheckCircle className="h-3 w-3 mr-1" />
              Đã kích hoạt
            </Badge>
          )}
        </div>
        <CardDescription>
          Tự động gửi báo cáo thống kê định kỳ đến email của bạn
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email nhận báo cáo</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={schedule.email}
              onChange={(e) => setSchedule({ ...schedule, email: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="frequency">Tần suất gửi</Label>
            <Select
              value={schedule.frequency}
              onValueChange={(value: 'daily' | 'weekly' | 'monthly') => 
                setSchedule({ ...schedule, frequency: value })
              }
            >
              <SelectTrigger id="frequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Hàng ngày</SelectItem>
                <SelectItem value="weekly">Hàng tuần</SelectItem>
                <SelectItem value="monthly">Hàng tháng</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="time">Thời gian gửi</Label>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Input
                id="time"
                type="time"
                value={schedule.time}
                onChange={(e) => setSchedule({ ...schedule, time: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tự động gửi</Label>
            <div className="flex items-center gap-3 h-10">
              <Switch
                checked={schedule.enabled}
                onCheckedChange={(checked) => setSchedule({ ...schedule, enabled: checked })}
              />
              <span className="text-sm text-muted-foreground">
                {schedule.enabled ? 'Đã bật' : 'Đã tắt'}
              </span>
            </div>
          </div>
        </div>

        {lastSent && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Lần gửi cuối: {lastSent.toLocaleString('vi-VN')}</span>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button 
            onClick={handleSendTestEmail} 
            disabled={isSending}
            variant="outline"
            className="flex-1"
          >
            <Send className="h-4 w-4 mr-2" />
            {isSending ? 'Đang gửi...' : 'Gửi thử ngay'}
          </Button>
          <Button onClick={handleSaveSchedule} className="flex-1">
            Lưu lịch gửi
          </Button>
        </div>

        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3">
          <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <span>
            Lưu ý: Để gửi email thực, cần cấu hình RESEND_API_KEY trong hệ thống. 
            Hiện tại đang ở chế độ demo.
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

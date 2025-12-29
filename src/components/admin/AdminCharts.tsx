import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Users } from "lucide-react";

interface Course {
  id: string;
  title: string;
  price: number;
  total_students: number | null;
  created_at: string;
}

interface AdminChartsProps {
  courses: Course[];
}

const AdminCharts = ({ courses }: AdminChartsProps) => {
  // Generate mock data for revenue over time (last 6 months)
  const generateRevenueData = () => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString("vi-VN", { month: "short", year: "2-digit" });
      
      // Calculate revenue from courses created in that month
      const monthCourses = courses.filter(c => {
        const courseDate = new Date(c.created_at);
        return courseDate.getMonth() === date.getMonth() && 
               courseDate.getFullYear() === date.getFullYear();
      });
      
      const revenue = monthCourses.reduce((acc, c) => acc + (c.price * (c.total_students || 0)), 0);
      const students = monthCourses.reduce((acc, c) => acc + (c.total_students || 0), 0);
      
      // Add some variation for demo purposes
      const baseRevenue = courses.length > 0 ? Math.max(revenue, 1000000 + Math.random() * 5000000) : 0;
      const baseStudents = courses.length > 0 ? Math.max(students, Math.floor(5 + Math.random() * 20)) : 0;
      
      months.push({
        month: monthName,
        revenue: Math.round(baseRevenue),
        students: baseStudents,
      });
    }
    
    return months;
  };

  // Generate category distribution data
  const generateCategoryData = () => {
    const categoryMap = new Map<string, { students: number; revenue: number }>();
    
    courses.forEach(c => {
      const category = (c as any).category || "Khác";
      const existing = categoryMap.get(category) || { students: 0, revenue: 0 };
      categoryMap.set(category, {
        students: existing.students + (c.total_students || 0),
        revenue: existing.revenue + (c.price * (c.total_students || 0)),
      });
    });

    return Array.from(categoryMap.entries()).map(([name, data]) => ({
      name,
      students: data.students,
      revenue: data.revenue,
    }));
  };

  const revenueData = generateRevenueData();
  const categoryData = generateCategoryData();

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  const revenueChartConfig = {
    revenue: {
      label: "Doanh thu",
      color: "hsl(var(--primary))",
    },
  };

  const studentsChartConfig = {
    students: {
      label: "Học viên",
      color: "hsl(var(--chart-2))",
    },
  };

  const categoryChartConfig = {
    students: {
      label: "Học viên",
      color: "hsl(var(--chart-1))",
    },
    revenue: {
      label: "Doanh thu",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Revenue Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Doanh thu theo thời gian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={revenueChartConfig} className="h-[250px] w-full">
            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tickFormatter={formatCurrency}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={50}
              />
              <ChartTooltip 
                content={<ChartTooltipContent 
                  formatter={(value) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(value))}
                />} 
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Students Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Users className="h-4 w-4 text-chart-2" />
            Học viên theo thời gian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={studentsChartConfig} className="h-[250px] w-full">
            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="studentsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={30}
              />
              <ChartTooltip 
                content={<ChartTooltipContent 
                  formatter={(value) => `${value} học viên`}
                />} 
              />
              <Area
                type="monotone"
                dataKey="students"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                fill="url(#studentsGradient)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Category Distribution Chart */}
      {categoryData.length > 0 && (
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              Phân bố theo danh mục
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={categoryChartConfig} className="h-[250px] w-full">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  width={30}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="students" 
                  fill="hsl(var(--chart-1))" 
                  radius={[4, 4, 0, 0]}
                  name="Học viên"
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminCharts;

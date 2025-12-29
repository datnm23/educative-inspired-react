import { useEffect, useState, useMemo } from "react";
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
} from "recharts";
import { TrendingUp, Users, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Course {
  id: string;
  title: string;
  price: number;
  total_students: number | null;
  created_at: string;
  category?: string;
}

interface Enrollment {
  id: string;
  course_id: string;
  enrolled_at: string;
}

interface AdminChartsProps {
  courses: Course[];
}

interface MonthlyData {
  month: string;
  revenue: number;
  students: number;
  date: Date;
}

const AdminCharts = ({ courses }: AdminChartsProps) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real enrollment data
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const { data, error } = await supabase
          .from("course_enrollments")
          .select("id, course_id, enrolled_at")
          .order("enrolled_at", { ascending: true });

        if (error) {
          console.error("Error fetching enrollments:", error);
          return;
        }

        setEnrollments(data || []);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  // Create a map of course_id to course for quick lookup
  const courseMap = useMemo(() => {
    const map = new Map<string, Course>();
    courses.forEach((course) => {
      map.set(course.id, course);
    });
    return map;
  }, [courses]);

  // Generate real data for revenue and students over time (last 6 months)
  const monthlyData = useMemo(() => {
    const months: MonthlyData[] = [];
    const now = new Date();

    // Create 6 months of data
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString("vi-VN", {
        month: "short",
        year: "2-digit",
      });

      months.push({
        month: monthName,
        revenue: 0,
        students: 0,
        date: date,
      });
    }

    // Aggregate enrollments by month
    enrollments.forEach((enrollment) => {
      const enrollDate = new Date(enrollment.enrolled_at);
      const course = courseMap.get(enrollment.course_id);

      // Find matching month
      const monthIndex = months.findIndex((m) => {
        return (
          m.date.getMonth() === enrollDate.getMonth() &&
          m.date.getFullYear() === enrollDate.getFullYear()
        );
      });

      if (monthIndex !== -1) {
        months[monthIndex].students += 1;
        if (course) {
          months[monthIndex].revenue += course.price;
        }
      }
    });

    return months;
  }, [enrollments, courseMap]);

  // Generate category distribution data from real enrollments
  const categoryData = useMemo(() => {
    const categoryMap = new Map<string, { students: number; revenue: number }>();

    enrollments.forEach((enrollment) => {
      const course = courseMap.get(enrollment.course_id);
      if (course) {
        const category = course.category || "Khác";
        const existing = categoryMap.get(category) || { students: 0, revenue: 0 };
        categoryMap.set(category, {
          students: existing.students + 1,
          revenue: existing.revenue + course.price,
        });
      }
    });

    return Array.from(categoryMap.entries())
      .map(([name, data]) => ({
        name,
        students: data.students,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.students - a.students);
  }, [enrollments, courseMap]);

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

  // Calculate totals for display
  const totalStudents = enrollments.length;
  const totalRevenue = enrollments.reduce((acc, e) => {
    const course = courseMap.get(e.course_id);
    return acc + (course?.price || 0);
  }, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">Tổng doanh thu</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-chart-2">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Tổng đăng ký</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-chart-3">{courses.length}</div>
            <p className="text-xs text-muted-foreground">Tổng khóa học</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-chart-4">
              {totalStudents > 0
                ? new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalRevenue / totalStudents)
                : "0 ₫"}
            </div>
            <p className="text-xs text-muted-foreground">Doanh thu/Học viên</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Doanh thu theo thời gian (6 tháng gần nhất)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={revenueChartConfig} className="h-[250px] w-full">
              <AreaChart
                data={monthlyData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
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
                  content={
                    <ChartTooltipContent
                      formatter={(value) =>
                        new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(Number(value))
                      }
                    />
                  }
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
              Học viên đăng ký theo thời gian (6 tháng gần nhất)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={studentsChartConfig} className="h-[250px] w-full">
              <AreaChart
                data={monthlyData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
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
                  content={
                    <ChartTooltipContent formatter={(value) => `${value} học viên`} />
                  }
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
                Phân bố đăng ký theo danh mục
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={categoryChartConfig} className="h-[250px] w-full">
                <BarChart
                  data={categoryData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
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
    </div>
  );
};

export default AdminCharts;

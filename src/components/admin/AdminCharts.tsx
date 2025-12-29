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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

type TimeRange = "7d" | "30d" | "3m" | "6m" | "1y";

interface DataPoint {
  label: string;
  revenue: number;
  students: number;
  date: Date;
}

const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: "7d", label: "7 ngày" },
  { value: "30d", label: "30 ngày" },
  { value: "3m", label: "3 tháng" },
  { value: "6m", label: "6 tháng" },
  { value: "1y", label: "1 năm" },
];

const AdminCharts = ({ courses }: AdminChartsProps) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("6m");

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

  // Get date range based on selected time range
  const getDateRange = useMemo(() => {
    const now = new Date();
    const endDate = new Date(now);
    let startDate: Date;
    let groupBy: "day" | "week" | "month";

    switch (timeRange) {
      case "7d":
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        groupBy = "day";
        break;
      case "30d":
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 30);
        groupBy = "day";
        break;
      case "3m":
        startDate = new Date(now);
        startDate.setMonth(startDate.getMonth() - 3);
        groupBy = "week";
        break;
      case "6m":
        startDate = new Date(now);
        startDate.setMonth(startDate.getMonth() - 6);
        groupBy = "month";
        break;
      case "1y":
        startDate = new Date(now);
        startDate.setFullYear(startDate.getFullYear() - 1);
        groupBy = "month";
        break;
      default:
        startDate = new Date(now);
        startDate.setMonth(startDate.getMonth() - 6);
        groupBy = "month";
    }

    return { startDate, endDate, groupBy };
  }, [timeRange]);

  // Generate time-based data points
  const timeData = useMemo(() => {
    const { startDate, endDate, groupBy } = getDateRange;
    const dataPoints: DataPoint[] = [];

    if (groupBy === "day") {
      // Generate daily data points
      const current = new Date(startDate);
      while (current <= endDate) {
        dataPoints.push({
          label: current.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
          }),
          revenue: 0,
          students: 0,
          date: new Date(current),
        });
        current.setDate(current.getDate() + 1);
      }
    } else if (groupBy === "week") {
      // Generate weekly data points
      const current = new Date(startDate);
      let weekNum = 1;
      while (current <= endDate) {
        const weekEnd = new Date(current);
        weekEnd.setDate(weekEnd.getDate() + 6);
        dataPoints.push({
          label: `T${weekNum}`,
          revenue: 0,
          students: 0,
          date: new Date(current),
        });
        current.setDate(current.getDate() + 7);
        weekNum++;
      }
    } else {
      // Generate monthly data points
      const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      while (current <= endDate) {
        dataPoints.push({
          label: current.toLocaleDateString("vi-VN", {
            month: "short",
            year: "2-digit",
          }),
          revenue: 0,
          students: 0,
          date: new Date(current),
        });
        current.setMonth(current.getMonth() + 1);
      }
    }

    // Aggregate enrollments into data points
    enrollments.forEach((enrollment) => {
      const enrollDate = new Date(enrollment.enrolled_at);
      if (enrollDate < startDate || enrollDate > endDate) return;

      const course = courseMap.get(enrollment.course_id);

      // Find matching data point
      let matchIndex = -1;

      if (groupBy === "day") {
        matchIndex = dataPoints.findIndex(
          (dp) =>
            dp.date.toDateString() === enrollDate.toDateString()
        );
      } else if (groupBy === "week") {
        matchIndex = dataPoints.findIndex((dp) => {
          const weekEnd = new Date(dp.date);
          weekEnd.setDate(weekEnd.getDate() + 6);
          return enrollDate >= dp.date && enrollDate <= weekEnd;
        });
      } else {
        matchIndex = dataPoints.findIndex(
          (dp) =>
            dp.date.getMonth() === enrollDate.getMonth() &&
            dp.date.getFullYear() === enrollDate.getFullYear()
        );
      }

      if (matchIndex !== -1) {
        dataPoints[matchIndex].students += 1;
        if (course) {
          dataPoints[matchIndex].revenue += course.price;
        }
      }
    });

    return dataPoints;
  }, [enrollments, courseMap, getDateRange]);

  // Filter enrollments for the selected time range
  const filteredEnrollments = useMemo(() => {
    const { startDate, endDate } = getDateRange;
    return enrollments.filter((e) => {
      const enrollDate = new Date(e.enrolled_at);
      return enrollDate >= startDate && enrollDate <= endDate;
    });
  }, [enrollments, getDateRange]);

  // Generate category distribution data from filtered enrollments
  const categoryData = useMemo(() => {
    const categoryMap = new Map<string, { students: number; revenue: number }>();

    filteredEnrollments.forEach((enrollment) => {
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
  }, [filteredEnrollments, courseMap]);

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

  // Calculate totals for the selected time range
  const totalStudents = filteredEnrollments.length;
  const totalRevenue = filteredEnrollments.reduce((acc, e) => {
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
      {/* Time Range Filter */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Thống kê</h3>
        <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Chọn thời gian" />
          </SelectTrigger>
          <SelectContent>
            {TIME_RANGES.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
            <p className="text-xs text-muted-foreground">
              Doanh thu ({TIME_RANGES.find((r) => r.value === timeRange)?.label})
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-chart-2">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Đăng ký ({TIME_RANGES.find((r) => r.value === timeRange)?.label})
            </p>
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
              Doanh thu theo thời gian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={revenueChartConfig} className="h-[250px] w-full">
              <AreaChart
                data={timeData}
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
                  dataKey="label"
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
              Học viên đăng ký theo thời gian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={studentsChartConfig} className="h-[250px] w-full">
              <AreaChart
                data={timeData}
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
                  dataKey="label"
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

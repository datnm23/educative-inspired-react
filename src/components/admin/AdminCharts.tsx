import { useEffect, useState, useMemo, useCallback } from "react";
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
  Legend,
} from "recharts";
import { TrendingUp, Users, Loader2, Download, ArrowUpDown, ArrowUp, ArrowDown, Mail } from "lucide-react";
import { EmailReportScheduler } from "./EmailReportScheduler";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

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
  prevRevenue?: number;
  prevStudents?: number;
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
  const [compareMode, setCompareMode] = useState(false);

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
    let durationMs: number;

    switch (timeRange) {
      case "7d":
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        groupBy = "day";
        durationMs = 7 * 24 * 60 * 60 * 1000;
        break;
      case "30d":
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 30);
        groupBy = "day";
        durationMs = 30 * 24 * 60 * 60 * 1000;
        break;
      case "3m":
        startDate = new Date(now);
        startDate.setMonth(startDate.getMonth() - 3);
        groupBy = "week";
        durationMs = 90 * 24 * 60 * 60 * 1000;
        break;
      case "6m":
        startDate = new Date(now);
        startDate.setMonth(startDate.getMonth() - 6);
        groupBy = "month";
        durationMs = 180 * 24 * 60 * 60 * 1000;
        break;
      case "1y":
        startDate = new Date(now);
        startDate.setFullYear(startDate.getFullYear() - 1);
        groupBy = "month";
        durationMs = 365 * 24 * 60 * 60 * 1000;
        break;
      default:
        startDate = new Date(now);
        startDate.setMonth(startDate.getMonth() - 6);
        groupBy = "month";
        durationMs = 180 * 24 * 60 * 60 * 1000;
    }

    // Previous period for comparison
    const prevEndDate = new Date(startDate.getTime() - 1);
    const prevStartDate = new Date(prevEndDate.getTime() - durationMs);

    return { startDate, endDate, groupBy, prevStartDate, prevEndDate, durationMs };
  }, [timeRange]);

  // Calculate data for a specific period
  const calculatePeriodData = useCallback(
    (startDate: Date, endDate: Date, groupBy: "day" | "week" | "month") => {
      const dataPoints: DataPoint[] = [];

      if (groupBy === "day") {
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
        const current = new Date(startDate);
        let weekNum = 1;
        while (current <= endDate) {
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

        let matchIndex = -1;

        if (groupBy === "day") {
          matchIndex = dataPoints.findIndex(
            (dp) => dp.date.toDateString() === enrollDate.toDateString()
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
    },
    [enrollments, courseMap]
  );

  // Generate time-based data points with comparison
  const timeData = useMemo(() => {
    const { startDate, endDate, groupBy, prevStartDate, prevEndDate } = getDateRange;

    const currentData = calculatePeriodData(startDate, endDate, groupBy);
    
    if (!compareMode) {
      return currentData;
    }

    const prevData = calculatePeriodData(prevStartDate, prevEndDate, groupBy);

    // Merge previous data into current data for comparison
    return currentData.map((dp, index) => ({
      ...dp,
      prevRevenue: prevData[index]?.revenue || 0,
      prevStudents: prevData[index]?.students || 0,
    }));
  }, [getDateRange, calculatePeriodData, compareMode]);

  // Filter enrollments for the selected time range
  const filteredEnrollments = useMemo(() => {
    const { startDate, endDate } = getDateRange;
    return enrollments.filter((e) => {
      const enrollDate = new Date(e.enrolled_at);
      return enrollDate >= startDate && enrollDate <= endDate;
    });
  }, [enrollments, getDateRange]);

  // Previous period enrollments
  const prevFilteredEnrollments = useMemo(() => {
    const { prevStartDate, prevEndDate } = getDateRange;
    return enrollments.filter((e) => {
      const enrollDate = new Date(e.enrolled_at);
      return enrollDate >= prevStartDate && enrollDate <= prevEndDate;
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

  const formatFullCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Calculate totals for the selected time range
  const totalStudents = filteredEnrollments.length;
  const totalRevenue = filteredEnrollments.reduce((acc, e) => {
    const course = courseMap.get(e.course_id);
    return acc + (course?.price || 0);
  }, 0);

  // Previous period totals
  const prevTotalStudents = prevFilteredEnrollments.length;
  const prevTotalRevenue = prevFilteredEnrollments.reduce((acc, e) => {
    const course = courseMap.get(e.course_id);
    return acc + (course?.price || 0);
  }, 0);

  // Calculate percentage changes
  const revenueChange = prevTotalRevenue > 0 
    ? ((totalRevenue - prevTotalRevenue) / prevTotalRevenue) * 100 
    : totalRevenue > 0 ? 100 : 0;
  
  const studentsChange = prevTotalStudents > 0 
    ? ((totalStudents - prevTotalStudents) / prevTotalStudents) * 100 
    : totalStudents > 0 ? 100 : 0;

  // Export functions
  const exportToCSV = useCallback(() => {
    const headers = compareMode
      ? ["Thời gian", "Doanh thu hiện tại", "Học viên hiện tại", "Doanh thu kỳ trước", "Học viên kỳ trước"]
      : ["Thời gian", "Doanh thu", "Học viên"];

    const rows = timeData.map((dp) =>
      compareMode
        ? [dp.label, dp.revenue, dp.students, dp.prevRevenue || 0, dp.prevStudents || 0]
        : [dp.label, dp.revenue, dp.students]
    );

    // Add summary
    rows.push([]);
    rows.push(["Tổng kết"]);
    rows.push(["Tổng doanh thu hiện tại", totalRevenue]);
    rows.push(["Tổng học viên hiện tại", totalStudents]);
    if (compareMode) {
      rows.push(["Tổng doanh thu kỳ trước", prevTotalRevenue]);
      rows.push(["Tổng học viên kỳ trước", prevTotalStudents]);
      rows.push(["% Thay đổi doanh thu", `${revenueChange.toFixed(1)}%`]);
      rows.push(["% Thay đổi học viên", `${studentsChange.toFixed(1)}%`]);
    }

    // Add category data
    rows.push([]);
    rows.push(["Phân bố theo danh mục"]);
    rows.push(["Danh mục", "Học viên", "Doanh thu"]);
    categoryData.forEach((cat) => {
      rows.push([cat.name, cat.students, cat.revenue]);
    });

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `bao-cao-thong-ke-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    
    toast.success("Đã xuất báo cáo CSV thành công!");
  }, [timeData, totalRevenue, totalStudents, prevTotalRevenue, prevTotalStudents, revenueChange, studentsChange, categoryData, compareMode]);

  const exportToExcel = useCallback(() => {
    // Create Excel-compatible XML
    const timeRangeLabel = TIME_RANGES.find((r) => r.value === timeRange)?.label || timeRange;
    
    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
<Styles>
  <Style ss:ID="header"><Font ss:Bold="1"/><Interior ss:Color="#4472C4" ss:Pattern="Solid"/><Font ss:Color="#FFFFFF"/></Style>
  <Style ss:ID="currency"><NumberFormat ss:Format="#,##0"/></Style>
  <Style ss:ID="percent"><NumberFormat ss:Format="0.0%"/></Style>
  <Style ss:ID="title"><Font ss:Bold="1" ss:Size="14"/></Style>
</Styles>
<Worksheet ss:Name="Báo cáo thống kê">
<Table>
  <Row><Cell ss:StyleID="title"><Data ss:Type="String">Báo cáo thống kê - ${timeRangeLabel}</Data></Cell></Row>
  <Row><Cell><Data ss:Type="String">Ngày xuất: ${new Date().toLocaleDateString("vi-VN")}</Data></Cell></Row>
  <Row></Row>
  <Row>
    ${compareMode 
      ? `<Cell ss:StyleID="header"><Data ss:Type="String">Thời gian</Data></Cell>
         <Cell ss:StyleID="header"><Data ss:Type="String">Doanh thu hiện tại</Data></Cell>
         <Cell ss:StyleID="header"><Data ss:Type="String">Học viên hiện tại</Data></Cell>
         <Cell ss:StyleID="header"><Data ss:Type="String">Doanh thu kỳ trước</Data></Cell>
         <Cell ss:StyleID="header"><Data ss:Type="String">Học viên kỳ trước</Data></Cell>`
      : `<Cell ss:StyleID="header"><Data ss:Type="String">Thời gian</Data></Cell>
         <Cell ss:StyleID="header"><Data ss:Type="String">Doanh thu</Data></Cell>
         <Cell ss:StyleID="header"><Data ss:Type="String">Học viên</Data></Cell>`}
  </Row>`;

    timeData.forEach((dp) => {
      xmlContent += `<Row>
    <Cell><Data ss:Type="String">${dp.label}</Data></Cell>
    <Cell ss:StyleID="currency"><Data ss:Type="Number">${dp.revenue}</Data></Cell>
    <Cell><Data ss:Type="Number">${dp.students}</Data></Cell>
    ${compareMode ? `<Cell ss:StyleID="currency"><Data ss:Type="Number">${dp.prevRevenue || 0}</Data></Cell>
    <Cell><Data ss:Type="Number">${dp.prevStudents || 0}</Data></Cell>` : ""}
  </Row>`;
    });

    // Summary section
    xmlContent += `<Row></Row>
  <Row><Cell ss:StyleID="title"><Data ss:Type="String">Tổng kết</Data></Cell></Row>
  <Row><Cell><Data ss:Type="String">Tổng doanh thu hiện tại</Data></Cell><Cell ss:StyleID="currency"><Data ss:Type="Number">${totalRevenue}</Data></Cell></Row>
  <Row><Cell><Data ss:Type="String">Tổng học viên hiện tại</Data></Cell><Cell><Data ss:Type="Number">${totalStudents}</Data></Cell></Row>`;

    if (compareMode) {
      xmlContent += `<Row><Cell><Data ss:Type="String">Tổng doanh thu kỳ trước</Data></Cell><Cell ss:StyleID="currency"><Data ss:Type="Number">${prevTotalRevenue}</Data></Cell></Row>
  <Row><Cell><Data ss:Type="String">Tổng học viên kỳ trước</Data></Cell><Cell><Data ss:Type="Number">${prevTotalStudents}</Data></Cell></Row>
  <Row><Cell><Data ss:Type="String">% Thay đổi doanh thu</Data></Cell><Cell><Data ss:Type="String">${revenueChange.toFixed(1)}%</Data></Cell></Row>
  <Row><Cell><Data ss:Type="String">% Thay đổi học viên</Data></Cell><Cell><Data ss:Type="String">${studentsChange.toFixed(1)}%</Data></Cell></Row>`;
    }

    // Category section
    xmlContent += `<Row></Row>
  <Row><Cell ss:StyleID="title"><Data ss:Type="String">Phân bố theo danh mục</Data></Cell></Row>
  <Row>
    <Cell ss:StyleID="header"><Data ss:Type="String">Danh mục</Data></Cell>
    <Cell ss:StyleID="header"><Data ss:Type="String">Học viên</Data></Cell>
    <Cell ss:StyleID="header"><Data ss:Type="String">Doanh thu</Data></Cell>
  </Row>`;

    categoryData.forEach((cat) => {
      xmlContent += `<Row>
    <Cell><Data ss:Type="String">${cat.name}</Data></Cell>
    <Cell><Data ss:Type="Number">${cat.students}</Data></Cell>
    <Cell ss:StyleID="currency"><Data ss:Type="Number">${cat.revenue}</Data></Cell>
  </Row>`;
    });

    xmlContent += `</Table></Worksheet></Workbook>`;

    const blob = new Blob([xmlContent], { type: "application/vnd.ms-excel" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `bao-cao-thong-ke-${new Date().toISOString().split("T")[0]}.xls`;
    link.click();
    
    toast.success("Đã xuất báo cáo Excel thành công!");
  }, [timeData, totalRevenue, totalStudents, prevTotalRevenue, prevTotalStudents, revenueChange, studentsChange, categoryData, compareMode, timeRange]);

  const revenueChartConfig = {
    revenue: {
      label: "Doanh thu hiện tại",
      color: "hsl(var(--primary))",
    },
    prevRevenue: {
      label: "Doanh thu kỳ trước",
      color: "hsl(var(--muted-foreground))",
    },
  };

  const studentsChartConfig = {
    students: {
      label: "Học viên hiện tại",
      color: "hsl(var(--chart-2))",
    },
    prevStudents: {
      label: "Học viên kỳ trước",
      color: "hsl(var(--muted-foreground))",
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

  const ChangeIndicator = ({ value, label }: { value: number; label: string }) => {
    if (!compareMode) return null;
    
    const isPositive = value > 0;
    const isZero = value === 0;
    
    return (
      <div className={`flex items-center gap-1 text-xs ${isZero ? "text-muted-foreground" : isPositive ? "text-green-600" : "text-red-600"}`}>
        {isZero ? (
          <ArrowUpDown className="h-3 w-3" />
        ) : isPositive ? (
          <ArrowUp className="h-3 w-3" />
        ) : (
          <ArrowDown className="h-3 w-3" />
        )}
        <span>{isPositive ? "+" : ""}{value.toFixed(1)}% so với kỳ trước</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-8">
      {/* Time Range Filter & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h3 className="text-lg font-semibold">Thống kê</h3>
        <div className="flex flex-wrap items-center gap-4">
          {/* Compare Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="compare-mode"
              checked={compareMode}
              onCheckedChange={setCompareMode}
            />
            <Label htmlFor="compare-mode" className="text-sm">So sánh kỳ trước</Label>
          </div>

          {/* Time Range Select */}
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

          {/* Export Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Xuất báo cáo
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportToCSV}>
                Xuất CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToExcel}>
                Xuất Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">
              {formatFullCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Doanh thu ({TIME_RANGES.find((r) => r.value === timeRange)?.label})
            </p>
            <ChangeIndicator value={revenueChange} label="doanh thu" />
            {compareMode && (
              <p className="text-xs text-muted-foreground mt-1">
                Kỳ trước: {formatFullCurrency(prevTotalRevenue)}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-chart-2">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Đăng ký ({TIME_RANGES.find((r) => r.value === timeRange)?.label})
            </p>
            <ChangeIndicator value={studentsChange} label="học viên" />
            {compareMode && (
              <p className="text-xs text-muted-foreground mt-1">
                Kỳ trước: {prevTotalStudents}
              </p>
            )}
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
              {totalStudents > 0 ? formatFullCurrency(totalRevenue / totalStudents) : "0 ₫"}
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
                  <linearGradient id="prevRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
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
                      formatter={(value) => formatFullCurrency(Number(value))}
                    />
                  }
                />
                {compareMode && (
                  <Area
                    type="monotone"
                    dataKey="prevRevenue"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fill="url(#prevRevenueGradient)"
                    name="Kỳ trước"
                  />
                )}
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                  name="Hiện tại"
                />
                {compareMode && <Legend />}
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
                  <linearGradient id="prevStudentsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
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
                {compareMode && (
                  <Area
                    type="monotone"
                    dataKey="prevStudents"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fill="url(#prevStudentsGradient)"
                    name="Kỳ trước"
                  />
                )}
                <Area
                  type="monotone"
                  dataKey="students"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  fill="url(#studentsGradient)"
                  name="Hiện tại"
                />
                {compareMode && <Legend />}
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

      {/* Email Report Scheduler */}
      <EmailReportScheduler 
        reportData={{
          totalRevenue,
          totalStudents,
          totalCourses: courses.length,
          revenueChange,
          studentsChange
        }}
      />
    </div>
  );
};

export default AdminCharts;

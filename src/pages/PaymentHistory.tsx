import { Navigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Receipt, Download, CreditCard, Calendar, CheckCircle2, 
  Loader2, ExternalLink
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";

// Mock payment history data
const paymentHistory = [
  {
    id: "INV-2024-001",
    date: "15/12/2024",
    description: "System Design Interview Course",
    amount: 79,
    status: "completed",
    method: "Visa •••• 4242"
  },
  {
    id: "INV-2024-002",
    date: "01/12/2024",
    description: "React - The Complete Guide",
    amount: 89,
    status: "completed",
    method: "Mastercard •••• 5555"
  },
  {
    id: "INV-2024-003",
    date: "20/11/2024",
    description: "Frontend Developer Path",
    amount: 199,
    status: "completed",
    method: "Visa •••• 4242"
  },
  {
    id: "INV-2024-004",
    date: "05/11/2024",
    description: "JavaScript Essential",
    amount: 49,
    status: "refunded",
    method: "Visa •••• 4242"
  }
];

const stats = [
  { label: "Tổng chi tiêu", value: "$416", icon: CreditCard },
  { label: "Số giao dịch", value: "4", icon: Receipt },
  { label: "Khóa học đã mua", value: "4", icon: Calendar }
];

const PaymentHistory = () => {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container max-w-5xl">
          <h1 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Receipt className="w-8 h-8" />
            Lịch sử thanh toán
          </h1>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payment Table */}
          <Card>
            <CardHeader>
              <CardTitle>Giao dịch gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              {paymentHistory.length === 0 ? (
                <div className="text-center py-12">
                  <Receipt className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Chưa có giao dịch nào</p>
                  <Link to="/courses">
                    <Button className="mt-4">Khám phá khóa học</Button>
                  </Link>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã hóa đơn</TableHead>
                      <TableHead>Ngày</TableHead>
                      <TableHead>Mô tả</TableHead>
                      <TableHead>Phương thức</TableHead>
                      <TableHead>Số tiền</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentHistory.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.id}</TableCell>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {payment.description}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {payment.method}
                        </TableCell>
                        <TableCell className="font-medium">${payment.amount}</TableCell>
                        <TableCell>
                          <Badge variant={payment.status === "completed" ? "default" : "secondary"}>
                            {payment.status === "completed" ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Hoàn thành
                              </>
                            ) : (
                              "Hoàn tiền"
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Download className="w-4 h-4" />
                            PDF
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Phương thức thanh toán
                <Button variant="outline" size="sm">
                  Thêm thẻ mới
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center text-white text-xs font-bold">
                      VISA
                    </div>
                    <div>
                      <p className="font-medium text-foreground">•••• •••• •••• 4242</p>
                      <p className="text-sm text-muted-foreground">Hết hạn 12/26</p>
                    </div>
                  </div>
                  <Badge>Mặc định</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded flex items-center justify-center text-white text-xs font-bold">
                      MC
                    </div>
                    <div>
                      <p className="font-medium text-foreground">•••• •••• •••• 5555</p>
                      <p className="text-sm text-muted-foreground">Hết hạn 08/25</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Đặt mặc định</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentHistory;

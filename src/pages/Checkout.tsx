import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  CreditCard, Lock, ArrowLeft, CheckCircle2, ShoppingCart,
  Loader2, MapPin, Tag, X, Check
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

// Mock discount codes
const DISCOUNT_CODES: Record<string, { percent: number; description: string }> = {
  "SAVE10": { percent: 10, description: "Giảm 10%" },
  "SAVE20": { percent: 20, description: "Giảm 20%" },
  "WELCOME": { percent: 15, description: "Giảm 15% cho người mới" },
};

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Form state - Payment
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  // Form state - Billing Address
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Việt Nam");

  // Discount code
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number } | null>(null);
  const [discountError, setDiscountError] = useState("");

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

  if (items.length === 0 && !completed) {
    return <Navigate to="/cart" replace />;
  }

  const handleApplyDiscount = () => {
    const code = discountCode.trim().toUpperCase();
    setDiscountError("");

    if (!code) {
      setDiscountError("Vui lòng nhập mã giảm giá");
      return;
    }

    const discount = DISCOUNT_CODES[code];
    if (discount) {
      setAppliedDiscount({ code, percent: discount.percent });
      toast.success(`Áp dụng thành công: ${discount.description}`);
      setDiscountCode("");
    } else {
      setDiscountError("Mã giảm giá không hợp lệ");
    }
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
    toast.info("Đã xóa mã giảm giá");
  };

  const discountAmount = appliedDiscount ? (total * appliedDiscount.percent) / 100 : 0;
  const finalTotal = total - discountAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    setProcessing(false);
    setCompleted(true);
    clearCart();

    toast.success("Thanh toán thành công!");
  };

  if (completed) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-12">
          <Card className="max-w-md w-full mx-4 text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Thanh toán thành công!
              </h2>
              <p className="text-muted-foreground mb-6">
                Cảm ơn bạn đã mua khóa học. Bạn có thể bắt đầu học ngay bây giờ.
              </p>
              <div className="flex flex-col gap-3">
                <Link to="/my-learning">
                  <Button className="w-full">Bắt đầu học ngay</Button>
                </Link>
                <Link to="/courses">
                  <Button variant="outline" className="w-full">Khám phá thêm</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container max-w-5xl">
          <Link 
            to="/cart" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại giỏ hàng
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-8">Thanh toán</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Billing Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Thông tin thanh toán
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Họ và tên *</Label>
                        <Input
                          id="fullName"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Nguyễn Văn A"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="email@example.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại *</Label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="0901234567"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Quốc gia</Label>
                        <Input
                          id="country"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="Việt Nam"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Địa chỉ</Label>
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="123 Đường ABC, Quận 1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">Thành phố</Label>
                      <Input
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="TP. Hồ Chí Minh"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Phương thức thanh toán
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex-1 cursor-pointer">
                          Thẻ tín dụng / Ghi nợ
                        </Label>
                        <div className="flex gap-2">
                          <div className="w-10 h-6 bg-muted rounded flex items-center justify-center text-xs font-bold">VISA</div>
                          <div className="w-10 h-6 bg-muted rounded flex items-center justify-center text-xs font-bold">MC</div>
                        </div>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Card Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin thẻ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Tên trên thẻ *</Label>
                      <Input
                        id="cardName"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="NGUYEN VAN A"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Số thẻ *</Label>
                      <Input
                        id="cardNumber"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Ngày hết hạn *</Label>
                        <Input
                          id="expiryDate"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input
                          id="cvv"
                          type="password"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          placeholder="•••"
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4">
                      <Lock className="w-4 h-4" />
                      Thông tin thanh toán được mã hóa an toàn
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Thanh toán ${finalTotal.toFixed(2)}
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Đơn hàng ({items.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-16 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground line-clamp-1">
                            {item.title}
                          </p>
                          <p className="text-sm text-primary">${item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  {/* Discount Code Input */}
                  <div className="mb-4">
                    <Label className="flex items-center gap-2 mb-2">
                      <Tag className="w-4 h-4" />
                      Mã giảm giá
                    </Label>
                    {appliedDiscount ? (
                      <div className="flex items-center justify-between p-3 bg-accent/10 border border-accent/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-accent" />
                          <span className="text-sm font-medium text-accent">
                            {appliedDiscount.code} (-{appliedDiscount.percent}%)
                          </span>
                        </div>
                        <button 
                          type="button"
                          onClick={removeDiscount}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          value={discountCode}
                          onChange={(e) => {
                            setDiscountCode(e.target.value);
                            setDiscountError("");
                          }}
                          placeholder="Nhập mã giảm giá"
                          className="flex-1"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleApplyDiscount}
                        >
                          Áp dụng
                        </Button>
                      </div>
                    )}
                    {discountError && (
                      <p className="text-sm text-destructive mt-1">{discountError}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Thử: SAVE10, SAVE20, WELCOME
                    </p>
                  </div>

                  <Separator className="my-4" />

                  {/* Price Summary */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tạm tính</span>
                      <span className="text-foreground">${total.toFixed(2)}</span>
                    </div>
                    {appliedDiscount && (
                      <div className="flex justify-between text-sm">
                        <span className="text-accent">Giảm giá ({appliedDiscount.percent}%)</span>
                        <span className="text-accent">-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between font-bold">
                    <span className="text-foreground">Tổng cộng</span>
                    <span className="text-foreground text-xl">${finalTotal.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;

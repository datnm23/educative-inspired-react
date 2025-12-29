import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, ArrowRight, Tag, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/useCart";

const Cart = () => {
  const { items, removeItem, total, clearCart } = useCart();

  const discount = items.reduce((sum, item) => sum + (item.originalPrice - item.price), 0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          <h1 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <ShoppingCart className="w-8 h-8" />
            Giỏ hàng ({items.length})
          </h1>

          {items.length === 0 ? (
            <Card className="p-12 text-center">
              <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Giỏ hàng trống
              </h2>
              <p className="text-muted-foreground mb-6">
                Khám phá các khóa học và thêm vào giỏ hàng
              </p>
              <Link to="/courses">
                <Button>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Khám phá khóa học
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-32 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <Link to={`/courses/${item.id}`}>
                            <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                              {item.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground">{item.instructor}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="font-bold text-foreground">${item.price}</span>
                            {item.originalPrice > item.price && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${item.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button 
                  variant="outline" 
                  onClick={clearCart}
                  className="text-muted-foreground"
                >
                  Xóa tất cả
                </Button>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">Tóm tắt đơn hàng</h3>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Giá gốc</span>
                        <span className="text-foreground">${total + discount}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            Giảm giá
                          </span>
                          <span className="text-accent">-${discount}</span>
                        </div>
                      )}
                    </div>

                    <Separator className="my-4" />

                    <div className="flex justify-between font-bold mb-6">
                      <span className="text-foreground">Tổng cộng</span>
                      <span className="text-foreground text-xl">${total}</span>
                    </div>

                    <Link to="/checkout">
                      <Button className="w-full" size="lg">
                        Thanh toán
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>

                    <p className="text-xs text-muted-foreground text-center mt-4">
                      Đảm bảo hoàn tiền trong 30 ngày
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;

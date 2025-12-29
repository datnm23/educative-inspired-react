import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X, ChevronDown, LogOut, User, Bookmark, GraduationCap, ShoppingCart, Settings, Receipt, Presentation, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useUserRole } from "@/hooks/useUserRole";
import NotificationDropdown from "@/components/NotificationDropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { label: "Khóa học", href: "/courses", hasDropdown: false },
  { label: "Lộ trình", href: "/learning-paths", hasDropdown: false },
  { label: "Blog", href: "/blog", hasDropdown: false },
  { label: "Bảng giá", href: "/pricing", hasDropdown: false },
  { label: "Hỗ trợ", href: "/faq", hasDropdown: false },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const { itemCount } = useCart();
  const { isAdmin } = useUserRole();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">E</span>
              </div>
              <span className="font-bold text-xl text-foreground">EduLearn</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`nav-link flex items-center gap-1 text-sm font-medium ${
                    location.pathname === item.href ? "text-foreground" : ""
                  }`}
                >
                  {item.label}
                  {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <button className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/cart')}>
              <ShoppingCart className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>

            {!loading && (
              user ? (
                <>
                  <NotificationDropdown />
                  <Button variant="ghost" size="icon" className="hidden md:inline-flex" onClick={() => navigate('/my-learning')}>
                    <GraduationCap className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="hidden md:inline-flex" onClick={() => navigate('/saved-posts')}>
                    <Bookmark className="w-4 h-4" />
                  </Button>
                  
                  {/* User Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="hidden md:inline-flex gap-2">
                        <User className="w-4 h-4" />
                        {user.email?.split('@')[0]}
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/my-learning')}>
                        <GraduationCap className="w-4 h-4 mr-2" />
                        Khóa học của tôi
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/payment-history')}>
                        <Receipt className="w-4 h-4 mr-2" />
                        Lịch sử thanh toán
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/instructor-dashboard')}>
                        <Presentation className="w-4 h-4 mr-2" />
                        Quản lý giảng viên
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem onClick={() => navigate('/admin')}>
                          <Shield className="w-4 h-4 mr-2" />
                          Quản trị Admin
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/settings')}>
                        <Settings className="w-4 h-4 mr-2" />
                        Cài đặt tài khoản
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Đăng xuất
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="hidden md:inline-flex" onClick={() => navigate('/auth')}>
                    Đăng nhập
                  </Button>
                  <Button variant="hero" className="hidden md:inline-flex" onClick={() => navigate('/auth')}>
                    Đăng ký miễn phí
                  </Button>
                </>
              )
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="flex items-center justify-between py-2 text-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                  {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                {user ? (
                  <>
                    <Button variant="outline" className="w-full gap-2" onClick={() => { navigate('/my-learning'); setIsMenuOpen(false); }}>
                      <GraduationCap className="w-4 h-4" />
                      Khóa học của tôi
                    </Button>
                    <Button variant="outline" className="w-full gap-2" onClick={() => { navigate('/saved-posts'); setIsMenuOpen(false); }}>
                      <Bookmark className="w-4 h-4" />
                      Bài viết đã lưu
                    </Button>
                    <Button variant="outline" className="w-full gap-2" onClick={() => { navigate('/payment-history'); setIsMenuOpen(false); }}>
                      <Receipt className="w-4 h-4" />
                      Lịch sử thanh toán
                    </Button>
                    <Button variant="outline" className="w-full gap-2" onClick={() => { navigate('/settings'); setIsMenuOpen(false); }}>
                      <Settings className="w-4 h-4" />
                      Cài đặt
                    </Button>
                    <Button variant="ghost" className="w-full gap-2" onClick={() => { handleSignOut(); setIsMenuOpen(false); }}>
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full" onClick={() => { navigate('/auth'); setIsMenuOpen(false); }}>
                      Đăng nhập
                    </Button>
                    <Button variant="hero" className="w-full" onClick={() => { navigate('/auth'); setIsMenuOpen(false); }}>
                      Đăng ký miễn phí
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

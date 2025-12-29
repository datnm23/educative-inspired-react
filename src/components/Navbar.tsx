import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X, ChevronDown, LogOut, User, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { label: "Khóa học", href: "/courses", hasDropdown: false },
  { label: "Blog", href: "/blog", hasDropdown: false },
  { label: "Bảng giá", href: "/pricing", hasDropdown: false },
  { label: "Về chúng tôi", href: "/about", hasDropdown: false },
  { label: "Hỗ trợ", href: "/faq", hasDropdown: false },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();

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
          <div className="flex items-center gap-4">
            <button className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Search className="w-5 h-5" />
              <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 bg-muted rounded text-xs text-muted-foreground">
                ⌘K
              </kbd>
            </button>

            {!loading && (
              user ? (
                <>
                  <Button variant="ghost" size="icon" className="hidden md:inline-flex" onClick={() => navigate('/saved-posts')}>
                    <Bookmark className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" className="hidden md:inline-flex gap-2" onClick={() => navigate('/dashboard')}>
                    <User className="w-4 h-4" />
                    {user.email?.split('@')[0]}
                  </Button>
                  <Button variant="outline" className="hidden md:inline-flex gap-2" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </Button>
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
                    <Button variant="outline" className="w-full gap-2" onClick={() => { navigate('/saved-posts'); setIsMenuOpen(false); }}>
                      <Bookmark className="w-4 h-4" />
                      Bài viết đã lưu
                    </Button>
                    <Button variant="outline" className="w-full gap-2" onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }}>
                      <User className="w-4 h-4" />
                      {user.email?.split('@')[0]}
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

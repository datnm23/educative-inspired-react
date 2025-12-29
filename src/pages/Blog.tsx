import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Search, Calendar, User, ArrowRight, Clock } from "lucide-react";

const blogPosts = [
  {
    id: "1",
    title: "10 Xu hướng công nghệ đáng chú ý năm 2024",
    excerpt: "Khám phá những xu hướng công nghệ mới nhất đang định hình tương lai của ngành IT và cách bạn có thể chuẩn bị cho chúng.",
    author: "Nguyễn Văn A",
    date: "2024-01-15",
    readTime: "8 phút",
    category: "Công nghệ",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
    featured: true,
  },
  {
    id: "2",
    title: "Hướng dẫn học React từ A đến Z cho người mới",
    excerpt: "Lộ trình chi tiết giúp bạn làm chủ React từ cơ bản đến nâng cao, kèm theo các dự án thực hành.",
    author: "Trần Thị B",
    date: "2024-01-12",
    readTime: "12 phút",
    category: "Lập trình",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    featured: true,
  },
  {
    id: "3",
    title: "Kỹ năng mềm quan trọng cho lập trình viên",
    excerpt: "Ngoài kỹ năng code, những kỹ năng mềm nào giúp bạn thành công trong sự nghiệp lập trình?",
    author: "Lê Văn C",
    date: "2024-01-10",
    readTime: "6 phút",
    category: "Kỹ năng",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
    featured: false,
  },
  {
    id: "4",
    title: "Machine Learning cơ bản: Bắt đầu từ đâu?",
    excerpt: "Hướng dẫn chi tiết cho người mới bắt đầu muốn tìm hiểu về Machine Learning và AI.",
    author: "Phạm Thị D",
    date: "2024-01-08",
    readTime: "10 phút",
    category: "AI/ML",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
    featured: false,
  },
  {
    id: "5",
    title: "Tips tối ưu performance cho ứng dụng web",
    excerpt: "Các kỹ thuật và best practices giúp cải thiện tốc độ và hiệu suất của website.",
    author: "Hoàng Văn E",
    date: "2024-01-05",
    readTime: "9 phút",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    featured: false,
  },
  {
    id: "6",
    title: "DevOps cho người mới: Docker và Kubernetes",
    excerpt: "Tìm hiểu về containerization và orchestration - hai công nghệ quan trọng trong DevOps hiện đại.",
    author: "Nguyễn Thị F",
    date: "2024-01-03",
    readTime: "15 phút",
    category: "DevOps",
    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800",
    featured: false,
  },
];

const categories = ["Tất cả", "Công nghệ", "Lập trình", "Kỹ năng", "AI/ML", "Web Development", "DevOps"];

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Tất cả" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = filteredPosts.filter((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Blog & Tin tức
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Cập nhật những kiến thức mới nhất, chia sẻ kinh nghiệm và xu hướng trong ngành công nghệ
            </p>
            
            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-base"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer px-4 py-2 text-sm transition-colors hover:bg-primary hover:text-primary-foreground"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-6">Bài viết nổi bật</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredPosts.map((post) => (
                <Link key={post.id} to={`/blog/${post.id}`}>
                  <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-4 left-4 bg-primary">
                        {post.category}
                      </Badge>
                    </div>
                    <CardHeader>
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {post.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(post.date).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime}
                      </span>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Regular Posts */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-6">Tất cả bài viết</h2>
          
          {regularPosts.length === 0 && featuredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Không tìm thấy bài viết nào phù hợp.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post) => (
                <Link key={post.id} to={`/blog/${post.id}`}>
                  <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">
                        {post.category}
                      </Badge>
                    </div>
                    <CardHeader className="flex-grow">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mt-2">{post.excerpt}</p>
                    </CardHeader>
                    <CardFooter className="flex items-center justify-between text-xs text-muted-foreground pt-0">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.date).toLocaleDateString("vi-VN")}
                      </span>
                      <span className="flex items-center gap-1 text-primary group-hover:translate-x-1 transition-transform">
                        Đọc thêm <ArrowRight className="h-3 w-3" />
                      </span>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;

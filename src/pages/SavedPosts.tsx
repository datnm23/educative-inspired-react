import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Calendar, ArrowRight, Bookmark, BookmarkX } from "lucide-react";
import { useSavedPosts } from "@/hooks/useSavedPosts";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

// Same blog posts data - in a real app this would come from API/database
const blogPosts = [
  {
    id: "1",
    title: "10 Xu hướng công nghệ đáng chú ý năm 2024",
    excerpt: "Khám phá những xu hướng công nghệ mới nhất đang định hình tương lai của ngành IT.",
    date: "2024-01-15",
    category: "Công nghệ",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
  },
  {
    id: "2",
    title: "Hướng dẫn học React từ A đến Z cho người mới",
    excerpt: "Lộ trình chi tiết giúp bạn làm chủ React từ cơ bản đến nâng cao.",
    date: "2024-01-12",
    category: "Lập trình",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
  },
  {
    id: "3",
    title: "Kỹ năng mềm quan trọng cho lập trình viên",
    excerpt: "Ngoài kỹ năng code, những kỹ năng mềm nào giúp bạn thành công?",
    date: "2024-01-10",
    category: "Kỹ năng",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
  },
  {
    id: "4",
    title: "Machine Learning cơ bản: Bắt đầu từ đâu?",
    excerpt: "Hướng dẫn chi tiết cho người mới bắt đầu muốn tìm hiểu về Machine Learning và AI.",
    date: "2024-01-08",
    category: "AI/ML",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
  },
  {
    id: "5",
    title: "Tips tối ưu performance cho ứng dụng web",
    excerpt: "Các kỹ thuật và best practices giúp cải thiện tốc độ và hiệu suất của website.",
    date: "2024-01-05",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
  },
  {
    id: "6",
    title: "DevOps cho người mới: Docker và Kubernetes",
    excerpt: "Tìm hiểu về containerization và orchestration - hai công nghệ quan trọng trong DevOps hiện đại.",
    date: "2024-01-03",
    category: "DevOps",
    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800",
  },
];

const SavedPosts = () => {
  const { savedPosts, loading, toggleSavePost } = useSavedPosts();
  const { user } = useAuth();

  const savedBlogPosts = blogPosts.filter((post) => savedPosts.includes(post.id));

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <Bookmark className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-4">Đăng nhập để xem bài viết đã lưu</h1>
          <p className="text-muted-foreground mb-6">
            Bạn cần đăng nhập để lưu và xem lại các bài viết yêu thích.
          </p>
          <Link to="/auth">
            <Button>Đăng nhập ngay</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Bookmark className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Bài viết đã lưu
            </h1>
            <p className="text-lg text-muted-foreground">
              Danh sách các bài viết bạn đã lưu để đọc sau
            </p>
          </div>
        </div>
      </section>

      {/* Saved Posts */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Đang tải...</p>
            </div>
          ) : savedBlogPosts.length === 0 ? (
            <div className="text-center py-16">
              <BookmarkX className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Chưa có bài viết nào được lưu
              </h2>
              <p className="text-muted-foreground mb-6">
                Khám phá các bài viết và nhấn nút lưu để thêm vào danh sách yêu thích.
              </p>
              <Link to="/blog">
                <Button>
                  Khám phá Blog
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground mb-6">
                {savedBlogPosts.length} bài viết đã lưu
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedBlogPosts.map((post) => (
                  <Card key={post.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                    <Link to={`/blog/${post.id}`}>
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
                    </Link>
                    <CardHeader className="flex-grow">
                      <Link to={`/blog/${post.id}`}>
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-muted-foreground text-sm line-clamp-2 mt-2">{post.excerpt}</p>
                    </CardHeader>
                    <CardFooter className="flex items-center justify-between text-xs text-muted-foreground pt-0">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.date).toLocaleDateString("vi-VN")}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSavePost(post.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <BookmarkX className="h-4 w-4 mr-1" />
                        Bỏ lưu
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SavedPosts;

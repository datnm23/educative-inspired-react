import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, Clock, ArrowLeft, Share2, Bookmark, ThumbsUp, MessageSquare } from "lucide-react";

const blogPosts = [
  {
    id: "1",
    title: "10 Xu hướng công nghệ đáng chú ý năm 2024",
    excerpt: "Khám phá những xu hướng công nghệ mới nhất đang định hình tương lai của ngành IT.",
    content: `
      <h2>Giới thiệu</h2>
      <p>Năm 2024 đánh dấu bước ngoặt quan trọng trong sự phát triển của công nghệ. Từ AI đến blockchain, những xu hướng mới đang thay đổi cách chúng ta làm việc và sống.</p>
      
      <h2>1. Trí tuệ nhân tạo (AI) và Machine Learning</h2>
      <p>AI tiếp tục là xu hướng hàng đầu, với sự phát triển mạnh mẽ của các mô hình ngôn ngữ lớn (LLM) như GPT-4, Claude, và Gemini. Các doanh nghiệp đang tích hợp AI vào mọi khía cạnh hoạt động.</p>
      
      <h2>2. Edge Computing</h2>
      <p>Với sự phát triển của IoT và 5G, edge computing đang trở thành giải pháp tối ưu cho việc xử lý dữ liệu real-time tại điểm thu thập.</p>
      
      <h2>3. Quantum Computing</h2>
      <p>Dù vẫn còn ở giai đoạn đầu, quantum computing đang cho thấy tiềm năng to lớn trong việc giải quyết các bài toán phức tạp.</p>
      
      <h2>4. Cybersecurity tiên tiến</h2>
      <p>Với sự gia tăng của các cuộc tấn công mạng, bảo mật trở thành ưu tiên hàng đầu với các giải pháp Zero Trust và AI-powered security.</p>
      
      <h2>5. Sustainable Technology</h2>
      <p>Green IT và sustainable computing đang được các doanh nghiệp quan tâm để giảm carbon footprint.</p>
      
      <h2>Kết luận</h2>
      <p>Việc nắm bắt và áp dụng những xu hướng này sẽ giúp các chuyên gia IT và doanh nghiệp duy trì lợi thế cạnh tranh trong thời đại số.</p>
    `,
    author: "Nguyễn Văn A",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    authorBio: "Senior Tech Writer với 10 năm kinh nghiệm trong ngành công nghệ.",
    date: "2024-01-15",
    readTime: "8 phút",
    category: "Công nghệ",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200",
    tags: ["AI", "Machine Learning", "Technology Trends", "2024"],
    likes: 156,
    comments: 23,
  },
  {
    id: "2",
    title: "Hướng dẫn học React từ A đến Z cho người mới",
    excerpt: "Lộ trình chi tiết giúp bạn làm chủ React từ cơ bản đến nâng cao.",
    content: `
      <h2>Tại sao nên học React?</h2>
      <p>React là thư viện JavaScript phổ biến nhất để xây dựng giao diện người dùng. Với cộng đồng lớn và hệ sinh thái phong phú, React là lựa chọn tuyệt vời cho cả người mới và chuyên gia.</p>
      
      <h2>Bước 1: Nắm vững JavaScript cơ bản</h2>
      <p>Trước khi học React, hãy chắc chắn bạn đã hiểu rõ về ES6+, bao gồm arrow functions, destructuring, spread operator, và promises.</p>
      
      <h2>Bước 2: Hiểu về Components</h2>
      <p>React được xây dựng trên khái niệm components. Mỗi component là một đơn vị độc lập, có thể tái sử dụng.</p>
      
      <h2>Bước 3: State và Props</h2>
      <p>State quản lý dữ liệu nội bộ của component, trong khi props cho phép truyền dữ liệu giữa các components.</p>
      
      <h2>Bước 4: Hooks</h2>
      <p>React Hooks như useState, useEffect, useContext giúp quản lý state và side effects trong functional components.</p>
      
      <h2>Bước 5: Thực hành với dự án thực tế</h2>
      <p>Xây dựng các dự án như Todo App, Blog, E-commerce để củng cố kiến thức.</p>
    `,
    author: "Trần Thị B",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    authorBio: "Frontend Developer và Content Creator về lập trình web.",
    date: "2024-01-12",
    readTime: "12 phút",
    category: "Lập trình",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200",
    tags: ["React", "JavaScript", "Frontend", "Tutorial"],
    likes: 234,
    comments: 45,
  },
  {
    id: "3",
    title: "Kỹ năng mềm quan trọng cho lập trình viên",
    excerpt: "Ngoài kỹ năng code, những kỹ năng mềm nào giúp bạn thành công?",
    content: `
      <h2>Kỹ năng giao tiếp</h2>
      <p>Khả năng trình bày ý tưởng rõ ràng, viết documentation tốt và giao tiếp hiệu quả với team là vô cùng quan trọng.</p>
      
      <h2>Tư duy giải quyết vấn đề</h2>
      <p>Lập trình viên giỏi không chỉ code tốt mà còn biết cách phân tích và giải quyết vấn đề một cách có hệ thống.</p>
      
      <h2>Làm việc nhóm</h2>
      <p>Trong môi trường Agile/Scrum, khả năng làm việc nhóm và collaboration là thiết yếu.</p>
      
      <h2>Quản lý thời gian</h2>
      <p>Biết cách ưu tiên công việc và quản lý deadline giúp bạn hoàn thành dự án đúng hạn.</p>
    `,
    author: "Lê Văn C",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    authorBio: "Tech Lead với kinh nghiệm mentoring cho developers.",
    date: "2024-01-10",
    readTime: "6 phút",
    category: "Kỹ năng",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200",
    tags: ["Soft Skills", "Career", "Communication"],
    likes: 89,
    comments: 12,
  },
];

const relatedPosts = [
  {
    id: "4",
    title: "Machine Learning cơ bản: Bắt đầu từ đâu?",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400",
    category: "AI/ML",
  },
  {
    id: "5",
    title: "Tips tối ưu performance cho ứng dụng web",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
    category: "Web Development",
  },
  {
    id: "6",
    title: "DevOps cho người mới: Docker và Kubernetes",
    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400",
    category: "DevOps",
  },
];

const BlogPost = () => {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Bài viết không tồn tại</h1>
          <Link to="/blog">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại Blog
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Image */}
      <div className="relative h-[400px] md:h-[500px] w-full">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link to="/blog" className="inline-flex items-center text-primary hover:underline mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại Blog
          </Link>

          {/* Article Header */}
          <article className="bg-card rounded-xl shadow-lg p-6 md:p-10">
            <Badge className="mb-4">{post.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {post.title}
            </h1>
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(post.date).toLocaleDateString("vi-VN")}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                {post.likes} lượt thích
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {post.comments} bình luận
              </span>
            </div>

            {/* Author */}
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg mb-8">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.authorAvatar} alt={post.author} />
                <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">{post.author}</p>
                <p className="text-sm text-muted-foreground">{post.authorBio}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mb-8">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Chia sẻ
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="h-4 w-4 mr-2" />
                Lưu
              </Button>
            </div>

            <Separator className="mb-8" />

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none dark:prose-invert
                prose-headings:text-foreground prose-headings:font-bold
                prose-p:text-muted-foreground prose-p:leading-relaxed
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <Separator className="my-8" />

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-sm">
                  #{tag}
                </Badge>
              ))}
            </div>
          </article>

          {/* Related Posts */}
          <section className="mt-12 mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">Bài viết liên quan</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} to={`/blog/${relatedPost.id}`}>
                  <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">
                        {relatedPost.category}
                      </Badge>
                    </div>
                    <CardHeader>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogPost;

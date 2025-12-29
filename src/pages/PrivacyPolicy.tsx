import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => (
  <div className="min-h-screen flex flex-col bg-background">
    <Navbar />
    <main className="flex-1 py-12">
      <div className="container max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">Chính sách bảo mật</h1>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p><strong>Cập nhật lần cuối:</strong> 29/12/2024</p>
          <h2 className="text-xl font-semibold text-foreground">1. Thu thập thông tin</h2>
          <p>Chúng tôi thu thập thông tin bạn cung cấp trực tiếp như tên, email, thông tin thanh toán khi đăng ký tài khoản hoặc mua khóa học.</p>
          <h2 className="text-xl font-semibold text-foreground">2. Sử dụng thông tin</h2>
          <p>Thông tin được sử dụng để cung cấp dịch vụ, xử lý thanh toán, gửi thông báo và cải thiện trải nghiệm người dùng.</p>
          <h2 className="text-xl font-semibold text-foreground">3. Bảo mật thông tin</h2>
          <p>Chúng tôi áp dụng các biện pháp bảo mật để bảo vệ thông tin cá nhân của bạn khỏi truy cập trái phép.</p>
          <h2 className="text-xl font-semibold text-foreground">4. Chia sẻ thông tin</h2>
          <p>Chúng tôi không bán hoặc chia sẻ thông tin cá nhân với bên thứ ba trừ khi được sự đồng ý hoặc theo yêu cầu pháp luật.</p>
          <h2 className="text-xl font-semibold text-foreground">5. Liên hệ</h2>
          <p>Nếu có câu hỏi về chính sách này, vui lòng liên hệ qua email: privacy@edulearn.com</p>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default PrivacyPolicy;

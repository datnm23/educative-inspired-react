import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsOfService = () => (
  <div className="min-h-screen flex flex-col bg-background">
    <Navbar />
    <main className="flex-1 py-12">
      <div className="container max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">Điều khoản sử dụng</h1>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p><strong>Cập nhật lần cuối:</strong> 29/12/2024</p>
          <h2 className="text-xl font-semibold text-foreground">1. Chấp nhận điều khoản</h2>
          <p>Bằng việc sử dụng dịch vụ, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu tại đây.</p>
          <h2 className="text-xl font-semibold text-foreground">2. Tài khoản người dùng</h2>
          <p>Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động dưới tài khoản của mình.</p>
          <h2 className="text-xl font-semibold text-foreground">3. Nội dung khóa học</h2>
          <p>Tất cả nội dung khóa học được bảo vệ bản quyền. Bạn không được sao chép, phân phối hoặc chia sẻ nội dung mà không có sự cho phép.</p>
          <h2 className="text-xl font-semibold text-foreground">4. Thanh toán và hoàn tiền</h2>
          <p>Chúng tôi cung cấp chính sách hoàn tiền trong 30 ngày cho các khóa học đã mua nếu không hài lòng.</p>
          <h2 className="text-xl font-semibold text-foreground">5. Chấm dứt</h2>
          <p>Chúng tôi có quyền chấm dứt hoặc đình chỉ tài khoản nếu vi phạm các điều khoản này.</p>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default TermsOfService;

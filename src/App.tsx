import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import StudentDashboard from "./pages/StudentDashboard";
import MyLearning from "./pages/MyLearning";
import Auth from "./pages/Auth";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import SavedPosts from "./pages/SavedPosts";
import LearningPaths from "./pages/LearningPaths";
import LearningPathDetail from "./pages/LearningPathDetail";
import AccountSettings from "./pages/AccountSettings";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentHistory from "./pages/PaymentHistory";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import InstructorProfile from "./pages/InstructorProfile";
import InstructorDashboard from "./pages/InstructorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/my-learning" element={<MyLearning />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/saved-posts" element={<SavedPosts />} />
              <Route path="/learning-paths" element={<LearningPaths />} />
              <Route path="/learning-paths/:id" element={<LearningPathDetail />} />
              <Route path="/settings" element={<AccountSettings />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment-history" element={<PaymentHistory />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/instructors/:id" element={<InstructorProfile />} />
              <Route path="/instructor-dashboard" element={<InstructorDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

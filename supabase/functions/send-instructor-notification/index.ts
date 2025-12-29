import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  email: string;
  fullName: string;
  status: "approved" | "rejected";
  notes?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, fullName, status, notes }: NotificationRequest = await req.json();

    console.log(`Processing notification for ${fullName} (${email}) - Status: ${status}`);

    const subject = status === "approved" 
      ? "🎉 Chúc mừng! Đơn đăng ký giảng viên đã được duyệt"
      : "Thông báo về đơn đăng ký giảng viên";

    const htmlContent = status === "approved"
      ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #10b981;">Chúc mừng ${fullName}!</h1>
          <p>Đơn đăng ký trở thành giảng viên của bạn đã được <strong style="color: #10b981;">PHÊ DUYỆT</strong>.</p>
          <p>Bây giờ bạn có thể:</p>
          <ul>
            <li>Tạo và quản lý các khóa học</li>
            <li>Truy cập Bảng điều khiển Giảng viên</li>
            <li>Kết nối với học viên</li>
          </ul>
          ${notes ? `<p><strong>Ghi chú:</strong> ${notes}</p>` : ''}
          <p style="margin-top: 20px;">Chào mừng bạn đến với đội ngũ giảng viên!</p>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ef4444;">Xin chào ${fullName},</h1>
          <p>Rất tiếc, đơn đăng ký trở thành giảng viên của bạn đã bị <strong style="color: #ef4444;">TỪ CHỐI</strong>.</p>
          ${notes ? `<p><strong>Lý do:</strong> ${notes}</p>` : ''}
          <p>Bạn có thể nộp đơn lại sau khi đáp ứng các yêu cầu.</p>
          <p style="margin-top: 20px;">Trân trọng,<br>Đội ngũ quản trị</p>
        </div>
      `;

    // Check if RESEND_API_KEY is configured
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      // Demo mode - just log the email
      console.log("=== DEMO MODE - Email would be sent ===");
      console.log(`To: ${email}`);
      console.log(`Subject: ${subject}`);
      console.log(`Status: ${status}`);
      console.log(`Content: ${htmlContent}`);
      console.log("========================================");
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          demo: true,
          message: `Demo: Email notification logged for ${email}` 
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Real mode - send email via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "EduPlatform <onboarding@resend.dev>",
        to: [email],
        subject: subject,
        html: htmlContent,
      }),
    });

    const emailResponse = await res.json();

    if (!res.ok) {
      throw new Error(emailResponse.message || "Failed to send email");
    }

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, data: emailResponse }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

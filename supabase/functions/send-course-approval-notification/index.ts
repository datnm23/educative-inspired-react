import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  email: string;
  instructorName: string;
  courseTitle: string;
  status: "approved" | "rejected";
  notes?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, instructorName, courseTitle, status, notes }: NotificationRequest = await req.json();

    console.log(`Processing course approval notification for ${instructorName} (${email}) - Course: ${courseTitle} - Status: ${status}`);

    const subject = status === "approved" 
      ? `🎉 Khóa học "${courseTitle}" đã được duyệt và xuất bản`
      : `Thông báo về khóa học "${courseTitle}"`;

    const htmlContent = status === "approved"
      ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #10b981;">Chúc mừng ${instructorName}!</h1>
          <p>Khóa học <strong>"${courseTitle}"</strong> của bạn đã được <strong style="color: #10b981;">PHÊ DUYỆT</strong> và xuất bản thành công.</p>
          <p>Khóa học của bạn hiện đã hiển thị công khai và học viên có thể đăng ký ngay bây giờ!</p>
          ${notes ? `<p><strong>Ghi chú từ quản trị viên:</strong> ${notes}</p>` : ''}
          <p style="margin-top: 20px;">Chúc bạn có nhiều học viên đăng ký!</p>
          <p>Trân trọng,<br>Đội ngũ quản trị</p>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ef4444;">Xin chào ${instructorName},</h1>
          <p>Rất tiếc, khóa học <strong>"${courseTitle}"</strong> của bạn đã bị <strong style="color: #ef4444;">TỪ CHỐI</strong>.</p>
          ${notes ? `<p><strong>Lý do:</strong> ${notes}</p>` : ''}
          <p>Vui lòng chỉnh sửa khóa học theo góp ý và gửi lại để được xem xét.</p>
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
      console.log(`Course: ${courseTitle}`);
      console.log("========================================");
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          demo: true,
          message: `Demo: Email notification logged for ${email} about course "${courseTitle}"` 
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

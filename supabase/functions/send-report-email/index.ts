import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReportEmailRequest {
  email: string;
  reportType: 'daily' | 'weekly' | 'monthly';
  reportData?: {
    totalRevenue: number;
    totalStudents: number;
    totalCourses: number;
    revenueChange: number;
    studentsChange: number;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const { email, reportType, reportData }: ReportEmailRequest = await req.json();
    
    if (!resendApiKey) {
      console.log("RESEND_API_KEY not configured - using demo mode");
      return new Response(
        JSON.stringify({ 
          success: true, 
          demo: true,
          message: `Demo mode: Email would be sent to ${email} if RESEND_API_KEY was configured`,
          preview: {
            to: email,
            reportType,
            reportData
          }
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Use fetch to call Resend API directly
    const reportTypeText = {
      daily: 'Hàng ngày',
      weekly: 'Hàng tuần', 
      monthly: 'Hàng tháng'
    }[reportType];

    const data = reportData || {
      totalRevenue: 0,
      totalStudents: 0,
      totalCourses: 0,
      revenueChange: 0,
      studentsChange: 0
    };

    const formatCurrency = (value: number) => 
      new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { padding: 30px; }
          .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
          .stat-card { background: #f8f9fa; border-radius: 8px; padding: 20px; text-align: center; }
          .stat-value { font-size: 28px; font-weight: bold; color: #333; }
          .stat-label { color: #666; margin-top: 5px; }
          .stat-change { font-size: 14px; margin-top: 8px; }
          .positive { color: #22c55e; }
          .negative { color: #ef4444; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Báo cáo ${reportTypeText}</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">${new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div class="content">
            <h2 style="color: #333; margin-bottom: 20px;">Tổng quan hiệu suất</h2>
            <div class="stat-grid">
              <div class="stat-card">
                <div class="stat-value">${formatCurrency(data.totalRevenue)}</div>
                <div class="stat-label">Tổng doanh thu</div>
                <div class="stat-change ${data.revenueChange >= 0 ? 'positive' : 'negative'}">
                  ${data.revenueChange >= 0 ? '↑' : '↓'} ${Math.abs(data.revenueChange).toFixed(1)}% so với kỳ trước
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${data.totalStudents.toLocaleString()}</div>
                <div class="stat-label">Tổng học viên</div>
                <div class="stat-change ${data.studentsChange >= 0 ? 'positive' : 'negative'}">
                  ${data.studentsChange >= 0 ? '↑' : '↓'} ${Math.abs(data.studentsChange).toFixed(1)}% so với kỳ trước
                </div>
              </div>
            </div>
            <div style="background: #e0e7ff; border-radius: 8px; padding: 20px; text-align: center; margin-top: 20px;">
              <div style="font-size: 24px; font-weight: bold; color: #4f46e5;">${data.totalCourses}</div>
              <div style="color: #6366f1; margin-top: 5px;">Tổng số khóa học</div>
            </div>
          </div>
          <div class="footer">
            <p>Email này được gửi tự động từ hệ thống quản trị.</p>
            <p>© ${new Date().getFullYear()} Learning Platform</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Báo cáo <onboarding@resend.dev>",
        to: [email],
        subject: `📊 Báo cáo thống kê ${reportTypeText} - ${new Date().toLocaleDateString('vi-VN')}`,
        html: htmlContent,
      }),
    });

    const emailResult = await emailResponse.json();
    
    if (!emailResponse.ok) {
      throw new Error(emailResult.message || "Failed to send email");
    }

    console.log("Email sent successfully:", emailResult);

    return new Response(JSON.stringify({ success: true, data: emailResult }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending report email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);

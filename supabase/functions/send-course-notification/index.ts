import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

// Resend API key - set this in your secrets for production
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "re_example_key";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotifyFollowersRequest {
  instructor_id: string;
  instructor_name: string;
  course_title: string;
  course_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { instructor_id, instructor_name, course_title, course_id }: NotifyFollowersRequest = await req.json();

    console.log(`Sending notifications for new course: ${course_title} by ${instructor_name}`);

    // Get all followers of this instructor
    const { data: follows, error: followsError } = await supabase
      .from("instructor_follows")
      .select("user_id")
      .eq("instructor_id", instructor_id);

    if (followsError) {
      console.error("Error fetching followers:", followsError);
      throw followsError;
    }

    if (!follows || follows.length === 0) {
      console.log("No followers found for this instructor");
      return new Response(
        JSON.stringify({ message: "No followers to notify" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Found ${follows.length} followers to notify`);

    // Get user emails from auth.users (using service role)
    const userIds = follows.map((f) => f.user_id);
    
    // Create in-app notifications for all followers
    const notifications = userIds.map((userId) => ({
      user_id: userId,
      title: "Khóa học mới!",
      message: `${instructor_name} vừa ra mắt khóa học mới: "${course_title}"`,
      type: "course",
      link: `/courses/${course_id}`,
      is_read: false,
    }));

    const { error: notifyError } = await supabase
      .from("notifications")
      .insert(notifications);

    if (notifyError) {
      console.error("Error creating notifications:", notifyError);
      throw notifyError;
    }

    // Send emails to followers (demo - using placeholder emails)
    // In production, you would fetch real user emails
    const emailPromises = userIds.map(async (userId) => {
      try {
        // For demo purposes, we'll log instead of sending
        // In production, fetch user email and send
        console.log(`Would send email to user: ${userId}`);
        
        // Uncomment below for production with real emails:
        // const { data: userData } = await supabase.auth.admin.getUserById(userId);
        // if (userData?.user?.email) {
        //   await resend.emails.send({
        //     from: "EduLearn <onboarding@resend.dev>",
        //     to: [userData.user.email],
        //     subject: `Khóa học mới từ ${instructor_name}!`,
        //     html: `
        //       <h1>Khóa học mới!</h1>
        //       <p>Xin chào,</p>
        //       <p><strong>${instructor_name}</strong> vừa ra mắt khóa học mới:</p>
        //       <h2>${course_title}</h2>
        //       <p><a href="${Deno.env.get('SITE_URL') || 'https://your-site.com'}/courses/${course_id}">Xem khóa học ngay</a></p>
        //       <p>Chúc bạn học tập hiệu quả!</p>
        //     `,
        //   });
        // }
        
        return { userId, success: true };
      } catch (error) {
        console.error(`Failed to process user ${userId}:`, error);
        return { userId, success: false, error };
      }
    });

    const results = await Promise.all(emailPromises);
    const successCount = results.filter((r) => r.success).length;

    console.log(`Notifications sent: ${successCount}/${userIds.length}`);

    return new Response(
      JSON.stringify({
        message: `Đã gửi thông báo đến ${successCount} người theo dõi`,
        total_followers: userIds.length,
        notifications_sent: successCount,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-course-notification:", error);
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

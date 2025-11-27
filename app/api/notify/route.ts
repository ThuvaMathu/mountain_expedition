import { NextRequest, NextResponse } from "next/server";
import { g_transporter, defaultMailFrom } from "@/services/emails/email";
import { COMPANY_INFO } from "@/seo/config";
import { generateSubscriberConfirmationEmail } from "@/lib/email-templates/subscriber-confirmation";
import { generateAdminSubscriptionNotification } from "@/lib/email-templates/admin-subscription-notification";

const isProduction = process.env.NEXT_PUBLIC_ENVIRONMENT === "production";

interface NotifyRequest {
  email: string;
}

/**
 * POST /api/notify - Subscribe to launch notifications
 */
export async function POST(req: NextRequest) {
  try {
    console.log("📧 Notify API called");

    const body: NotifyRequest = await req.json();
    const { email } = body;

    console.log("📧 Email received:", email);

    // Validate email
    if (!email || !isValidEmail(email)) {
      console.log("❌ Invalid email format");
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }


    console.log("📧 Sending confirmation emails...");

    // Send confirmation email to subscriber
    await sendSubscriberConfirmation(email);

    // Send notification to admin
    await sendAdminNotification(email);

    console.log("✅ Subscription process completed successfully");

    return NextResponse.json(
      {
        success: true,
        message: "Successfully subscribed to launch notifications",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error processing notification subscription:", error);
    return NextResponse.json(
      { error: "Failed to process subscription", details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Send confirmation email to subscriber
 */
async function sendSubscriberConfirmation(email: string): Promise<void> {
  const { html: htmlContent, text: textContent } =
    generateSubscriberConfirmationEmail(email);

  const fromEmail = isProduction
    ? process.env.FROM_EMAIL_PROD
    : process.env.FROM_EMAIL;

  await g_transporter.sendMail({
    from: `${COMPANY_INFO.legalName} <${fromEmail}>`,
    to: email,
    subject: `Welcome to ${COMPANY_INFO.legalName} - You're on the List! 🏔️`,
    text: textContent,
    html: htmlContent,
  });

  console.log(`✅ Subscription confirmation sent to: ${email}`);
}

/**
 * Send admin notification about new subscription
 */
async function sendAdminNotification(email: string): Promise<void> {
  try {
    const { html: adminHtml, text: adminText } =
      generateAdminSubscriptionNotification(email);

    // Send to appropriate admin email based on environment
    const adminEmail = isProduction
      ? process.env.SMTP_USER_PROD
      : process.env.SMTP_USER;

    const fromEmail = isProduction
      ? process.env.FROM_EMAIL_PROD
      : process.env.FROM_EMAIL;

    await g_transporter.sendMail({
      from: `${COMPANY_INFO.legalName} <${fromEmail}>`,
      to: adminEmail,
      subject: `New Subscriber: ${email}`,
      text: adminText,
      html: adminHtml,
    });

    console.log("✅ Admin notification email sent");
  } catch (error) {
    console.error("Error sending admin notification:", error);
    // Don't throw - admin email failure shouldn't break the flow
  }
}

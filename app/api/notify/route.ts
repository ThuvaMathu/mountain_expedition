import { NextRequest, NextResponse } from "next/server";
import { g_transporter } from "@/services/emails/email";
import { emergency_contact } from "@/app/config";

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

    const transporter = g_transporter;

    if (!transporter) {
      console.error("❌ Email transporter not configured");
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 500 }
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
  const transporter = g_transporter;

  if (!transporter) {
    throw new Error("Email transporter not configured");
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        
        <!-- Header with Success Icon -->
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; width: 80px; height: 80px; background-color: #d1fae5; border-radius: 50%; margin-bottom: 15px; line-height: 80px;">
            <span style="font-size: 40px; color: #059669;">✓</span>
          </div>
          <h1 style="color: #0d9488; margin: 0 0 10px 0; font-size: 28px;">You're on the List!</h1>
          <p style="color: #6b7280; margin: 0; font-size: 16px;">Get ready for epic adventures</p>
        </div>
        
        <!-- Success Message -->
        <div style="background-color: #ecfdf5; padding: 20px; border-radius: 10px; border-left: 5px solid #0d9488; margin-bottom: 25px;">
          <h2 style="color: #065f46; margin: 0 0 10px 0; font-size: 18px;">Subscription Confirmed</h2>
          <p style="color: #047857; margin: 0; line-height: 1.6;">
            Thank you for your interest in Tamil Adventure Trekking Club! You'll be among the first to know when we launch our new platform with exciting expedition opportunities.
          </p>
        </div>
        
        <!-- What to Expect -->
        <div style="margin-bottom: 25px;">
          <h3 style="color: #374151; font-size: 16px; margin: 0 0 15px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
            What to Expect
          </h3>
          <ul style="color: #6b7280; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>Early access to our new platform before public launch</li>
            <li>Exclusive pre-launch expedition offers and discounts</li>
            <li>Behind-the-scenes updates on our preparation</li>
            <li>Priority booking for inaugural expeditions</li>
            <li>Special member-only benefits and perks</li>
          </ul>
        </div>
        
        <!-- Coming Soon Features -->
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border: 1px solid #fbbf24; margin-bottom: 25px;">
          <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">🏔️ What We're Building</h3>
          <p style="color: #a16207; margin: 0; line-height: 1.6;">
            We're crafting an extraordinary platform for mountain enthusiasts featuring expert-led expeditions, comprehensive training resources, and a vibrant community of adventurers. Your journey to conquering the world's greatest peaks starts soon!
          </p>
        </div>
        
        <!-- Stay Connected -->
        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #475569; margin: 0 0 10px 0; font-size: 14px;">🌟 Stay Connected</h3>
          <p style="color: #64748b; margin: 0; font-size: 13px; line-height: 1.6;">
            Follow us on social media for expedition updates, mountain photography, and insider tips from our experienced guides. The countdown to adventure has begun!
          </p>
        </div>
        
        <!-- Support Section -->
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
          <h3 style="color: #374151; margin: 0 0 10px 0; font-size: 14px;">Questions?</h3>
          <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 13px;">
            We'd love to hear from you!
          </p>
          <p style="color: #0d9488; margin: 0; font-size: 14px; font-weight: bold;">
            Email: info@tamiladventure.com<br>
            Phone: +1 (555) 123-4567
          </p>
        </div>
        
        <!-- Footer -->
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
            Follow us for expedition updates:
          </p>
          <div style="margin-bottom: 15px;">
            <a href="#" style="color: #0d9488; text-decoration: none; margin: 0 10px; font-size: 13px;">Facebook</a>
            <a href="#" style="color: #0d9488; text-decoration: none; margin: 0 10px; font-size: 13px;">Instagram</a>
            <a href="#" style="color: #0d9488; text-decoration: none; margin: 0 10px; font-size: 13px;">Twitter</a>
          </div>
          <p style="color: #9ca3af; font-size: 11px; margin: 0;">
            Tamil Adventure Trekking Club - Your Gateway to Mountain Adventures
            <br>This is an automated confirmation email. Please do not reply to this message.
            <br>© ${new Date().getFullYear()} Tamil Adventure Trekking Club. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;

  const textContent = `
SUBSCRIPTION CONFIRMED - Tamil Adventure Trekking Club
═══════════════════════════════════════════════════

Thank you for your interest in Tamil Adventure Trekking Club!

You'll be among the first to know when we launch our new platform with exciting expedition opportunities.

WHAT TO EXPECT
───────────────
• Early access to our platform before public launch
• Exclusive pre-launch expedition offers and discounts
• Behind-the-scenes updates on our preparation
• Priority booking for inaugural expeditions
• Special member-only benefits and perks

WHAT WE'RE BUILDING
────────────────────
We're crafting an extraordinary platform for mountain enthusiasts featuring expert-led expeditions, comprehensive training resources, and a vibrant community of adventurers.

STAY CONNECTED
───────────────
Follow us on social media for expedition updates, mountain photography, and insider tips from our experienced guides.

QUESTIONS?
──────────
Email: info@tamiladventure.com
Phone: ${emergency_contact}

---
This is an automated confirmation email.
© ${new Date().getFullYear()} Tamil Adventure Trekking Club. All rights reserved.
  `;

  await transporter.sendMail({
    from: `"Tamil Adventure Trekking Club" <${process.env.FROM_EMAIL}>`,
    to: email,
    subject:
      "Welcome to Tamil Adventure Trekking Club - You're on the List! 🏔️",
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
    const transporter = g_transporter;

    if (!transporter) {
      return; // Silently skip if transporter not configured
    }

    const timestamp = new Date().toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "long",
    });

    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #0d9488;">🎉 New Launch Notification Subscription</h2>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #374151; margin-top: 0;">Subscription Details</h3>
          <table style="width: 100%;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Email:</td>
              <td style="color: #0d9488; font-weight: bold;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Subscribed:</td>
              <td>${timestamp}</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #ecfdf5; padding: 15px; border-radius: 8px; border-left: 4px solid #0d9488;">
          <p style="margin: 0; color: #065f46;">
            <strong>Action:</strong> A new user has subscribed to launch notifications. Add this email to your launch mailing list.
          </p>
        </div>
      </div>
    `;

    const adminText = `
NEW LAUNCH NOTIFICATION SUBSCRIPTION

Email: ${email}
Subscribed: ${timestamp}

Action: Add this email to your launch mailing list.
    `;

    await transporter.sendMail({
      from: `"Tamil Adventure Trekking Club" <${process.env.FROM_EMAIL}>`,
      to: process.env.SMTP_USER, // Admin email
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

import { COMPANY_INFO } from "@/seo/config";

export function generateSubscriberConfirmationEmail(
  email: string
): { html: string; text: string } {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

        <!-- Header with Logo and Success Icon -->
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="${COMPANY_INFO.logoUrl}" alt="${COMPANY_INFO.name}" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 20px;" />
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
            Thank you for your interest in ${COMPANY_INFO.legalName}! You'll be among the first to know when we launch our new platform with exciting expedition opportunities.
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
            Email: ${COMPANY_INFO.contact.email}<br>
            Phone: ${COMPANY_INFO.contact.phone}
          </p>
        </div>

        <!-- Footer -->
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
            Follow us for expedition updates:
          </p>
          <div style="margin-bottom: 15px;">
            <a href="${COMPANY_INFO.social.facebook}" style="color: #0d9488; text-decoration: none; margin: 0 10px; font-size: 13px;">Facebook</a>
            <a href="${COMPANY_INFO.social.instagram}" style="color: #0d9488; text-decoration: none; margin: 0 10px; font-size: 13px;">Instagram</a>
            <a href="${COMPANY_INFO.social.twitter}" style="color: #0d9488; text-decoration: none; margin: 0 10px; font-size: 13px;">Twitter</a>
          </div>
          <p style="color: #9ca3af; font-size: 11px; margin: 0;">
            ${COMPANY_INFO.legalName} - ${COMPANY_INFO.tagline}
            <br>This is an automated confirmation email. Please do not reply to this message.
            <br>© ${new Date().getFullYear()} ${COMPANY_INFO.legalName}. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;

  const textContent = `
SUBSCRIPTION CONFIRMED - ${COMPANY_INFO.legalName}
═══════════════════════════════════════════════════

Thank you for your interest in ${COMPANY_INFO.legalName}!

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
Email: ${COMPANY_INFO.contact.email}
Phone: ${COMPANY_INFO.contact.phone}

---
This is an automated confirmation email.
© ${new Date().getFullYear()} ${COMPANY_INFO.legalName}. All rights reserved.
  `;

  return { html: htmlContent, text: textContent };
}
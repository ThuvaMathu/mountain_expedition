import { COMPANY_INFO, SITE_CONFIG } from "@/seo/config";
import { g_transporter } from "@/services/emails/email";
import { NextRequest, NextResponse } from "next/server";

const isProduction = process.env.NEXT_PUBLIC_ENVIRONMENT === "production";

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message, expeditionInterest } =
      await request.json();

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Create email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Company Header with Logo -->
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${COMPANY_INFO.logoUrl}" alt="${COMPANY_INFO.name}" style="width: 60px; height: 60px; border-radius: 50%; margin-bottom: 10px;" />
            <h1 style="color: #0d9488; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
            <p style="color: #6b7280; margin: 5px 0 0 0;">${COMPANY_INFO.name} - Website Contact</p>
          </div>

          <div style="border-bottom: 1px solid #e5e7eb; margin-bottom: 20px;"></div>
          
          <div style="margin-bottom: 25px;">
            <h2 style="color: #374151; font-size: 18px; margin: 0 0 15px 0;">Contact Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 10px 0; font-weight: bold; color: #374151; width: 120px;">Name:</td>
                <td style="padding: 10px 0; color: #6b7280;">${name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 10px 0; font-weight: bold; color: #374151;">Email:</td>
                <td style="padding: 10px 0; color: #6b7280;">
                  <a href="mailto:${email}" style="color: #0d9488; text-decoration: none;">${email}</a>
                </td>
              </tr>
              ${
                phone
                  ? `
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 10px 0; font-weight: bold; color: #374151;">Phone:</td>
                  <td style="padding: 10px 0; color: #6b7280;">
                    <a href="tel:${phone}" style="color: #0d9488; text-decoration: none;">${phone}</a>
                  </td>
                </tr>
              `
                  : ""
              }
              ${
                subject
                  ? `
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 10px 0; font-weight: bold; color: #374151;">Subject:</td>
                  <td style="padding: 10px 0; color: #6b7280;">${subject}</td>
                </tr>
              `
                  : ""
              }
              ${
                expeditionInterest
                  ? `
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 10px 0; font-weight: bold; color: #374151;">Expedition:</td>
                  <td style="padding: 10px 0; color: #6b7280;">${expeditionInterest}</td>
                </tr>
              `
                  : ""
              }
            </table>
          </div>
          
          <div style="margin-bottom: 25px;">
            <h2 style="color: #374151; font-size: 18px; margin: 0 0 15px 0;">Message</h2>
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #0d9488;">
              <p style="color: #374151; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          
          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; border: 1px solid #a7f3d0;">
            <h3 style="color: #065f46; margin: 0 0 10px 0; font-size: 16px;">Quick Actions</h3>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
              <a href="mailto:${email}" style="background-color: #0d9488; color: white; padding: 8px 16px; text-decoration: none; border-radius: 5px; font-size: 14px; display: inline-block;">Reply via Email</a>
              ${
                phone
                  ? `<a href="tel:${phone}" style="background-color: #059669; color: white; padding: 8px 16px; text-decoration: none; border-radius: 5px; font-size: 14px; display: inline-block;">Call Now</a>`
                  : ""
              }
            </div>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              This email was sent from the Tamil Adventures website contact form.
              <br>Received on ${new Date().toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
              })} IST
            </p>
          </div>
        </div>
      </div>
    `;

    const textContent = `
New Contact Form Submission - ${COMPANY_INFO.name}
═══════════════════════════════════════════════════

Contact Details:
Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ""}
${subject ? `Subject: ${subject}` : ""}
${expeditionInterest ? `Expedition Interest: ${expeditionInterest}` : ""}

Message:
${message}

---
This email was sent from the ${COMPANY_INFO.name} website contact form.
Received on ${new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    })} IST

${COMPANY_INFO.legalName}
${COMPANY_INFO.contact.email}
    `;

    // Send to appropriate admin email based on environment
    const adminEmail = isProduction
      ? process.env.SMTP_USER_PROD
      : process.env.SMTP_USER;

    const fromEmail = isProduction
      ? process.env.FROM_EMAIL_PROD
      : process.env.FROM_EMAIL;

    // Send email to admin
    await g_transporter.sendMail({
      from: `${COMPANY_INFO.name} Contact <${fromEmail}>`,
      to: adminEmail,
      subject: `Contact Form: ${subject || "New Inquiry"} - ${name}`,
      text: textContent,
      html: htmlContent,
      replyTo: email,
    });

    // Send confirmation email to user
    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Company Header with Logo -->
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="${COMPANY_INFO.logoUrl}" alt="${COMPANY_INFO.name}" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 20px;" />
            <h1 style="color: #0d9488; margin: 0 0 10px 0; font-size: 28px;">${COMPANY_INFO.name}</h1>
            <p style="color: #6b7280; margin: 0; font-size: 16px;">Thank you for contacting us!</p>
          </div>
          
          <div style="background-color: #ecfdf5; padding: 25px; border-radius: 10px; border-left: 5px solid #0d9488; margin-bottom: 25px;">
            <h2 style="color: #065f46; margin: 0 0 10px 0; font-size: 18px;">Message Received</h2>
            <p style="color: #047857; margin: 0; line-height: 1.5;">
              Hi ${name}, we've received your message and will get back to you within 24 hours. 
              Our team is excited to help you plan your next adventure!
            </p>
          </div>
          
          <div style="margin-bottom: 25px;">
            <h3 style="color: #374151; font-size: 16px; margin: 0 0 15px 0;">Your Message Summary:</h3>
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
              ${
                subject
                  ? `<p style="margin: 0 0 10px 0; color: #374151;"><strong>Subject:</strong> ${subject}</p>`
                  : ""
              }
              ${
                expeditionInterest
                  ? `<p style="margin: 0 0 10px 0; color: #374151;"><strong>Expedition Interest:</strong> ${expeditionInterest}</p>`
                  : ""
              }
              <p style="margin: 0; color: #6b7280; font-style: italic;">"${message.substring(
                0,
                150
              )}${message.length > 150 ? "..." : ""}"</p>
            </div>
          </div>
          
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border: 1px solid #fbbf24; margin-bottom: 25px;">
            <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">What Happens Next?</h3>
            <ul style="color: #a16207; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 5px;">Our expedition expert will review your inquiry</li>
              <li style="margin-bottom: 5px;">We'll prepare personalized recommendations</li>
              <li style="margin-bottom: 5px;">You'll receive a detailed response within 24 hours</li>
              <li>For urgent matters, call us at ${COMPANY_INFO.contact.emergencyPhone}</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-bottom: 25px;">
            <h3 style="color: #374151; margin: 0 0 15px 0;">Explore While You Wait</h3>
            <div style="display: inline-block; gap: 15px;">
              <a href="${SITE_CONFIG.url}/expeditions" 
                 style="background-color: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 500; display: inline-block; margin: 5px;">
                View Expeditions
              </a>
              <a href="${SITE_CONFIG.url}/gallery" 
                 style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 500; display: inline-block; margin: 5px;">
                Photo Gallery
              </a>
            </div>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
            <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
              Follow us for expedition updates and mountain photography:
            </p>
            <div style="margin-bottom: 15px;">
              <a href="${COMPANY_INFO.social.facebook}" style="color: #0d9488; text-decoration: none; margin: 0 10px;">Facebook</a>
              <a href="${COMPANY_INFO.social.instagram}" style="color: #0d9488; text-decoration: none; margin: 0 10px;">Instagram</a>
              <a href="${COMPANY_INFO.social.twitter}" style="color: #0d9488; text-decoration: none; margin: 0 10px;">Twitter</a>
            </div>
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              ${COMPANY_INFO.legalName} - ${COMPANY_INFO.tagline}
              <br>This is an automated confirmation email.
              <br>© ${new Date().getFullYear()} ${COMPANY_INFO.legalName}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `;

    const fromEmailUser = isProduction
      ? process.env.FROM_EMAIL_PROD
      : process.env.FROM_EMAIL;

    await g_transporter.sendMail({
      from: `${COMPANY_INFO.name} <${fromEmailUser}>`,
      to: email,
      subject: `Thank you for contacting ${COMPANY_INFO.name} - We'll be in touch soon!`,
      text: `Hi ${name},

Thank you for contacting ${COMPANY_INFO.name}! We've received your message and will get back to you within 24 hours.

Your Message Summary:
${subject ? `Subject: ${subject}` : ""}
${expeditionInterest ? `Expedition Interest: ${expeditionInterest}` : ""}
Message: "${message.substring(0, 200)}${message.length > 200 ? "..." : ""}"

What Happens Next?
- Our expedition expert will review your inquiry
- We'll prepare personalized recommendations
- You'll receive a detailed response within 24 hours
- For urgent matters, call us at ${COMPANY_INFO.contact.emergencyPhone}

Best regards,
${COMPANY_INFO.name} Team

---
${COMPANY_INFO.legalName}
This is an automated confirmation email.
Visit us: ${SITE_CONFIG.url}
Contact: ${COMPANY_INFO.contact.email}`,
      html: confirmationHtml,
    });

    return NextResponse.json(
      {
        message: "Message sent successfully! We'll get back to you soon.",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);

    return NextResponse.json(
      {
        message:
          "Failed to send message. Please try again or contact us directly.",
        success: false,
      },
      { status: 500 }
    );
  }
}

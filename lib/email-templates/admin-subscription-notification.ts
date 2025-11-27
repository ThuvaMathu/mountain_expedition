import { COMPANY_INFO } from "@/seo/config";

export function generateAdminSubscriptionNotification(
  email: string
): { html: string; text: string } {
  const timestamp = new Date().toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "long",
  });

  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <!-- Company Header with Logo -->
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${COMPANY_INFO.logoUrl}" alt="${COMPANY_INFO.name}" style="width: 60px; height: 60px; border-radius: 50%; margin-bottom: 10px;" />
        <h2 style="color: #0d9488; margin: 0;">🎉 New Launch Notification Subscription</h2>
      </div>

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
${COMPANY_INFO.legalName} - NEW LAUNCH NOTIFICATION SUBSCRIPTION
═══════════════════════════════════════════════════

Email: ${email}
Subscribed: ${timestamp}

Action: Add this email to your launch mailing list.

---
${COMPANY_INFO.name}
${COMPANY_INFO.contact.email}
  `;

  return { html: adminHtml, text: adminText };
}
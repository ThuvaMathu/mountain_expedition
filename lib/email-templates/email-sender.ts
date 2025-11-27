import { g_transporter } from "@/services/emails/email";
import { generateBookingConfirmationEmail } from "./booking-confirmation";
import { COMPANY_INFO } from "@/seo/config";

interface SendBookingEmailOptions {
  booking: TBooking;
  pdfBuffer: Buffer;
  customerEmail: string;
  customerName: string;
}

/**
 * Send booking confirmation email with PDF attachment
 * @param options - Email sending options
 */
export async function sendBookingConfirmationEmail(
  options: SendBookingEmailOptions
): Promise<void> {
  const { booking, pdfBuffer, customerEmail, customerName } = options;

  try {
    const transporter = g_transporter;

    if (!transporter) {
      throw new Error("Email transporter is not configured");
    }

    // Format currency
    const formatCurrency = (amount: number, currency: string) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
      }).format(amount);
    };

    // Generate email content
    const { html, text } = generateBookingConfirmationEmail({
      booking,
      customerName,
      mountainName: booking.mountainName,
      bookingId: booking.bookingId,
      departureDate: booking.slotDetails?.date || "TBD",
      participants: booking.participants,
      totalAmount: formatCurrency(booking.amount, booking.currency),
      currency: booking.currency,
    });

    // Send email to customer with PDF attachment
    await transporter.sendMail({
      from: `"${COMPANY_INFO.legalName}" <${process.env.FROM_EMAIL}>`,
      to: customerEmail,
      subject: `Booking Confirmed - ${booking.mountainName} Expedition (${booking.bookingId})`,
      text: text,
      html: html,
      attachments: [
        {
          filename: `Invoice_${booking.bookingId}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    console.log(`✅ Booking confirmation email sent to: ${customerEmail}`);

    // Optionally send notification to admin
    await sendAdminNotificationEmail({
      booking,
      customerEmail,
      customerName,
    });
  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
    throw new Error(`Failed to send email: ${error}`);
  }
}

/**
 * Send admin notification about new booking
 * @param options - Notification options
 */
async function sendAdminNotificationEmail(options: {
  booking: TBooking;
  customerEmail: string;
  customerName: string;
}): Promise<void> {
  const { booking, customerEmail, customerName } = options;

  try {
    const transporter = g_transporter;

    if (!transporter) {
      return; // Silently skip if transporter not configured
    }

    const formatCurrency = (amount: number, currency: string) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
      }).format(amount);
    };

    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- Company Header with Logo -->
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${COMPANY_INFO.logoUrl}" alt="${COMPANY_INFO.name}" style="width: 60px; height: 60px; border-radius: 50%; margin-bottom: 10px;" />
          <h2 style="color: #0d9488; margin: 0;">🎉 New Booking Received</h2>
        </div>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #374151; margin-top: 0;">Booking Details</h3>
          <table style="width: 100%;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Booking ID:</td>
              <td>${booking.bookingId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Customer:</td>
              <td>${customerName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Email:</td>
              <td>${customerEmail}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Expedition:</td>
              <td>${booking.mountainName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Departure:</td>
              <td>${booking.slotDetails?.date || "TBD"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Participants:</td>
              <td>${booking.participants}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Amount:</td>
              <td style="color: #059669; font-weight: bold;">${formatCurrency(
                booking.amount,
                booking.currency
              )}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Payment Method:</td>
              <td>${
                booking.paymentMethod === "razorpay_demo"
                  ? "Demo Payment"
                  : "Razorpay"
              }</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #ecfdf5; padding: 15px; border-radius: 8px; border-left: 4px solid #0d9488;">
          <p style="margin: 0; color: #065f46;">
            <strong>Action Required:</strong> Review the booking and contact the customer within 24-48 hours to confirm expedition details.
          </p>
        </div>
      </div>
    `;

    const adminText = `
NEW BOOKING RECEIVED - ${COMPANY_INFO.legalName}
═══════════════════════════════════════════════════

Booking ID: ${booking.bookingId}
Customer: ${customerName}
Email: ${customerEmail}
Expedition: ${booking.mountainName}
Departure: ${booking.slotDetails?.date || "TBD"}
Participants: ${booking.participants}
Amount: ${formatCurrency(booking.amount, booking.currency)}
Payment Method: ${
      booking.paymentMethod === "razorpay_demo" ? "Demo Payment" : "Razorpay"
    }

Action Required: Contact customer within 24-48 hours.

---
${COMPANY_INFO.name}
${COMPANY_INFO.contact.email}
    `;

    await transporter.sendMail({
      from: `"${COMPANY_INFO.legalName} Booking System" <${process.env.FROM_EMAIL}>`,
      to: process.env.SMTP_USER, // Admin email
      subject: `New Booking: ${booking.mountainName} - ${booking.bookingId}`,
      text: adminText,
      html: adminHtml,
    });

    console.log("✅ Admin notification email sent");
  } catch (error) {
    console.error("Error sending admin notification:", error);
    // Don't throw - admin email failure shouldn't break the flow
  }
}

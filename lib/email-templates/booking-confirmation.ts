import { emergency_contact, emergency_contact_email } from "@/lib/config";

interface BookingConfirmationEmailProps {
  booking: TBooking;
  customerName: string;
  mountainName: string;
  bookingId: string;
  departureDate: string;
  participants: number;
  totalAmount: string;
  currency: string;
}

export function generateBookingConfirmationEmail(
  props: BookingConfirmationEmailProps
): { html: string; text: string } {
  const {
    booking,
    customerName,
    mountainName,
    bookingId,
    departureDate,
    participants,
    totalAmount,
    currency,
  } = props;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        
        <!-- Header with Success Icon -->
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; width: 80px; height: 80px; background-color: #d1fae5; border-radius: 50%; margin-bottom: 15px; line-height: 80px;">
            <span style="font-size: 40px; color: #059669;">✓</span>
          </div>
          <h1 style="color: #0d9488; margin: 0 0 10px 0; font-size: 28px;">Booking Confirmed!</h1>
          <p style="color: #6b7280; margin: 0; font-size: 16px;">Your expedition adventure awaits</p>
        </div>
        
        <!-- Success Message -->
        <div style="background-color: #ecfdf5; padding: 20px; border-radius: 10px; border-left: 5px solid #0d9488; margin-bottom: 25px;">
          <h2 style="color: #065f46; margin: 0 0 10px 0; font-size: 18px;">Payment Successful</h2>
          <p style="color: #047857; margin: 0; line-height: 1.6;">
            Hi ${customerName}, we've received your payment and your booking is now confirmed! 
            Your adventure to ${mountainName} is all set. We've attached your detailed invoice/receipt as a PDF.
          </p>
        </div>
        
        <!-- Booking Details -->
        <div style="margin-bottom: 25px;">
          <h3 style="color: #374151; font-size: 16px; margin: 0 0 15px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
            Booking Summary
          </h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 12px 0; font-weight: bold; color: #374151; width: 40%;">Booking ID:</td>
              <td style="padding: 12px 0; color: #6b7280; font-family: monospace;">${bookingId}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 12px 0; font-weight: bold; color: #374151;">Expedition:</td>
              <td style="padding: 12px 0; color: #6b7280;">${mountainName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 12px 0; font-weight: bold; color: #374151;">Departure Date:</td>
              <td style="padding: 12px 0; color: #6b7280;">${departureDate}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 12px 0; font-weight: bold; color: #374151;">Participants:</td>
              <td style="padding: 12px 0; color: #6b7280;">${participants} person(s)</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; font-weight: bold; color: #374151;">Total Paid:</td>
              <td style="padding: 12px 0; color: #059669; font-weight: bold; font-size: 18px;">${totalAmount}</td>
            </tr>
          </table>
        </div>
        
        <!-- Participant Info -->
        ${
          booking.customerInfo.members.length > 0
            ? `
        <div style="margin-bottom: 25px;">
          <h3 style="color: #374151; font-size: 16px; margin: 0 0 15px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
            Participants
          </h3>
          <div style="background-color: #f9fafb; padding: 12px; border-radius: 6px; margin-bottom: 8px;">
            <strong style="color: #1f2937;">${
              booking.customerInfo.organizer.name
            }</strong>
            <span style="color: #6b7280; font-size: 12px;"> (Lead Organizer)</span>
          </div>
          ${booking.customerInfo.members
            .map(
              (member, index) => `
            <div style="background-color: #f9fafb; padding: 12px; border-radius: 6px; margin-bottom: 8px;">
              <strong style="color: #1f2937;">${member.name}</strong>
              <span style="color: #6b7280; font-size: 12px;"> (Member ${
                index + 1
              })</span>
            </div>
          `
            )
            .join("")}
        </div>
        `
            : ""
        }
        
        <!-- Next Steps -->
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border: 1px solid #fbbf24; margin-bottom: 25px;">
          <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">📋 What Happens Next?</h3>
          <ul style="color: #a16207; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>Review the attached PDF invoice/receipt for complete details</li>
            <li>Our expedition coordinator will contact you within 24-48 hours</li>
            <li>You'll receive a detailed pre-departure checklist and preparation guide</li>
            <li>Ensure all participants have valid travel documents and insurance</li>
            <li>Start your fitness training as per the expedition requirements</li>
          </ul>
        </div>
        
        <!-- Important Reminders -->
        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #475569; margin: 0 0 10px 0; font-size: 14px;">⚠️ Important Reminders</h3>
          <p style="color: #64748b; margin: 0; font-size: 13px; line-height: 1.6;">
            • Please review our cancellation policy in the attached invoice<br>
            • All participants must have comprehensive travel and medical insurance<br>
            • Passport validity must be at least 6 months from departure date<br>
            • Contact us immediately if you need to make any changes
          </p>
        </div>
        
        <!-- CTA Buttons -->
        <div style="text-align: center; margin-bottom: 25px;">
          <a href="https://tamiladventures.com/dashboard" 
             style="display: inline-block; background-color: #0d9488; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 500; margin: 5px;">
            View My Bookings
          </a>
          <a href="https://tamiladventures.com/expedition-guide" 
             style="display: inline-block; background-color: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 500; margin: 5px;">
            Preparation Guide
          </a>
        </div>
        
        <!-- Support Section -->
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
          <h3 style="color: #374151; margin: 0 0 10px 0; font-size: 14px;">Need Help?</h3>
          <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 13px;">
            Our support team is here to assist you with any questions.
          </p>
          <p style="color: #0d9488; margin: 0; font-size: 14px; font-weight: bold;">
            Email: support@tamiladventures.com<br>
            Phone: +1 (555) 123-4567<br>
            Available: 24/7
          </p>
        </div>
        
        <!-- Footer -->
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
            Follow us for expedition updates and mountain photography:
          </p>
          <div style="margin-bottom: 15px;">
            <a href="#" style="color: #0d9488; text-decoration: none; margin: 0 10px; font-size: 13px;">Facebook</a>
            <a href="#" style="color: #0d9488; text-decoration: none; margin: 0 10px; font-size: 13px;">Instagram</a>
            <a href="#" style="color: #0d9488; text-decoration: none; margin: 0 10px; font-size: 13px;">Twitter</a>
          </div>
          <p style="color: #9ca3af; font-size: 11px; margin: 0;">
            Tamil Adventure Treckking Club - Your Gateway to Mountain Adventures
            <br>This is an automated confirmation email. Please do not reply to this message.
            <br>© ${new Date().getFullYear()} Tamil Adventure Treckking Club. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;

  const textContent = `
BOOKING CONFIRMED - Tamil Adventure Treckking Club
═══════════════════════════════════════════════

Hi ${customerName},

Great news! Your payment has been received and your booking is now confirmed!

BOOKING SUMMARY
───────────────
Booking ID: ${bookingId}
Expedition: ${mountainName}
Departure Date: ${departureDate}
Participants: ${participants} person(s)
Total Paid: ${totalAmount}

PARTICIPANTS
────────────
${booking.customerInfo.organizer.name} (Lead Organizer)
${booking.customerInfo.members
  .map((m, i) => `${m.name} (Member ${i + 1})`)
  .join("\n")}

WHAT HAPPENS NEXT?
──────────────────
• Review the attached PDF invoice/receipt for complete details
• Our expedition coordinator will contact you within 24-48 hours
• You'll receive a detailed pre-departure checklist
• Ensure all participants have valid travel documents and insurance
• Start your fitness training as per expedition requirements

IMPORTANT REMINDERS
───────────────────
• Review our cancellation policy in the attached invoice
• All participants must have travel and medical insurance
• Passport validity must be at least 6 months from departure
• Contact us immediately if you need to make any changes

NEED HELP?
──────────
Email: ${emergency_contact_email}
Phone:${emergency_contact}
Available: 24/7

Thank you for choosing Tamil Adventure Treckking Club!

---
This is an automated confirmation email.
© ${new Date().getFullYear()} Tamil Adventure Treckking Club. All rights reserved.
  `;

  return { html: htmlContent, text: textContent };
}

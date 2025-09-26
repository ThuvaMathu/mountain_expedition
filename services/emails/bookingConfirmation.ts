import {
  g_transporter,
  COMPANY_NAME,
  COMPANY_LOGO_URL,
  defaultMailFrom,
} from "./email";

export async function sendBookingConfirmation(email: string, bookingData: any) {
  const mailOptions = {
    from: defaultMailFrom,
    to: email,
    subject: `Booking Confirmation - ${COMPANY_NAME}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${COMPANY_LOGO_URL}" alt="${COMPANY_NAME} Logo" style="max-width: 160px; height: auto;" />
        </div>
        
        <h1 style="color: #2563eb; text-align: center;">Booking Confirmed!</h1>
        <p>Dear ${bookingData.customerInfo.name},</p>
        <p>Your booking with <strong>${COMPANY_NAME}</strong> has been confirmed. Here are the details:</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-bottom: 10px;">Booking Details</h2>
          <p><strong>Booking ID:</strong> ${bookingData.bookingId}</p>
          <p><strong>Mountain:</strong> ${bookingData.mountainName}</p>
          <p><strong>Date:</strong> ${new Date(
            bookingData.date
          ).toLocaleDateString()}</p>
          <p><strong>Participants:</strong> ${bookingData.participants}</p>
          <p><strong>Total Amount:</strong> $${bookingData.amount.toLocaleString()}</p>
        </div>
        
        <p>We'll send you more details about your expedition soon.</p>
        <p>Best regards,<br><strong>${COMPANY_NAME} Team</strong></p>
      </div>
    `,
  };

  await g_transporter.sendMail(mailOptions);
}

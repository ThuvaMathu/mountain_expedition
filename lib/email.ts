import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendBookingConfirmation(email: string, bookingData: any) {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: 'Booking Confirmation - Summit Quest',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Booking Confirmed!</h1>
        <p>Dear ${bookingData.customerInfo.name},</p>
        <p>Your booking has been confirmed. Here are the details:</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2>Booking Details</h2>
          <p><strong>Booking ID:</strong> ${bookingData.bookingId}</p>
          <p><strong>Mountain:</strong> ${bookingData.mountainName}</p>
          <p><strong>Date:</strong> ${new Date(bookingData.date).toLocaleDateString()}</p>
          <p><strong>Participants:</strong> ${bookingData.participants}</p>
          <p><strong>Total Amount:</strong> $${bookingData.amount.toLocaleString()}</p>
        </div>
        
        <p>We'll send you more details about your expedition soon.</p>
        <p>Best regards,<br>Summit Quest Team</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

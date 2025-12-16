// import nodemailer from "nodemailer"

// interface BookingEmailData {
//   to: string
//   attendeeName: string
//   eventTitle: string
//   eventDate: string
//   eventTime: string
//   eventVenue: string
//   numberOfTickets: number
//   totalAmount: number
//   bookingReference: string
//   qrCode: string
// }

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: Number.parseInt(process.env.SMTP_PORT || "587"),
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASSWORD,
//   },
// })

// export async function sendBookingConfirmationEmail(data: BookingEmailData) {
//   const {
//     to,
//     attendeeName,
//     eventTitle,
//     eventDate,
//     eventTime,
//     eventVenue,
//     numberOfTickets,
//     totalAmount,
//     bookingReference,
//     qrCode,
//   } = data

//   const htmlContent = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="utf-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Booking Confirmation - TicketZone</title>
//       <style>
//         body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//         .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//         .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
//         .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
//         .ticket-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
//         .qr-code { text-align: center; padding: 20px; background: white; border-radius: 8px; margin: 20px 0; }
//         .booking-ref { font-size: 24px; font-weight: bold; color: #667eea; text-align: center; letter-spacing: 2px; margin: 20px 0; }
//         .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
//         .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
//         .info-label { color: #666; }
//         .info-value { font-weight: bold; }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <div class="header">
//           <h1>🎉 Booking Confirmed!</h1>
//           <p>Your tickets are ready</p>
//         </div>
        
//         <div class="content">
//           <p>Hello ${attendeeName},</p>
//           <p>Thank you for booking with TicketZone! Your tickets for <strong>${eventTitle}</strong> have been confirmed.</p>
          
//           <div class="booking-ref">
//             ${bookingReference}
//           </div>
//           <p style="text-align: center; color: #666;">Your Booking Reference</p>
          
//           <div class="ticket-info">
//             <h2 style="margin-top: 0; color: #667eea;">Event Details</h2>
//             <div class="info-row">
//               <span class="info-label">Event </span>
//               <span class="info-value">${eventTitle}</span>
//             </div>
//             <div class="info-row">
//               <span class="info-label">Date </span>
//               <span class="info-value">${eventDate}</span>
//             </div>
//             <div class="info-row">
//               <span class="info-label">Time </span>
//               <span class="info-value">${eventTime}</span>
//             </div>
//             <div class="info-row">
//               <span class="info-label">Venue </span>
//               <span class="info-value">${eventVenue}</span>
//             </div>
//             <div class="info-row">
//               <span class="info-label">Number of Tickets </span>
//               <span class="info-value">${numberOfTickets}</span>
//             </div>
//             <div class="info-row" style="border-bottom: none;">
//               <span class="info-label">Total Amount </span>
//               <span class="info-value">₹${totalAmount}</span>
//             </div>
//           </div>
          
//           <div class="qr-code">
//             <h3 style="margin-top: 0; color: #667eea;">Your Ticket QR Code</h3>
//             <div style="text-align: center; padding: 20px; background: white; border-radius: 8px; margin: 20px 0;">
//               <img src="${qrCode}" alt="QR Code for check-in" 
//                    style="max-width: 200px; height: auto; image-rendering: -webkit-optimize-contrast;" />
//               <p style="color: #666; margin-top: 15px; font-size: 14px;">
//                 Scan this QR code at the venue entrance<br/>
//                 Or enter reference: <strong>${bookingReference}</strong>
//               </p>
//             </div>
//           </div>
          
//           <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0;">
//             <strong>Important Information:</strong>
//             <ul style="margin: 10px 0; padding-left: 20px;">
//               <li>Please arrive at the venue 30 minutes before the event starts</li>
//               <li>Present this QR code at the entrance for check-in</li>
//               <li>Keep your booking reference handy: <strong>${bookingReference}</strong></li>
//               <li>This email serves as your ticket confirmation</li>
//             </ul>
//           </div>
          
//           <p>If you have any questions, please keep your booking reference ready when contacting us.</p>
//           <p>See you at the event!</p>
          
//           <p style="margin-top: 30px;">Best regards,<br><strong>The TicketZone Team</strong></p>
//         </div>
        
//         <div class="footer">
//           <p>This is an automated email. Please do not reply to this message.</p>
//           <p>&copy; ${new Date().getFullYear()} TicketZone. All rights reserved.</p>
//         </div>
//       </div>
//     </body>
//     </html>
//   `

//   const textContent = `
// Booking Confirmed - TicketZone

// Hello ${attendeeName},

// Thank you for booking with TicketZone! Your tickets for ${eventTitle} have been confirmed.

// Booking Reference: ${bookingReference}

// EVENT DETAILS
// -------------
// Event: ${eventTitle}
// Date: ${eventDate}
// Time: ${eventTime}
// Venue: ${eventVenue}
// Number of Tickets: ${numberOfTickets}
// Total Amount: ₹${totalAmount}

// IMPORTANT INFORMATION
// --------------------
// - Please arrive at the venue 30 minutes before the event starts
// - Present your QR code at the entrance for check-in
// - Keep your booking reference handy: ${bookingReference}
// - This email serves as your ticket confirmation

// See you at the event!

// Best regards,
// The TicketZone Team

// ---
// This is an automated email. Please do not reply to this message.
// © ${new Date().getFullYear()} TicketZone. All rights reserved.
//   `

//   try {
//     await transporter.sendMail({
//       from: process.env.SMTP_FROM || "TicketZone <noreply@ticketzone.com>",
//       to,
//       subject: `Booking Confirmation - ${eventTitle}`,
//       text: textContent,
//       html: htmlContent,
//     })

//     console.log(`Booking confirmation email sent to ${to}`)
//   } catch (error) {
//     console.error("Error sending booking confirmation email:", error)
//     throw error
//   }
// }





import nodemailer from "nodemailer"
import pdfMake from "pdfmake/build/pdfmake"
import pdfFonts from "pdfmake/build/vfs_fonts"

// Configure pdfMake fonts
pdfMake.vfs = pdfFonts.pdfMake.vfs

interface BookingEmailData {
  to: string
  attendeeName: string
  eventTitle: string
  eventDate: string
  eventTime: string
  eventVenue: string
  numberOfTickets: number
  totalAmount: number
  bookingReference: string
  qrCode: string
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

// Helper function to generate QR code PDF as buffer
function generateQRPDF(data: BookingEmailData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const docDefinition = {
        pageSize: 'A6',
        pageMargins: [20, 20, 20, 20],
        content: [
          {
            text: '🎟️ YOUR EVENT TICKET',
            style: 'header',
            alignment: 'center'
          },
          {
            text: data.eventTitle,
            style: 'subheader',
            alignment: 'center',
            margin: [0, 5, 0, 10]
          },
          {
            image: data.qrCode,
            width: 150,
            height: 150,
            alignment: 'center',
            margin: [0, 10, 0, 10]
          },
          {
            text: `Booking Reference: ${data.bookingReference}`,
            style: 'reference',
            alignment: 'center',
            margin: [0, 10, 0, 5]
          },
          {
            text: 'Show this QR code at the venue entrance',
            style: 'small',
            alignment: 'center'
          }
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            color: '#667eea'
          },
          subheader: {
            fontSize: 14,
            bold: true
          },
          reference: {
            fontSize: 12,
            bold: true
          },
          small: {
            fontSize: 8,
            color: '#666666'
          }
        }
      }

      const pdfDoc = pdfMake.createPdf(docDefinition)
      pdfDoc.getBuffer((buffer) => {
        resolve(buffer)
      })
    } catch (error) {
      reject(error)
    }
  })
}

export async function sendBookingConfirmationEmail(data: BookingEmailData) {
  const {
    to,
    attendeeName,
    eventTitle,
    eventDate,
    eventTime,
    eventVenue,
    numberOfTickets,
    totalAmount,
    bookingReference,
    qrCode,
  } = data

  // Generate PDF ticket
  const pdfBuffer = await generateQRPDF(data)

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation - EventBook</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .ticket-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .qr-code { text-align: center; padding: 20px; background: white; border-radius: 8px; margin: 20px 0; }
        .booking-ref { font-size: 24px; font-weight: bold; color: #667eea; text-align: center; letter-spacing: 2px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .info-label { color: #666; }
        .info-value { font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Booking Confirmed!</h1>
          <p>Your tickets are ready</p>
        </div>
        
        <div class="content">
          <p>Hello ${attendeeName},</p>
          <p>Thank you for booking with EventBook! Your tickets for <strong>${eventTitle}</strong> have been confirmed.</p>
          
          <div class="booking-ref">
            ${bookingReference}
          </div>
          <p style="text-align: center; color: #666;">Your Booking Reference</p>
          
          <div class="ticket-info">
            <h2 style="margin-top: 0; color: #667eea;">Event Details</h2>
            <div class="info-row">
              <span class="info-label">Event</span>
              <span class="info-value">${eventTitle}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Date</span>
              <span class="info-value">${eventDate}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Time</span>
              <span class="info-value">${eventTime}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Venue</span>
              <span class="info-value">${eventVenue}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Number of Tickets</span>
              <span class="info-value">${numberOfTickets}</span>
            </div>
            <div class="info-row" style="border-bottom: none;">
              <span class="info-label">Total Amount</span>
              <span class="info-value">₹${totalAmount}</span>
            </div>
          </div>
          
          <div class="qr-code">
            <h3 style="margin-top: 0; color: #667eea;">Your Ticket QR Code</h3>
            <img src="${qrCode}" alt="QR Code" style="max-width: 200px; height: auto; image-rendering: -webkit-optimize-contrast;" />
            <p style="color: #666; margin-top: 15px;">Show this QR code at the venue entrance</p>
          </div>
          
          <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>Important Information:</strong>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Please arrive at the venue 30 minutes before the event starts</li>
              <li>Present this QR code at the entrance for check-in</li>
              <li>A PDF version of your QR code ticket is attached to this email</li>
              <li>Keep your booking reference handy: <strong>${bookingReference}</strong></li>
              <li>This email serves as your ticket confirmation</li>
            </ul>
          </div>
          
          <p>If you have any questions, please keep your booking reference ready when contacting us.</p>
          <p>See you at the event!</p>
          
          <p style="margin-top: 30px;">Best regards,<br><strong>The EventBook Team</strong></p>
        </div>
        
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
          <p>&copy; ${new Date().getFullYear()} EventBook. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  const textContent = `
Booking Confirmed - EventBook

Hello ${attendeeName},

Thank you for booking with EventBook! Your tickets for ${eventTitle} have been confirmed.

Booking Reference: ${bookingReference}

EVENT DETAILS
-------------
Event: ${eventTitle}
Date: ${eventDate}
Time: ${eventTime}
Venue: ${eventVenue}
Number of Tickets: ${numberOfTickets}
Total Amount: ₹${totalAmount}

IMPORTANT INFORMATION
--------------------
- Please arrive at the venue 30 minutes before the event starts
- Present your QR code at the entrance for check-in
- A PDF version of your QR code ticket is attached to this email
- Keep your booking reference handy: ${bookingReference}
- This email serves as your ticket confirmation

See you at the event!

Best regards,
The EventBook Team

---
This is an automated email. Please do not reply to this message.
© ${new Date().getFullYear()} EventBook. All rights reserved.
  `

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "EventBook <noreply@eventbook.com>",
      to,
      subject: `Booking Confirmation - ${eventTitle}`,
      text: textContent,
      html: htmlContent,
      attachments: [
        {
          filename: `ticket-${bookingReference}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    })

    console.log(`Booking confirmation email sent to ${to}`)
  } catch (error) {
    console.error("Error sending booking confirmation email:", error)
    throw error
  }
}
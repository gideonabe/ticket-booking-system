![TicketZone Banner](https://ticketzonebooking.vercel.app/ticketzone.png)

# TicketZone - Event Ticket Booking System

A production-ready event ticket booking platform built with Next.js, MongoDB, and modern web technologies.

## Features

- **Event Discovery**: Browse and search events by category with responsive filtering
- **Ticket Booking**: Seamless booking flow with real-time ticket availability
- **QR Code System**: Automatic QR code generation for ticket validation
- **Email Confirmations**: Professional email notifications with booking details
- **Admin Dashboard**: Complete event management interface for organizers
- **QR Scanner**: Mobile-friendly scanner for check-in validation
- **Authentication**: Secure user authentication with role-based access control
- **Responsive Design**: Mobile-first design that works on all devices

## Demo

You can check the live demo here: [https://ticketzonebooking.vercel.app/](https://ticketzonebooking.vercel.app/)

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Custom auth with bcrypt and HTTP-only cookies
- **UI Components**: Shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS v4
- **QR Codes**: qrcode library for generation, jsqr for scanning
- **Email**: Nodemailer for transactional emails

## Prerequisites

- Node.js 18+ installed
- MongoDB database (local or cloud instance like MongoDB Atlas)
- SMTP server credentials for sending emails

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# Email Configuration (for sending booking confirmations)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=TicketZone <noreply@TicketZone.com>
```

### MongoDB Setup

1. Create a MongoDB database (local or cloud)
2. Get your connection string
3. Add it to `MONGODB_URI` in your `.env.local` file

**MongoDB Atlas**: 
```
mongodb+srv://username:password@cluster.mongodb.net/TicketZone?retryWrites=true&w=majority
```

**Local MongoDB**:
```
mongodb://localhost:27017/TicketZone
```

### Email Setup (Gmail Example)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password (Google Account → Security → App Passwords)
3. Use the app password as `SMTP_PASSWORD`

## Installation

1. **Clone the repository** (or download the ZIP)

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables** as described above

4. **Run the development server**:
```bash
npm run dev
```

5. **Open your browser** and navigate to `http://localhost:3000`

## Creating Your First Admin User

Since this is a fresh installation, you'll need to create an admin user to access the admin dashboard:

### Option 1: Using MongoDB Directly

Connect to your MongoDB database and insert an admin user:

```javascript
db.users.insertOne({
  email: "admin@TicketZone.com",
  password: "$2a$10$YourHashedPasswordHere", // Use bcrypt to hash a password
  name: "Admin User",
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Option 2: Sign up and manually change role

1. Sign up through the UI at `/auth/signup`
2. Connect to MongoDB and update the user's role:
```javascript
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

### Option 3: Create a setup script

Run this Node.js script to create an admin user:

```javascript
// scripts/create-admin.js
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

async function createAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const hashedPassword = await bcrypt.hash('your-password', 10);
  
  const User = mongoose.model('User', new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    role: String
  }));
  
  await User.create({
    email: 'admin@TicketZone.com',
    password: hashedPassword,
    name: 'Admin User',
    role: 'admin'
  });
  
  console.log('Admin user created!');
  process.exit(0);
}

createAdmin();
```

## Usage

### For Event Attendees

1. **Browse Events**: Visit the homepage to see all available events
2. **Filter & Search**: Use category filters and search to find specific events
3. **Book Tickets**: Click on an event, fill in your details, and complete booking
4. **Get Confirmation**: Receive email with QR code and booking reference
5. **Check-in**: Show QR code at the venue for validation

### For Event Organizers (Admin)

1. **Sign In**: Log in with your admin account at `/auth/signin`
2. **Access Admin Dashboard**: Navigate to `/admin`
3. **Create Events**: Click "Create Event" and fill in event details
4. **Manage Events**: Edit or delete existing events
5. **Scan Tickets**: Use the QR scanner at `/admin/scanner` to validate tickets at the venue

## Project Structure

```
event-ticket-booking/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── events/               # Event CRUD operations
│   │   └── bookings/             # Booking and check-in APIs
│   ├── auth/                     # Authentication pages
│   ├── admin/                    # Admin dashboard
│   ├── events/                   # Event detail pages
│   ├── booking-confirmation/     # Booking success pages
│   ├── my-bookings/              # User bookings lookup
│   └── page.tsx                  # Homepage
├── components/                   # React components
│   ├── ui/                       # Shadcn UI components
│   ├── auth/                     # Auth provider and components
│   ├── admin/                    # Admin-specific components
│   ├── event-card.tsx            # Event display card
│   └── event-filters.tsx         # Search and filter UI
├── lib/                          # Utility functions
│   ├── models/                   # Mongoose models
│   ├── mongodb.ts                # Database connection
│   ├── auth.ts                   # Authentication utilities
│   ├── session.ts                # Session management
│   └── email.ts                  # Email sending utilities
└── proxy.ts                      # Middleware for route protection
```

## Database Schema

### Events Collection
- title, description, venue, date, time
- category (music, sports, arts, technology, business, other)
- totalTickets, availableTickets, price
- imageUrl (optional)

### Bookings Collection
- eventId (reference to Event)
- attendeeName, attendeeEmail
- numberOfTickets, totalAmount
- bookingReference (unique 8-character code)
- qrCode (data URL)
- status (pending, confirmed, checked-in, cancelled)

### Users Collection
- email, password (hashed with bcrypt)
- name, role (user, admin)

## Security Features

- Passwords hashed with bcrypt (10 rounds)
- HTTP-only cookies for session management
- Protected admin routes with middleware
- Role-based access control
- Input validation and sanitization
- MongoDB injection prevention with Mongoose

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- AWS Amplify
- Netlify
- Railway
- DigitalOcean App Platform

Make sure to set all environment variables in your deployment platform.

## Troubleshooting

**MongoDB Connection Issues**:
- Verify your connection string is correct
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure database user has proper permissions

**Email Not Sending**:
- Verify SMTP credentials are correct
- Check if 2FA is enabled for Gmail
- Ensure app password is being used (not account password)
- Check spam folder for test emails

**QR Scanner Not Working**:
- Camera permissions must be granted
- Use HTTPS in production (required for camera access)
- Test manual entry as a fallback

**Admin Access Denied**:
- Verify user role is set to "admin" in database
- Clear browser cookies and sign in again
- Check middleware is properly configured

## Future Enhancements

- Payment integration (Stripe, Razorpay)
- Advanced analytics dashboard
- Email templates customization
- Multi-language support
- Event capacity notifications
- Waiting list functionality
- Social media integration
- Calendar export (iCal)

## License

MIT License - feel free to use this project for your own events!

## Support

For issues or questions, please open an issue on GitHub or contact support.

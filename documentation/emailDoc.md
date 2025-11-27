# Email Template System Documentation

## Overview
This document provides a comprehensive guide for creating, updating, and maintaining email templates in the Tamil Adventures application. All email templates use centralized configuration to ensure consistency and easy maintenance.

---

## 📁 Project Structure

```
├── seo/config.ts                          # Central configuration file
├── lib/email-templates/                   # Email template functions
│   ├── subscriber-confirmation.ts         # Launch notification subscription
│   ├── admin-subscription-notification.ts # Admin notification for subscriptions
│   ├── booking-confirmation.ts            # Booking confirmation for customers
│   └── email-sender.ts                    # Booking email sender with admin notification
├── app/api/notify/route.ts                # Subscription API endpoint
├── app/api/email/contact/route.ts         # Contact form API endpoint
└── services/emails/email.ts               # Email transporter configuration
```

---

## 🎯 Core Principles

### 1. **No Hardcoded Values**
All company information, contact details, and branding elements should come from the centralized configuration file.

### 2. **Consistent Logo Integration**
The company logo should be integrated within the email layout at the top, not as a separate attachment.

### 3. **Dual Format Support**
Every email template must provide both HTML and plain text versions.

### 4. **Configuration-Driven Design**
All emails pull data from `seo/config.ts` for:
- Company name and legal name
- Logo URL
- Contact information (email, phone, emergency contacts)
- Social media links
- Tagline and descriptions

---

## ⚙️ Configuration Reference

### Location
All configuration is in: `seo/config.ts`

### Key Configuration Objects

#### COMPANY_INFO
```typescript
export const COMPANY_INFO = {
  name: "Tamil Adventures",                    // Brand name
  legalName: "Tamil Adventure Trekking Club",  // Legal business name
  tagline: "Your Gateway to Mountain Expeditions",
  description: "...",

  logoUrl: "https://...",                      // Company logo URL

  contact: {
    email: "info@tamiladventures.com",
    phone: "+91 98765 43210",
    emergencyPhone: "+91 98765 43211",
    emergencyContactName: "Muthamil Selvi",
    emergencyContactEmail: "contact@tamiladventuretrekkingclub.com",
    address: "..."
  },

  social: {
    facebook: "https://facebook.com/tamiladventures",
    instagram: "https://instagram.com/tamiladventures",
    twitter: "https://twitter.com/tamiladventures",
    youtube: "https://youtube.com/@tamiladventures",
    linkedin: "https://linkedin.com/company/tamiladventures"
  }
}
```

#### SITE_CONFIG
```typescript
export const SITE_CONFIG = {
  url: "https://dev.tamiladventuretrekkingclub.com",
  name: COMPANY_INFO.name,
  locale: "en_IN",
  defaultImage: "/og-image.jpg",
  twitterHandle: "@tamiladventures"
}
```

---

## 📧 Email Template Structure

### Standard Template Layout

All email templates follow this consistent structure:

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
  <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

    <!-- 1. HEADER WITH LOGO -->
    <div style="text-align: center; margin-bottom: 30px;">
      <img src="${COMPANY_INFO.logoUrl}"
           alt="${COMPANY_INFO.name}"
           style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 20px;" />
      <h1>Email Title</h1>
    </div>

    <!-- 2. MAIN CONTENT -->
    <div style="...">
      <!-- Email-specific content goes here -->
    </div>

    <!-- 3. FOOTER WITH SOCIAL LINKS -->
    <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
      <p>Follow us for expedition updates:</p>
      <div>
        <a href="${COMPANY_INFO.social.facebook}">Facebook</a>
        <a href="${COMPANY_INFO.social.instagram}">Instagram</a>
        <a href="${COMPANY_INFO.social.twitter}">Twitter</a>
      </div>
      <p>
        ${COMPANY_INFO.legalName} - ${COMPANY_INFO.tagline}
        <br>© ${new Date().getFullYear()} ${COMPANY_INFO.legalName}. All rights reserved.
      </p>
    </div>

  </div>
</div>
```

---

## 🔨 Creating a New Email Template

### Step 1: Create Template File

Create a new file in `lib/email-templates/`:

```typescript
// lib/email-templates/your-new-template.ts
import { COMPANY_INFO } from "@/seo/config";

export function generateYourEmailTemplate(
  // Add parameters here
  userName: string,
  emailData: any
): { html: string; text: string } {

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

        <!-- Header with Logo -->
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="${COMPANY_INFO.logoUrl}"
               alt="${COMPANY_INFO.name}"
               style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 20px;" />
          <h1 style="color: #0d9488; margin: 0 0 10px 0; font-size: 28px;">
            Your Email Title
          </h1>
        </div>

        <!-- Main Content -->
        <div style="margin-bottom: 25px;">
          <p>Hi ${userName},</p>
          <p>Your email content here using ${COMPANY_INFO.name}...</p>
        </div>

        <!-- Contact Info -->
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
          <p style="color: #0d9488; margin: 0; font-size: 14px; font-weight: bold;">
            Email: ${COMPANY_INFO.contact.email}<br>
            Phone: ${COMPANY_INFO.contact.phone}
          </p>
        </div>

        <!-- Footer -->
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <p style="color: #6b7280;">Follow us for updates:</p>
          <div style="margin-bottom: 15px;">
            <a href="${COMPANY_INFO.social.facebook}" style="color: #0d9488; text-decoration: none; margin: 0 10px;">Facebook</a>
            <a href="${COMPANY_INFO.social.instagram}" style="color: #0d9488; text-decoration: none; margin: 0 10px;">Instagram</a>
            <a href="${COMPANY_INFO.social.twitter}" style="color: #0d9488; text-decoration: none; margin: 0 10px;">Twitter</a>
          </div>
          <p style="color: #9ca3af; font-size: 11px; margin: 0;">
            ${COMPANY_INFO.legalName} - ${COMPANY_INFO.tagline}
            <br>© ${new Date().getFullYear()} ${COMPANY_INFO.legalName}. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  `;

  const textContent = `
${COMPANY_INFO.legalName} - EMAIL TITLE
═══════════════════════════════════════════════════

Hi ${userName},

Your email content in plain text format...

CONTACT US
──────────
Email: ${COMPANY_INFO.contact.email}
Phone: ${COMPANY_INFO.contact.phone}

---
This is an automated email.
© ${new Date().getFullYear()} ${COMPANY_INFO.legalName}. All rights reserved.
  `;

  return { html: htmlContent, text: textContent };
}
```

### Step 2: Import and Use the Template

In your API route:

```typescript
import { generateYourEmailTemplate } from "@/lib/email-templates/your-new-template";
import { g_transporter } from "@/services/emails/email";
import { COMPANY_INFO } from "@/seo/config";

// Generate email content
const { html, text } = generateYourEmailTemplate(userName, emailData);

// Send email
await g_transporter.sendMail({
  from: `${COMPANY_INFO.legalName} <${fromEmail}>`,
  to: userEmail,
  subject: `Your Subject - ${COMPANY_INFO.name}`,
  text: text,
  html: html,
});
```

---

## 🎨 Design Guidelines

### Colors (Teal Brand Theme)
- Primary: `#0d9488` - Main brand color
- Success: `#059669` - Success messages
- Background: `#f9fafb` - Light gray background
- Text Primary: `#374151` - Dark gray for main text
- Text Secondary: `#6b7280` - Medium gray for secondary text
- Border: `#e5e7eb` - Light gray for borders

### Typography
- Font: Arial, sans-serif (universal email client support)
- H1: 28px, bold, color: #0d9488
- H2: 18px, bold, color: #065f46
- H3: 16px, bold, color: #374151
- Body: 14px, color: #6b7280
- Small: 11-13px, color: #9ca3af

### Logo Sizing
- Customer emails: 80px × 80px
- Admin emails: 60px × 60px
- Always use `border-radius: 50%` for circular display

### Spacing
- Container padding: 20-30px
- Section margins: 20-25px
- Element padding: 15-20px

---

## ✅ Best Practices

### 1. Always Use Config Data
```typescript
// ❌ BAD - Hardcoded
<p>Contact us at info@tamiladventures.com</p>

// ✅ GOOD - From config
<p>Contact us at ${COMPANY_INFO.contact.email}</p>
```

### 2. Include Logo in All Emails
```typescript
// Logo should be first element in header
<img src="${COMPANY_INFO.logoUrl}"
     alt="${COMPANY_INFO.name}"
     style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 20px;" />
```

### 3. Provide Both HTML and Text Versions
```typescript
export function generateEmail(): { html: string; text: string } {
  return { html: htmlContent, text: textContent };
}
```

### 4. Use Proper Subject Lines
```typescript
// Include company name from config
subject: `Your Action - ${COMPANY_INFO.name}`
```

### 5. Set Correct From Field
```typescript
from: `${COMPANY_INFO.legalName} <${fromEmail}>`
// or
from: `${COMPANY_INFO.name} <${fromEmail}>`
```

---

## 📋 Existing Email Templates

### 1. Subscriber Confirmation
**File:** `lib/email-templates/subscriber-confirmation.ts`
**Purpose:** Welcome email for launch notification subscribers
**Used in:** `app/api/notify/route.ts`

### 2. Admin Subscription Notification
**File:** `lib/email-templates/admin-subscription-notification.ts`
**Purpose:** Notify admin of new subscribers
**Used in:** `app/api/notify/route.ts`

### 3. Booking Confirmation
**File:** `lib/email-templates/booking-confirmation.ts`
**Purpose:** Confirm booking with customer
**Used in:** `lib/email-templates/email-sender.ts`

### 4. Admin Booking Notification
**File:** `lib/email-templates/email-sender.ts`
**Purpose:** Notify admin of new bookings
**Used in:** Various booking flows

### 5. Contact Form Emails
**File:** `app/api/email/contact/route.ts`
**Purpose:** Contact form submission and confirmation
**Used in:** Contact page

---

## 🔄 Updating Existing Templates

### When to Update
- Company information changes
- Branding updates
- Contact details change
- New features added

### Where to Update
1. **Configuration First:** Update `seo/config.ts`
2. **Automatic Propagation:** Changes automatically reflect in all emails
3. **No Template Changes Needed:** If using config properly

### Example: Changing Phone Number
```typescript
// seo/config.ts
export const COMPANY_INFO = {
  contact: {
    phone: "+91 98765 43210", // Update here only
  }
}

// All email templates automatically use the new number
```

---

## 🧪 Testing Email Templates

### Test Checklist
- [ ] Logo displays correctly (not as attachment)
- [ ] All config values populate correctly
- [ ] Social links are functional
- [ ] Email renders in Gmail, Outlook, Apple Mail
- [ ] Plain text version is readable
- [ ] Mobile responsive (max-width: 600px)
- [ ] No hardcoded company info

### Test Command
```bash
# Send test email
npm run dev
# Navigate to API route and trigger email
```

---

## 🚨 Common Mistakes to Avoid

### ❌ Don't Do This
```typescript
// Hardcoded values
<p>Email: info@tamiladventures.com</p>
<p>Phone: +91 98765 43210</p>
<p>© 2024 Tamil Adventures</p>

// Logo as attachment
attachments: [{ filename: 'logo.png', path: './logo.png' }]

// Missing config import
// Not importing COMPANY_INFO
```

### ✅ Do This Instead
```typescript
// Use config
<p>Email: ${COMPANY_INFO.contact.email}</p>
<p>Phone: ${COMPANY_INFO.contact.phone}</p>
<p>© ${new Date().getFullYear()} ${COMPANY_INFO.legalName}</p>

// Logo inline
<img src="${COMPANY_INFO.logoUrl}" />

// Import config
import { COMPANY_INFO } from "@/seo/config";
```

---

## 📚 Additional Resources

### Email Client Compatibility
- **Gmail:** Full support for inline styles
- **Outlook:** Limited CSS support, test thoroughly
- **Apple Mail:** Excellent HTML support
- **Mobile:** Always test on mobile devices

### Inline CSS
Always use inline styles in email templates as external CSS is not supported by most email clients.

### Testing Tools
- [Litmus](https://litmus.com/) - Email testing across clients
- [Email on Acid](https://www.emailonacid.com/) - Email preview tool
- [Mailtrap](https://mailtrap.io/) - Email testing sandbox

---

## 🔗 Quick Reference Links

- Main Config: `seo/config.ts`
- Email Templates: `lib/email-templates/`
- Email Service: `services/emails/email.ts`
- API Routes: `app/api/notify/` & `app/api/email/contact/`

---

## 📞 Support

For questions or issues with email templates:
1. Check this documentation first
2. Review existing template examples
3. Verify config values in `seo/config.ts`
4. Test in multiple email clients

---

**Last Updated:** ${new Date().toLocaleDateString()}
**Version:** 1.0.0
**Maintainer:** Development Team

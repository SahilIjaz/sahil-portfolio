# Email Contact Form Setup Guide

Your contact form is now ready to send emails to **developersahil199@gmail.com**! Follow these steps to complete the setup.

## Quick Setup Steps

### 1. Get Your Resend API Key

1. Go to [resend.com](https://resend.com) and sign up (it's free!)
2. Verify your email address
3. Navigate to **API Keys** in the dashboard
4. Click **Create API Key**
5. Give it a name (e.g., "Portfolio Contact Form")
6. Copy the API key (it starts with `re_`)

### 2. Add API Key to Environment File

Open the `.env.local` file in your project root and replace the placeholder:

```env
RESEND_API_KEY=re_your_actual_api_key_here
```

### 3. Domain Setup (Optional but Recommended)

**For Testing (using Resend's default):**
- The current setup uses `onboarding@resend.dev` as the sender
- This works immediately but has "via resend.dev" in the sender info
- Perfect for testing!

**For Production (using your own domain):**
1. In Resend dashboard, go to **Domains**
2. Add your domain (e.g., `yourdomain.com`)
3. Add the DNS records they provide to your domain registrar
4. Wait for verification (usually takes a few minutes)
5. Update line 25 in `/app/api/contact/route.ts`:
   ```typescript
   from: 'Portfolio Contact <noreply@yourdomain.com>',
   ```

### 4. Start Your Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and scroll to the contact form to test it!

## How It Works

1. **User fills out the form** with their name, email, and message
2. **Form validates** the input and shows a loading state
3. **API route processes** the request at `/api/contact`
4. **Resend sends** the email to developersahil199@gmail.com
5. **User sees confirmation** message on success

## Features Implemented

- **Real-time validation** - checks email format before sending
- **Loading states** - shows spinner while sending
- **Success/Error messages** - clear feedback to users
- **Form reset** - clears fields after successful submission
- **Reply-to header** - click reply in your email to respond directly to sender
- **Disabled state** - prevents multiple submissions
- **Dark mode support** - matches your portfolio theme
- **Mobile responsive** - works on all devices

## Email Format

You'll receive emails that look like this:

**Subject:** New Contact Form Message from [User's Name]

**Body:**
- Name
- Email address (as reply-to)
- Message content
- Timestamp

## Resend Free Tier Limits

- **100 emails/day** - perfect for portfolio sites
- **3,000 emails/month**
- No credit card required

## Troubleshooting

### "Failed to send email" error
- Check that your API key is correctly set in `.env.local`
- Make sure you restarted your dev server after adding the key
- Verify the API key is valid in Resend dashboard

### Not receiving emails
- Check your spam folder
- Verify the email address in `/app/api/contact/route.ts` line 27
- Check Resend dashboard logs for delivery status

### API Key not recognized
- Ensure `.env.local` is in the project root (next to `package.json`)
- Make sure there are no spaces around the `=` sign
- Restart your development server

## Testing the Form

1. Fill out all three fields
2. Click "Send Message"
3. You should see:
   - Button changes to "Sending..." with spinner
   - Fields become disabled
   - Success message appears
   - Form clears automatically
4. Check developersahil199@gmail.com for the email

## Security Notes

- `.env.local` is already in `.gitignore` - your API key won't be committed
- Never share your API key publicly
- The API key is only accessible server-side (Next.js API routes)
- Email validation prevents invalid submissions

## Need Help?

- [Resend Documentation](https://resend.com/docs)
- [Resend Dashboard](https://resend.com/overview)
- Check server logs if emails aren't sending

---

**All set!** Your contact form is ready to receive messages. 🎉

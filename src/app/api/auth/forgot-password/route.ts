import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/db/mongoose';
import User from '@/lib/models/User';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success to prevent email enumeration attacks
    if (!user) {
      return NextResponse.json({
        message: 'If an account with that email exists, a reset link has been sent.',
      });
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store the hashed token in DB
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetToken = hashedToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    // Send the email
    try {
      await sendPasswordResetEmail(email, resetUrl, user.name);
      console.log(`✅ Password reset email sent to ${email}`);
    } catch (emailError: any) {
      console.error('❌ Failed to send reset email:', emailError.message);

      // In dev mode, still return the link so you can test without email setup
      if (process.env.NODE_ENV !== 'production') {
        console.log(`\n🔑 Password Reset Link (DEV FALLBACK):\n${resetUrl}\n`);
        return NextResponse.json({
          message: 'Email could not be sent (check EMAIL_USER/EMAIL_PASS in .env.local). Dev reset link below.',
          devResetUrl: resetUrl,
        });
      }

      return NextResponse.json(
        { message: 'Failed to send reset email. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'If an account with that email exists, a reset link has been sent.',
    });
  } catch (error: any) {
    console.error('Error in /api/auth/forgot-password:', error);
    return NextResponse.json(
      { message: 'An error occurred. Please try again.', error: error.message },
      { status: 500 }
    );
  }
}

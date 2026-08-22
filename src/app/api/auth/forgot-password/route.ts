import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/db/mongoose';
import User from '@/lib/models/User';

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

    // In production, send email here (e.g., via Nodemailer, Resend, SendGrid).
    // For now, log it to the console in development.
    if (process.env.NODE_ENV !== 'production') {
      console.log(`\n🔑 Password Reset Link (DEV MODE):\n${resetUrl}\n`);
    }

    return NextResponse.json({
      message: 'If an account with that email exists, a reset link has been sent.',
      // Only expose token in development for testing
      ...(process.env.NODE_ENV !== 'production' && { devResetUrl: resetUrl }),
    });
  } catch (error: any) {
    console.error('Error in /api/auth/forgot-password:', error);
    return NextResponse.json(
      { message: 'An error occurred. Please try again.', error: error.message },
      { status: 500 }
    );
  }
}

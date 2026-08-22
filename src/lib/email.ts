import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password (not your regular Gmail password)
  },
});

export async function sendPasswordResetEmail(to: string, resetUrl: string, userName: string) {
  const mailOptions = {
    from: `"ResumeAI" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Reset Your ResumeAI Password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Reset Your Password</title>
        </head>
        <body style="margin:0;padding:0;background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:40px 16px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

                  <!-- Header / Logo -->
                  <tr>
                    <td align="center" style="padding-bottom:24px;">
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="background:linear-gradient(135deg,#4338ca,#7c3aed);border-radius:10px;padding:10px 14px;display:inline-block;">
                            <span style="color:white;font-size:20px;font-weight:700;letter-spacing:-0.5px;">⚡ ResumeAI</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Card -->
                  <tr>
                    <td style="background:#ffffff;border-radius:16px;padding:40px 40px 32px;box-shadow:0 4px 24px rgba(0,0,0,0.07);">

                      <!-- Icon -->
                      <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                        <tr>
                          <td style="background:#ede9fe;border-radius:12px;padding:14px;display:inline-block;">
                            <span style="font-size:28px;">🔑</span>
                          </td>
                        </tr>
                      </table>

                      <h1 style="margin:0 0 12px;font-size:24px;font-weight:700;color:#111827;letter-spacing:-0.5px;">
                        Reset your password
                      </h1>
                      <p style="margin:0 0 8px;font-size:15px;color:#6b7280;line-height:1.6;">
                        Hi ${userName || 'there'},
                      </p>
                      <p style="margin:0 0 28px;font-size:15px;color:#6b7280;line-height:1.6;">
                        We received a request to reset the password for your ResumeAI account.
                        Click the button below to choose a new password. This link will expire in <strong style="color:#374151;">1 hour</strong>.
                      </p>

                      <!-- Button -->
                      <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                        <tr>
                          <td style="border-radius:8px;background:linear-gradient(135deg,#4338ca,#6d28d9);">
                            <a href="${resetUrl}" target="_blank"
                              style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;letter-spacing:0.2px;">
                              Reset Password
                            </a>
                          </td>
                        </tr>
                      </table>

                      <p style="margin:0 0 8px;font-size:13px;color:#9ca3af;line-height:1.5;">
                        If the button doesn't work, copy and paste this link into your browser:
                      </p>
                      <p style="margin:0 0 28px;font-size:12px;color:#6366f1;word-break:break-all;">
                        <a href="${resetUrl}" style="color:#6366f1;">${resetUrl}</a>
                      </p>

                      <hr style="border:none;border-top:1px solid #f3f4f6;margin-bottom:20px;" />

                      <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.5;">
                        If you didn't request a password reset, you can safely ignore this email.
                        Your password will remain unchanged.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td align="center" style="padding:24px 0 0;">
                      <p style="margin:0;font-size:12px;color:#9ca3af;">
                        © ${new Date().getFullYear()} ResumeAI. All rights reserved.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export const resetPasswordTemplate = (resetLink: string) => `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Reset Your Password</title>
    </head>
    <body>
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password. Click the link below to proceed:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 10px 15px; color: white; background-color: blue; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
    </body>
    </html>
`;

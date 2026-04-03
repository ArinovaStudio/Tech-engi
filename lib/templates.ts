export const otpTemplate = (otp: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
      <h2 style="color: #333;">Verify your email address</h2>
      <p style="color: #555; font-size: 16px;">Thank you for registering! Please use the following One-Time Password (OTP) to verify your email address:</p>
      <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
        <h1 style="color: #000; letter-spacing: 5px; margin: 0; font-size: 32px;">${otp}</h1>
      </div>
      <p style="color: #777; font-size: 14px;">This code will expire in 10 minutes.</p>
      <p style="color: #777; font-size: 14px;">If you did not request this, please safely ignore this email.</p>
    </div>
  `;
};

export const engineerApprovalTemplate = (name: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
      <h2 style="color: #2e7d32;">Congratulations, ${name}!</h2>
      <p style="color: #555; font-size: 16px;">Your engineer profile has been <strong>Approved</strong> by the Admin team.</p>
      <p style="color: #555; font-size: 16px;">You can now log in to your dashboard to view and accept project opportunities.</p>
      <div style="margin: 30px 0; text-align: center;">
        <a href="${process.env.NEXTAUTH_URL}/dashboard" style="background-color: #f0b31e; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
      </div>
      <p style="color: #777; font-size: 14px;">Welcome to the team!</p>
    </div>
  `;
};

export const engineerRejectionTemplate = (name: string, reason: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
      <h2 style="color: #d32f2f;">Update regarding your application</h2>
      <p style="color: #555; font-size: 16px;">Hi ${name}, your engineer profile was not approved at this time.</p>
      <div style="background-color: #fff4f4; padding: 15px; border-left: 4px solid #d32f2f; margin: 20px 0;">
        <p style="color: #d32f2f; margin: 0; font-weight: bold;">Reason for Rejection:</p>
        <p style="color: #333; margin-top: 5px;">${reason || "Information provided was incomplete or invalid."}</p>
      </div>
      <p style="color: #555; font-size: 16px;">You can update your profile and re-submit your documents for another review.</p>
      <div style="margin: 30px 0; text-align: center;">
        <a href="${process.env.NEXTAUTH_URL}/profile" style="background-color: #0f172a; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Update Profile</a>
      </div>
    </div>
  `;
};

export const projectInvitationTemplate = (name: string, projectTitle: string) => {
  const dashboardUrl = `${process.env.NEXTAUTH_URL}/dashboard/opportunities`;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="background-color: #fff8e1; color: #f0b31e; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; border: 1px solid #ffe082;">
          New Match Found
        </span>
      </div>
      
      <h2 style="color: #333; text-align: center;">New Project Opportunity!</h2>
      
      <p style="color: #555; font-size: 16px;">Hi <strong>${name}</strong>,</p>
      
      <p style="color: #555; font-size: 16px; line-height: 1.5;">
        Our AI has matched your profile with a new hardware project that fits your skills perfectly. 
      </p>
      
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px border-gray-100;">
        <p style="margin: 0; color: #71717a; font-size: 13px; text-transform: uppercase; font-weight: bold;">Project Title</p>
        <p style="margin: 5px 0 0 0; color: #0f172a; font-size: 18px; font-weight: bold;">${projectTitle}</p>
      </div>
      
      <p style="color: #ef4444; font-size: 14px; font-weight: bold; text-align: center;">
        ⚡ This is a first-come, first-served opportunity!
      </p>

      <div style="margin: 30px 0; text-align: center;">
        <a href="${dashboardUrl}" style="background-color: #f0b31e; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; shadow: 0 4px 6px rgba(240, 179, 30, 0.2);">
          View Project Details
        </a>
      </div>
      
      <p style="color: #777; font-size: 13px; line-height: 1.5; text-align: center;">
        If you're interested, please review and accept the project quickly before another engineer claims it.
      </p>
      
      <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
      <p style="color: #bbb; font-size: 12px; text-align: center;">
        Arinova Studio &copy; 2026 • Dedicated Hardware Services
      </p>
    </div>
  `;
};
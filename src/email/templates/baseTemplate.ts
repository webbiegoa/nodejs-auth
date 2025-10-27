export const baseEmailTemplate = ({
  title,
  body,
  buttonText,
  buttonLink,
}: {
  title: string;
  body: string;
  buttonText?: string;
  buttonLink?: string;
}) => `
  <div style="max-width:600px;margin:0 auto;font-family:sans-serif;background:#f9f9f9;padding:20px;border-radius:8px;">
    <!-- Logo -->
    <div style="text-align:center;margin-bottom:20px;">
      <img src="https://www.strengthcareconnect.com/_astro/strengthcareconnect.B-Z5c8cL_1QnSxR.webp" alt="Strength Care Connect" style="height:60px;" />
    </div>

    <!-- Card -->
    <div style="background:white;padding:24px;border-radius:8px;box-shadow:0 2px 5px rgba(0,0,0,0.05);">
      <h2 style="margin-top:0;font-size:20px;color:#333;">${title}</h2>
      <p style="font-size:16px;line-height:1.6;color:#555;">${body}</p>

      ${
        buttonText && buttonLink
          ? `<div style="margin-top:24px;text-align:center;">
              <a href="${buttonLink}" style="display:inline-block;background:#4f46e5;color:#fff;padding:12px 24px;border-radius:4px;text-decoration:none;">
                ${buttonText}
              </a>
            </div>`
          : ''
      }
    </div>

    <!-- Footer -->
    <div style="text-align:center;font-size:13px;color:#aaa;margin-top:24px;">
      <p>You're receiving this email from Strength Care Connect.</p>
      <p><a href="https://strengthcareconnect.com" style="color:#4f46e5;">Visit our website</a></p>
      <p>© ${new Date().getFullYear()} Strength Care Connect. All rights reserved.</p>
    </div>
  </div>
`;

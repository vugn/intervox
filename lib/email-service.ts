import { Resend } from 'resend';

// Initialize Resend with API key from environment variables
// It will gracefully fail if RESEND_API_KEY is not set
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// The default "From" address (must be a verified domain in Resend)
// If you don't have a verified domain, Resend provides a testing domain (onboarding@resend.dev)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@proposigo.app';

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send an email using Resend.
 * If RESEND_API_KEY is not configured, it will log the email to the console instead.
 */
export async function sendEmail({ to, subject, html }: EmailParams) {
  if (!resend) {
    console.log('\n=============================================');
    console.log('📧 MOCK EMAIL NOTIFICATION (Resend not configured)');
    console.log(`TO: ${to}`);
    console.log(`SUBJECT: ${subject}`);
    console.log('CONTENT:');
    console.log(html);
    console.log('=============================================\n');
    return { success: true, mocked: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `Intervox <${FROM_EMAIL}>`,
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('Failed to send email via Resend:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error sending email:', error);
    return { success: false, error };
  }
}

// ==========================================
// Email Templates
// ==========================================

export function getWelcomeAndVerificationEmailTemplate(userName: string) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
      <h2 style="color: #4f46e5;">Selamat Datang di Intervox, ${userName}!</h2>
      <p style="color: #334155; line-height: 1.6;">
        Terima kasih telah mendaftar di Intervox, platform latihan wawancara berbasis AI.
      </p>
      <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
        <p style="margin: 0; color: #92400e; font-weight: bold;">
          Status Akun Anda Saat Ini: Menunggu Verifikasi
        </p>
        <p style="margin: 10px 0 0 0; color: #92400e;">
          Akun Anda sedang ditinjau oleh Administrator kampus. Anda akan menerima email pemberitahuan ketika akun Anda telah diaktifkan dan siap digunakan.
        </p>
      </div>
      <p style="color: #334155; font-size: 14px;">
        Salam Hangat,<br/>
        Tim Intervox
      </p>
    </div>
  `;
}

export function getAccountApprovedEmailTemplate(userName: string, loginUrl: string) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
      <h2 style="color: #10b981;">Akun Anda Telah Diverifikasi! 🎉</h2>
      <p style="color: #334155; line-height: 1.6;">
        Halo ${userName}, kabar gembira! Akun Anda di Intervox telah disetujui oleh Administrator.
      </p>
      <p style="color: #334155; line-height: 1.6;">
        Sekarang Anda dapat login dan mulai berlatih wawancara menggunakan AI.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${loginUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
          Masuk ke Intervox
        </a>
      </div>
      <p style="color: #334155; font-size: 14px;">
        Salam Hangat,<br/>
        Tim Intervox
      </p>
    </div>
  `;
}

export function getAdminNewUserNotificationTemplate(adminName: string, newUserName: string, newUserEmail: string, dashboardUrl: string) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
      <h2 style="color: #4f46e5;">Pendaftaran Pengguna Baru</h2>
      <p style="color: #334155; line-height: 1.6;">
        Halo ${adminName}, ada mahasiswa baru yang mendaftar dan menunggu verifikasi Anda:
      </p>
      <ul style="color: #334155; line-height: 1.6; background-color: #f8fafc; padding: 20px 40px; border-radius: 8px;">
        <li><strong>Nama:</strong> ${newUserName}</li>
        <li><strong>Email:</strong> ${newUserEmail}</li>
      </ul>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${dashboardUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
          Verifikasi Sekarang
        </a>
      </div>
    </div>
  `;
}

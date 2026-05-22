'use server';

import { sendEmail, getWelcomeAndVerificationEmailTemplate, getAdminNewUserNotificationTemplate, getAccountApprovedEmailTemplate } from '@/lib/email-service';
import { supabase } from '@/lib/supabase'; // Or we might need a server client if we query DB

// Notify user and admins about a new registration
export async function notifyNewRegistration(userName: string, userEmail: string) {
  // 1. Send welcome & verification waiting email to the user
  await sendEmail({
    to: userEmail,
    subject: 'Selamat Datang di Intervox - Menunggu Verifikasi',
    html: getWelcomeAndVerificationEmailTemplate(userName),
  });

  // 2. We should ideally get all admins from the DB, but for now we can just send to a fixed admin or query them
  // Assuming we need to notify admin@intervox.com
  // Or fetch all users with role 'administrator'
  try {
    // Note: We'd need admin privileges to query all users, or an RPC.
    // For simplicity, we just send it to a default admin email if RESEND_ADMIN_EMAIL is set,
    // otherwise fallback to a generic admin notification.
    const adminEmail = process.env.RESEND_ADMIN_EMAIL || 'admin@intervox.com';
    const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/users`;
    
    await sendEmail({
      to: adminEmail,
      subject: 'Pendaftaran Pengguna Baru - Perlu Verifikasi',
      html: getAdminNewUserNotificationTemplate('Admin', userName, userEmail, dashboardUrl),
    });
  } catch (error) {
    console.error('Failed to notify admins:', error);
  }
}

export async function notifyAccountApproved(userName: string, userEmail: string) {
  const loginUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth`;
  await sendEmail({
    to: userEmail,
    subject: 'Akun Intervox Diverifikasi!',
    html: getAccountApprovedEmailTemplate(userName, loginUrl),
  });
}

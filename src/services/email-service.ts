import type { Resend } from 'resend';
import { Result, success, failure } from '@/lib/common/result';
import { ExternalServiceError, ServiceError } from '@/lib/common/errors';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  constructor(
    private resend: Resend,
    private fromAddress: string
  ) {}

  private async send(
    params: SendEmailParams
  ): Promise<Result<null, ServiceError>> {
    try {
      const { error } = await this.resend.emails.send({
        from: this.fromAddress,
        to: params.to,
        subject: params.subject,
        html: params.html,
      });

      if (error) {
        console.log(error);
        return failure(
          new ExternalServiceError(
            'Resend',
            `Failed to send email: ${error.message}`
          )
        );
      }

      return success(null);
    } catch (err) {
      return failure(
        new ExternalServiceError(
          'Resend',
          `Failed to send email: ${err instanceof Error ? err.message : 'Unknown error'}`
        )
      );
    }
  }

  async sendWelcomeClaimEmail(
    to: string,
    claimLink: string
  ): Promise<Result<null, ServiceError>> {
    return this.send({
      to,
      subject: 'Welcome to Zine Club! Claim your account',
      html: welcomeClaimTemplate(claimLink),
    });
  }

  async sendNewsletterWelcomeEmail(
    to: string
  ): Promise<Result<null, ServiceError>> {
    return this.send({
      to,
      subject: 'Welcome to Bikini Grad School!',
      html: newsletterWelcomeTemplate(),
    });
  }

  async addToAudience(email: string): Promise<Result<null, ServiceError>> {
    try {
      const { error } = await this.resend.contacts.create({
        email: email,
        unsubscribed: false,
        audienceId: 'b2e08182-9816-4656-8c1a-3265a1634c51',
      });

      if (error) {
        console.log(error);
        return failure(
          new ExternalServiceError(
            'Resend',
            `Failed to save to audience: ${error.message}`
          )
        );
      }

      return success(null);
    } catch (error) {
      return failure(
        new ExternalServiceError(
          'Resend',
          `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`
        )
      );
    }
  }

  verifyEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}

function newsletterWelcomeTemplate(): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; padding: 40px;">
          <tr>
            <td>
              <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 700; color: #111827;">
                You're in!
              </h1>
              <p style="margin: 0 0 12px; font-size: 15px; line-height: 1.6; color: #4b5563;">
                Thanks for subscribing to the Bikini Grad School newsletter.
              </p>
              <p style="margin: 0 0 12px; font-size: 15px; line-height: 1.6; color: #4b5563;">
                You'll be the first to know about new issues, exclusive content, and everything we're working on.
              </p>
              <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #4b5563;">
                In the meantime, check out what we have to offer:
              </p>
              <table cellpadding="0" cellspacing="0" style="margin: 0 0 24px;">
                <tr>
                  <td style="background-color: #111827; border-radius: 6px;">
                    <a href="https://bikinigradschool.com" style="display: inline-block; padding: 12px 24px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none;">
                      Visit Bikini Grad School
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #9ca3af;">
                If you didn't sign up for this newsletter, you can safely ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

// --- Templates ---

function welcomeClaimTemplate(claimLink: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; padding: 40px;">
          <tr>
            <td>
              <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 700; color: #111827;">
                Welcome to Zine Club!
              </h1>
              <p style="margin: 0 0 12px; font-size: 15px; line-height: 1.6; color: #4b5563;">
                Your subscription is active and ready to go.
              </p>
              <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #4b5563;">
                Click the button below to set up your account and create a password. This link expires in 24 hours.
              </p>
              <table cellpadding="0" cellspacing="0" style="margin: 0 0 24px;">
                <tr>
                  <td style="background-color: #111827; border-radius: 6px;">
                    <a href="${claimLink}" style="display: inline-block; padding: 12px 24px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none;">
                      Claim your account
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #9ca3af;">
                If you didn't subscribe, you can safely ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

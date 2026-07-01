import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 465),
  secure: process.env.SMTP_SECURE !== 'false',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendConfirmationEmail(email: string, token: string) {
  const baseUrl = process.env.BETTER_AUTH_URL ?? 'http://localhost:3000'
  const confirmUrl = `${baseUrl}/api/newsletter/confirmar?token=${token}`

  await transporter.sendMail({
    from: `"Narrativa" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Confirme sua assinatura — Narrativa',
    html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:580px;width:100%;">

          <!-- Cabeçalho -->
          <tr>
            <td style="background:#0b0b0b;padding:28px 40px;border-bottom:3px solid #e63030;">
              <p style="margin:0;font-family:Arial,sans-serif;font-size:26px;font-weight:900;letter-spacing:0.08em;color:#ffffff;text-transform:uppercase;">
                NARRATIVA<span style="color:#e63030;">.</span>
              </p>
              <p style="margin:4px 0 0;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(255,255,255,0.35);font-family:Arial,sans-serif;">
                política, poder e <span style="color:#e63030;">versão</span>
              </p>
            </td>
          </tr>

          <!-- Corpo -->
          <tr>
            <td style="padding:48px 40px 40px;">
              <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:11px;font-weight:900;letter-spacing:0.2em;text-transform:uppercase;color:#e63030;">
                Confirmação de assinatura
              </p>
              <h1 style="margin:0 0 24px;font-size:28px;font-weight:900;color:#0b0b0b;line-height:1.2;font-family:Georgia,serif;">
                Um clique para confirmar.
              </h1>
              <p style="margin:0 0 32px;font-size:15px;color:#555;line-height:1.7;font-family:Arial,sans-serif;">
                Recebemos seu e-mail. Para ativar sua assinatura e começar a receber nossas publicações, clique no botão abaixo.
              </p>

              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#0b0b0b;">
                    <a href="${confirmUrl}"
                       style="display:inline-block;padding:14px 32px;font-family:Arial,sans-serif;font-size:11px;font-weight:900;letter-spacing:0.16em;text-transform:uppercase;color:#ffffff;text-decoration:none;">
                      Confirmar assinatura
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:32px 0 0;font-size:12px;color:#999;line-height:1.6;font-family:Arial,sans-serif;">
                Se você não se inscreveu na Narrativa, ignore este e-mail. Nenhuma ação é necessária.
              </p>
            </td>
          </tr>

          <!-- Rodapé -->
          <tr>
            <td style="border-top:1px solid #eee;padding:20px 40px;background:#fafafa;">
              <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#bbb;text-align:center;">
                Narrativa · Política, poder e versão
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
  })
}

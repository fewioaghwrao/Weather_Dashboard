// src/lib/mail.ts
import nodemailer from "nodemailer";

const host = process.env.MAILTRAP_HOST;
const port = Number(process.env.MAILTRAP_PORT || 2525);
const user = process.env.MAILTRAP_USER;
const pass = process.env.MAILTRAP_PASS;

if (!host || !user || !pass) {
  console.warn("[mail] Mailtrap env is not fully set.");
}

export const mailer = nodemailer.createTransport({
  host,
  port,
  auth: {
    user,
    pass,
  },
});

/** ----------------------------------------
 *  パスワード再設定メール
 * ---------------------------------------- */
export async function sendPasswordResetMail(
  to: string,
  resetUrl: string
) {
  const info = await mailer.sendMail({
    from: '"Weather Dashboard" <no-reply@example.com>',
    to,
    subject: "パスワード再設定のご案内",
    text: `以下のURLからパスワードを再設定してください。\n\n${resetUrl}\n\nこのURLの有効期限は1時間です。`,
    html: `
      <p>以下のリンクからパスワードを再設定してください。</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>このURLの有効期限は1時間です。</p>
    `,
  });

  console.log("[mail] Password reset mail sent:", info.messageId);
}


/** ----------------------------------------
 *  会員登録用・メールアドレス認証メール
 * ---------------------------------------- */
export async function sendVerifyMail(
  to: string,
  name: string,
  verifyUrl: string
) {
  const info = await mailer.sendMail({
    from: '"Weather Dashboard" <no-reply@example.com>',
    to,
    subject: "【Weather Dashboard】メールアドレス認証のお願い",
    text: `
${name} 様

この度は会員登録ありがとうございます。
下記のURLにアクセスし、メールアドレスの認証を完了してください。

${verifyUrl}

※本リンクは24時間有効です。
    `,
    html: `
      <p>${name} 様</p>
      <p>この度は会員登録ありがとうございます。</p>
      <p>下記のボタンを押して、メールアドレスの認証を完了してください。</p>

      <p>
        <a href="${verifyUrl}" 
          style="display:inline-block;padding:10px 16px;background:#0284c7;color:#fff;text-decoration:none;border-radius:6px;">
          メールアドレスを認証する
        </a>
      </p>

      <p>ボタンが押せない場合は以下のURLをブラウザにコピーしてアクセスしてください。</p>
      <p><a href="${verifyUrl}">${verifyUrl}</a></p>

      <p>※本リンクの有効期限は24時間です。</p>
    `,
  });

  console.log("[mail] Verify mail sent:", info.messageId);
}

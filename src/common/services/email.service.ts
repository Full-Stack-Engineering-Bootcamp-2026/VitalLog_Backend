import { Service } from "typedi";
import sgMail from "@sendgrid/mail";

@Service()
export class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
  }

  public async sendStaffCredentialsEmail(data: {
    to: string;
    name: string;
    temporaryPassword: string;
  }): Promise<void> {
    await sgMail.send({
      to: data.to,

      from: process.env.SENDGRID_FROM_EMAIL as string,

      subject: "Your Staff Account Credentials",

      html: `
  <h2>Welcome ${data.name}</h2>

  <p>Your staff account has been created.</p>

  <p>
    <strong>Email:</strong>
    ${data.to}
  </p>

  <p>
    <strong>Temporary Password:</strong>
    ${data.temporaryPassword}
  </p>

  <p>
    Please login and reset your password.
  </p>

  <a
    href="${process.env.FRONTEND_URL}/login"
    style="
      display:inline-block;
      padding:12px 20px;
      background:#2563eb;
      color:white;
      text-decoration:none;
      border-radius:8px;
    "
  >
    Login Now
  </a>
`,
    });
  }

  //forgot password email
  public async sendForgotPasswordEmail(data: {
    to: string;
    name: string;
    resetLink: string;
  }): Promise<void> {
    await sgMail.send({
      to: data.to,

      from: process.env.SENDGRID_FROM_EMAIL as string,

      subject: "Reset Your Password",

      html: `
      <h2>Hello ${data.name}</h2>

      <p>
        Click the button below to reset your password.
      </p>

      <a
        href="${data.resetLink}"
        style="
          display:inline-block;
          padding:12px 20px;
          background:#2563eb;
          color:white;
          text-decoration:none;
          border-radius:8px;
        "
      >
        Reset Password
      </a>

      <p>
        This link will expire soon.
      </p>
    `,
    });
  }
}

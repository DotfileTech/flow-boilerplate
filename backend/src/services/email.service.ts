import nodemailer from 'nodemailer'

const mailOptions = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: `${process.env.EMAIL}`,
    pass: `${process.env.EMAIL_PASS}`,
  },
}

class EmailService {
  private transporter = nodemailer.createTransport(mailOptions)

  public sendEmail = async (email, options) => {
    const message = {
      from: 'contact@docagen.com',
      to: email,
      subject: options.subject,
      text: 'Plaintext version of the message',
      html: `<p>${options.message}</p>`,
    }

    return this.transporter.sendMail(message)
  }
}

export default EmailService

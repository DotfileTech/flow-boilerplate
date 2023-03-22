import nodemailer from 'nodemailer'
// import hbs from 'nodemailer-express-handlebars'

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

    // this.transporter.use(
    //   'compile',
    //   hbs({
    //     viewEngine: {
    //       extName: '.handlebars',
    //       partialsDir: './templates/',
    //       layoutsDir: './templates/',
    //     },
    //     viewPath: './templates/',
    //     extName: '.handlebars',
    //   }),
    // )

    const message = {
      from: 'contact@docagen.com',
      to: email,
      subject: options.subject,
      // text: 'Plaintext version of the message',
      // html: `<p>${options.message}</p>`,
      template: '',
      // context: {
      //   appLogoUrl: "https://maddyness.twic.pics/2023/02/Dotfile.png?twic=v1/resize=470",
      //   verificationLink: "http",
      //   name: fullName,
      // },
    }

    return this.transporter.sendMail(message)
  }
}

export default EmailService

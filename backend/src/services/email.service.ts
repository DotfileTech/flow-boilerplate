import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import path from 'path'

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

  public sendEmail = async (email, options, context) => {
    
    this.transporter.use(
      'compile',
      hbs({
        viewEngine: {
          extName: '.handlebars',
          partialsDir: path.join(__dirname, 'templates'),
          layoutsDir: path.join(__dirname, 'templates'),
          defaultLayout: options.template,
        },
        viewPath: path.join(__dirname, 'templates'),
        extName: '.handlebars',
      }),
    )

    console.log(options)

    const message = {
      from: 'contact@docagen.com',
      to: email,
      subject: options.subject,
      // text: 'Plaintext version of the message',
      // html: `<p>${options.message}</p>`,
      template: options.template,
      context,
    }

    return this.transporter.sendMail(message)
  }
}

export default EmailService

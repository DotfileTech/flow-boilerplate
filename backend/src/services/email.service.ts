import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import path from 'path'
import baseFr from './trads/fr.json'
import baseEn from './trads/en.json'
import baseEs from './trads/es.json'
import baseDe from './trads/de.json'
import baseIt from './trads/it.json'
import baseNl from './trads/nl.json'

const trads = {
  fr: baseFr,
  es: baseEs,
  en: baseEn,
  de: baseDe,
  it: baseIt,
  nl: baseNl,
}

const mailOptions = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: `${process.env.EMAIL_USER}`,
    pass: `${process.env.EMAIL_PASSWORD}`,
  },
}

class EmailService {

  public sendEmail = async (email, options, context, locale) => {
    const transporter = nodemailer.createTransport(mailOptions);

    transporter.use(
      'compile',
      hbs({
        viewEngine: {
          extName: '.handlebars',
          partialsDir: path.join(__dirname, 'templates'),
          layoutsDir: path.join(__dirname, 'templates'),
          defaultLayout: options.template,
          helpers: {
            translate: function (str) {
              return trads[locale][str]
            },
          },
        },
        viewPath: path.join(__dirname, 'templates'),
        extName: '.handlebars',
      }),
    )

    const message = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: trads[locale]['titleValue'],
      // text: 'Plaintext version of the message',
      template: options.template,
      context,
    }

    return await transporter.sendMail(message)
  }
}

export default EmailService

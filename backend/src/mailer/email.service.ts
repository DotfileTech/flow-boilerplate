import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';
import baseFr from './trads/fr.json';
import baseEn from './trads/en.json';
import baseEs from './trads/es.json';
import baseDe from './trads/de.json';
import baseIt from './trads/it.json';
import baseNl from './trads/nl.json';
import customFr from '../config/trads/fr.json';
import customEn from '../config/trads/en.json';
import customEs from '../config/trads/es.json';
import customDe from '../config/trads/de.json';
import customIt from '../config/trads/it.json';
import customNl from '../config/trads/nl.json';
import { isObjectEmpty } from '../helpers/is-object-empty';

const trads = {
  fr: isObjectEmpty(customFr) ? baseFr : customFr,
  es: isObjectEmpty(customEs) ? baseEs : customEs,
  en: isObjectEmpty(customEn) ? baseEn : customEn,
  de: isObjectEmpty(customDe) ? baseDe : customDe,
  it: isObjectEmpty(customIt) ? baseIt : customIt,
  nl: isObjectEmpty(customNl) ? baseNl : customNl,
};

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
};

class EmailService {
  public sendEmail = async (
    email: string,
    options: {
      template: string;
      subject: string;
      message: string;
    },
    context: {
      link: string;
      logoUrl: string;
      checkTitle: string;
      comment?: string;
    },
    locale: string
  ) => {
    const transporter = nodemailer.createTransport(mailOptions);
    let defaultLocale = 'en';

    if (locale && ['fr', 'es', 'en', 'de', 'it', 'nl'].includes(locale)) {
      defaultLocale = locale;
    }

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
              if (str.includes('.')) {
                const keys = str.split('.');
                return trads[defaultLocale][keys[0]][keys[1]];
              }
              return trads[defaultLocale][str];
            },
          },
        },
        viewPath: path.join(__dirname, 'templates'),
        extName: '.handlebars',
      })
    );

    const message = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: trads[defaultLocale][options.subject]['subject'],
      // text: 'Plaintext version of the message',
      template: options.template,
      context,
    };

    return await transporter.sendMail(message);
  };
}

export default EmailService;

import i18n from 'i18n'
const { join } = require('path')

i18n.config = {
  //locales: ["tr", "en"],
  cookie: 'lang',
  defaultLocale: 'en',
  autoReload: true,
  updateFiles: false,
  directory: join(__dirname, '..', 'languages'),
}

i18n.configure(i18n.config)

i18n.translate = (text, ...parameters) => {
  if (global.languageCode) i18n.setLocale(global.languageCode)
  return i18n.__(text, ...parameters)
}

function i18nInit(req, res, next) {
  let { language } = req.headers
  i18n.init(req, res)
  if (language) {
    language = language.split('-')[0]
    i18n.setLocale(req, language)
    global.languageCode = language
  }
  return next()
}

module.exports = {
  i18nInit,
  i18n,
  translate: i18n.translate,
  languageCode: global.languageCode || i18n.getLocale(),
  getLanguageCode: () => global.languageCode || i18n.getLocale(),
}

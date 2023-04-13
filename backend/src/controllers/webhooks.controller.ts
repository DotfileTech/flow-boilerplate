import { NextFunction, Request, Response } from 'express'
import EmailService from '../services/email.service'
import Dotfile from '../api/dotfile.api'

class WebhooksController {
  public dotfileApi = new Dotfile({
    host: process.env.DOTFILE_BASE_URL,
    secretKey: process.env.DOTFILE_KEY,
  })

  private emailService = new EmailService()

  checksConsumer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body

      if (payload.event !== 'Check.Rejected') return res.status(200).json({})

      const caseId = payload.context.case.id
      const check = payload.check
      const checkResult = payload.check.data.result

      const caseData = await this.dotfileApi.request(
        'get',
        `cases/${caseId}`,
        {},
        {},
        {},
      )

      const { email, locale } = caseData.metadata

      if (!email) {
        return res.status(200).json({})
      }

      switch (checkResult) {
        case 'rejected':
          if (email)
            await this.emailService.sendEmail(
              email,
              {
                template: 'checkRejected',
                subject: 'Document rejected',
                message: '',
              },
              {
                link: `${process.env.APP_URL}/?caseId=${caseId}`,
                appLogoUrl: process.env.LOGO_URL,
                check,
              },
              locale,
            )
          break
        case 'approved':
        default:
      }

      return res.status(200).json({})
    } catch (err) {
      next(err)
    }
  }
}

export default WebhooksController

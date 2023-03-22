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

      if (payload.event !== 'Check.Completed') return res.status(200).json({})

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

      const email = caseData.metadata.email

      switch (checkResult) {
        case 'rejected':
          if (email)
            await this.emailService.sendEmail(email, {
              subject: 'Document rejected',
              message: `Hello,<br>Your <b>${check.subtype}</b> has been rejected with the following reason: <b>${check.data.review.comment}</b><br>
            Follow this <a href="${process.env.APP_URL}/?caseId=${caseId}">link</a> to upload a new document`,
            })
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

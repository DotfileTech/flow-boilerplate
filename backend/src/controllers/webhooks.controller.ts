import { NextFunction, Request, Response } from 'express'
import EmailService from '../services/email.service'

class WebhooksController {
  private emailService = new EmailService()

  checksConsumer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body

      if (payload.event !== 'Check.Completed') return res.status(200).json({})

      const caseId = payload.context.case.id
      const externalId = payload.context.case.external_id
      const check = payload.check
      const checkResult = payload.check.data.result

      switch (checkResult) {
        case 'rejected':
          if (externalId)
            await this.emailService.sendEmail(externalId, {
              subject: 'Document rejected',
              message: `
            Your <b>${check.subtype}</b> has been rejected with the following reason: <b>${check.data.review.comment}</b><br>
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

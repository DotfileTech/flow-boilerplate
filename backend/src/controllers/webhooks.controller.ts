import { NextFunction, Request, Response } from 'express';
import EmailService from '../services/email.service';
import Dotfile from '../api/dotfile.api';

class WebhooksController {
  public dotfileApi = new Dotfile({
    host: process.env.DOTFILE_BASE_URL,
    secretKey: process.env.DOTFILE_KEY,
    isDev: process.env.NODE_ENV === 'development',
  });

  private emailService = new EmailService();

  checksConsumer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;

      if (
        payload.event !== 'Check.Rejected' &&
        payload.event !== 'Check.Started'
      ) {
        return res.status(200).json({});
      }

      const caseId = payload.context.case.id;
      const check = payload.check;
      const checkResult = payload.check.data.result;

      const caseData = await this.dotfileApi.request(
        'get',
        `cases/${caseId}`,
        {},
        {},
        {}
      );

      const { email, locale } = caseData.metadata;
      const flags = caseData.flags;

      if (!email) {
        return res.status(200).json({});
      }

      const exactType = (currentCheck: any) => {
        return currentCheck.type === 'document'
          ? currentCheck.subtype.split(':')[1]
          : currentCheck.type;
      };

      // Check.Started
      if (
        email &&
        check.status === 'in_progress' &&
        (flags.includes('for_review') ||
          flags.includes('for_recollection') ||
          flags.includes('all_checks_approved'))
      ) {
        await this.emailService.sendEmail(
          email,
          {
            template: 'checkStarted',
            subject: 'New document check',
            message: '',
          },
          {
            link: `${process.env.APP_URL}/?caseId=${caseId}`,
            appLogoUrl: process.env.LOGO_URL,
            checkTitle: exactType(check),
          },
          locale
        );
      }

      // Check.Rejected
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
                checkTitle: exactType(check),
                comment: check.data.review.comment,
              },
              locale
            );
          break;
        case 'approved':
        default:
      }

      return res.status(200).json({});
    } catch (err) {
      next(err);
    }
  };
}

export default WebhooksController;

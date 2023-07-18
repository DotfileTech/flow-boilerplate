import { NextFunction, Request, Response } from 'express';
import { createHmac } from 'crypto';
import EmailService from '../mailer/email.service';
import Dotfile from '../api/dotfile.api';
import { Check } from '../types';
import {
  CaseFlagEnum,
  CheckResultEnum,
  CheckStatusEnum,
  CheckTypeEnum,
} from '../constants';
import { emails } from '../config/emails';

class WebhooksController {
  public dotfileApi = new Dotfile({
    host: process.env.DOTFILE_BASE_URL,
    secretKey: process.env.DOTFILE_KEY,
    isDev: process.env.NODE_ENV === 'development',
    webhookSecret: process.env.WEBHOOK_SECRET,
  });

  private emailService = new EmailService();

  checksConsumer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;
      const rawBody = req['rawBody'];

      // Verify signature
      if (this.dotfileApi.webhookSecret && rawBody) {
        const signature = createHmac('sha256', this.dotfileApi.webhookSecret)
          .update(rawBody)
          .digest('hex');
        if (signature !== req.headers['dotfile-signature']) {
          res.sendStatus(400);
          console.error('Invalid signature');
          return;
        }
      }

      if (
        payload.event !== 'Check.Rejected' &&
        payload.event !== 'Check.Started'
      ) {
        return res.status(200).json({});
      }

      const caseId: string = payload.context.case.id;
      const check = payload.check;
      const checkResult: CheckResultEnum = check.data.result;

      const caseData = await this.dotfileApi.request(
        'get',
        `cases/${caseId}`,
        {},
        {},
        {}
      );

      if (!caseData.metadata) {
        return res.status(200).json({});
      }

      const { email, locale } = caseData.metadata;
      const flags: CaseFlagEnum[] = caseData.flags;

      if (!email) {
        return res.status(200).json({});
      }

      if (check.type === CheckTypeEnum.aml) {
        return res.status(200).json({});
      }

      const exactType = (currentCheck: Check) => {
        return currentCheck.type === CheckTypeEnum.document
          ? `document.${currentCheck.subtype.split(':')[1]}`
          : `document.${currentCheck.type}`;
      };

      // Check.Started
      if (
        email &&
        check.status === CheckStatusEnum.in_progress &&
        (flags.includes(CaseFlagEnum.for_review) ||
          flags.includes(CaseFlagEnum.for_recollection) ||
          flags.includes(CaseFlagEnum.all_checks_approved))
      ) {
        await this.emailService.sendEmail(
          email,
          {
            template: emails[0].template,
            subject: 'checkStarted',
            message: '',
          },
          {
            link: `${process.env.APP_URL}/?caseId=${caseId}`,
            logoUrl: process.env.LOGO_URL,
            checkTitle: exactType(check),
          },
          locale
        );
      }

      // Check.Rejected
      switch (checkResult) {
        case CheckResultEnum.rejected:
          if (email)
            await this.emailService.sendEmail(
              email,
              {
                template: emails[1].template,
                subject: 'checkRejected',
                message: '',
              },
              {
                link: `${process.env.APP_URL}/?caseId=${caseId}`,
                logoUrl: process.env.LOGO_URL,
                checkTitle: exactType(check),
                comment: check.data.review.comment,
              },
              locale
            );
          break;
        case CheckResultEnum.approved:
        default:
      }

      return res.status(200).json({});
    } catch (err) {
      next(err);
    }
  };
}

export default WebhooksController;

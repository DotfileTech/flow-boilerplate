import express, { Router } from 'express';
import bodyParser from 'body-parser';
import { Routes } from '../interfaces/routes.interface';
import WebhookController from '../controllers/webhooks.controller';

class PublicApiRoute implements Routes {
  public path = '/';
  public router = Router();
  private webhookController = new WebhookController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(
      express.json({
        verify: (req, res, buf) => {
          req['rawBody'] = buf.toString();
        },
      })
    );

    // Parse the request body
    this.router.use(bodyParser.json());

    this.router.post(
      `${this.path}checks`,
      this.webhookController.checksConsumer
    );

    this.router.use((req, res) => {
      res.status(404).send({
        type: 'route_not_found',
        message: 'The required route does not exist.',
        code: 404,
      });
    });
  }
}

export default PublicApiRoute;

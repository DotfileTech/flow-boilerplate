import { Routes } from '../interfaces/routes.interface';
import express, { Router } from 'express';
import { upload } from '../middlewares/multer';
import DotfileController from '../controllers/dotfile.controller';

class PublicApiRoute implements Routes {
  public path = '/';
  public router = Router();
  private dotfileController = new DotfileController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(express.json());

    // this.router.use(rateLimiterMiddleware, bearerCheck)

    this.router.get(
      `${this.path}companies`,
      this.dotfileController.searchCompanies
    );

    this.router.get(
      `${this.path}companies/:id`,
      this.dotfileController.fetchCompany
    );

    this.router.post(`${this.path}cases`, this.dotfileController.createCase);

    this.router.get(`${this.path}cases`, this.dotfileController.getCases);

    this.router.get(`${this.path}cases/:id`, this.dotfileController.fetchCase);

    this.router.post(`${this.path}checks`, this.dotfileController.fetchCheck);

    this.router.post(
      `${this.path}documents`,
      function (req, res, next) {
        upload(req, res, function (err) {
          if (err) {
            return res.status(400).send({ message: err.message });
          }
          next();
        });
      },
      this.dotfileController.uploadDocument
    );

    this.router.post(
      `${this.path}identity_documents`,
      function (req, res, next) {
        upload(req, res, function (err) {
          if (err) {
            return res.status(400).send({ message: err.message });
          }
          next();
        });
      },
      this.dotfileController.uploadIdentityDocument
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

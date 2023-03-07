import { Routes } from '../interfaces/routes.interface'
import express, { Router } from 'express'
import DotfileController from '../controllers/dotfile.controller'

class PublicApiRoute implements Routes {
  public path = '/'
  public router = Router()
  private dotfileController = new DotfileController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.use(express.json())

    // this.router.use(rateLimiterMiddleware, bearerCheck)

    this.router.get(
      `${this.path}countries`,
      this.dotfileController.getCountries,
    )

    this.router.get(
      `${this.path}companies`,
      this.dotfileController.searchCompanies,
    )

    this.router.get(
      `${this.path}companies/:id`,
      this.dotfileController.fetchCompany,
    )

    this.router.post(`${this.path}cases`, this.dotfileController.createCase)

    this.router.use((req, res) => {
      res.status(404).send({
        type: 'route_not_found',
        message: 'The required route does not exist.',
        code: 404,
      })
    })
  }
}

export default PublicApiRoute

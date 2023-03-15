import { Request, Response, NextFunction } from 'express'
import axios from 'axios'
import FormData from 'form-data'
import EmailService from '../services/email.service'

class Dotfile {
  serverUrl: string
  secretKey: string

  constructor(config: { host?: string; secretKey?: string } = {}) {
    config.host = config.host || 'https://api.dotfile.com/v1'
    this.serverUrl = config.host

    if (this.serverUrl.slice(-1) === '/') {
      this.serverUrl = this.serverUrl.slice(0, -1)
    }

    try {
      new URL(this.serverUrl)
    } catch (err) {
      throw new Error(
        `Invalid URL provided for the Dotfile host: ${this.serverUrl}`,
      )
    }

    this.secretKey = config.secretKey || ''
  }

  public async request(
    method: string,
    endpoint: string,
    params: {},
    payload: {},
    headers: {},
  ) {
    const url = `${this.serverUrl}/${endpoint}`

    const { data } = await axios(url, {
      method,
      params,
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'application/json',
        'X-DOTFILE-API-KEY': this.secretKey,
        ...headers,
      },
      data: payload,
    })

    return data
  }
}

class DotfileController {
  public dotfileApi = new Dotfile({
    host: process.env.DOTFILE_BASE_URL,
    secretKey: process.env.DOTFILE_KEY,
  })

  private emailService = new EmailService()

  public getCountries = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const countries = await this.dotfileApi.request(
        'get',
        'company-data/countries',
        {},
        {},
        {},
      )
      res.status(200).json(countries)
    } catch (err: any) {
      res.status(400).send({
        type: 'error',
        message: 'Something went wrong while processing your export',
      })
    }
  }

  public searchCompanies = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const companies = await this.dotfileApi.request(
        'get',
        'company-data/search',
        { country: req.query.country, name: req.query.name },
        {},
        {},
      )
      res.status(200).json(companies)
    } catch (err: any) {
      res.status(400).send({
        type: 'error',
        message: 'Something went wrong while processing your export',
      })
    }
  }

  public fetchCompany = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const company = await this.dotfileApi.request(
        'get',
        `company-data/fetch/${req.params.id}`,
        {},
        {},
        {},
      )
      company.individuals = company.beneficial_owners.map((ubo) => {
        return { roles: ['beneficial_owner'], ...ubo }
      })
      res.status(200).json(company)
    } catch (err: any) {
      res.status(400).send({
        type: 'error',
        message: 'Something went wrong while processing your export',
      })
    }
  }

  public createCase = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { company, individuals, email } = req.body

      const createdCase = await this.dotfileApi.request(
        'post',
        'cases',
        {},
        {
          name: company.name,
          external_id: email,
        },
        {},
      )

      individuals.forEach(async (individual) => {
        let createdIndividual = await this.dotfileApi.request(
          'post',
          'individuals',
          {},
          {
            case_id: createdCase.id,
            first_name: individual.first_name,
            last_name: individual.last_name,
            roles: individual.roles,
          },
          {},
        )

        if (individual.roles.includes('applicant')) {
          await this.dotfileApi.request(
            'post',
            'checks/id_verification',
            {},
            {
              individual_id: createdIndividual.id,
              settings: {
                mode: 'liveness',
                redirect_url: `${process.env.APP_URL}?caseId=${createdCase.id}`,
              },
            },
            {},
          )
        } else {
          await this.dotfileApi.request(
            'post',
            'checks/id_document',
            {},
            {
              individual_id: createdIndividual.id,
            },
            {},
          )

          await this.dotfileApi.request(
            'post',
            'checks/document',
            {},
            {
              individual_id: createdIndividual.id,
              settings: {
                document_type: 'driving_license',
              },
            },
            {},
          )
        }
      })

      const createdCompany = await this.dotfileApi.request(
        'post',
        'companies',
        {},
        {
          case_id: createdCase.id,
          name: company.name,
          registration_number: company.registration_number,
          country: company.country,
          legal_form: company.legal_form,
        },
        {},
      )

      await this.dotfileApi.request(
        'post',
        'checks/document',
        {},
        {
          company_id: createdCompany.id,
          settings: {
            document_type: 'registration_certificate',
          },
        },
        {},
      )

      res.status(200).json({
        caseId: createdCase.id,
        // caseUrl: `https://beta.portal.dotfile.com/cases/${createdCase.id}`,
      })
    } catch (err: any) {
      res.status(400).send({
        type: 'error',
        message: 'Something went wrong while processing your export',
      })
    }
  }

  public fetchCase = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const caseData = await this.dotfileApi.request(
        'get',
        `cases/${req.params.id}`,
        {},
        {},
        {},
      )

      let enrichedIndividuals = []

      for (const individual of caseData.individuals) {
        let enrichedChecks = []
        for (const check of individual.checks) {
          // enrichedChecks.push(check)
          const enrichedCheck = await this.dotfileApi.request(
            'get',
            `checks/${check.type}/${check.id}`,
            {},
            {},
            {},
          )

          enrichedChecks.push(enrichedCheck)
        }
        individual.checks = enrichedChecks
        enrichedIndividuals.push(individual)
      }

      caseData.individuals = enrichedIndividuals

      res.status(200).json(caseData)
    } catch (err: any) {
      res.status(400).send({
        type: 'error',
        message: 'Something went wrong while fetching your case',
      })
    }
  }

  public fetchCheck = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { checkId, type } = req.body

      const check = await this.dotfileApi.request(
        'get',
        `checks/${type}/${checkId}`,
        {},
        {},
        {},
      )

      res.status(200).json({
        url: check.data.vendor.verification_url,
      })
    } catch (err: any) {
      res.status(400).send({
        type: 'error',
        message: 'Something went wrong while fetching your case',
      })
    }
  }

  public uploadDocument = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const bodyFormData = new FormData()
      bodyFormData.append('file', req.files[0].buffer, {
        filename: req.files[0].originalname,
      })

      const { checkId, type } = req.body

      const { upload_ref } = await this.dotfileApi.request(
        'post',
        `files/upload`,
        {},
        bodyFormData,
        {
          ...bodyFormData.getHeaders(),
        },
      )

      const completedChecks = await this.dotfileApi.request(
        'post',
        `checks/${type}/${checkId}/add_files`,
        {},
        {
          files: [
            {
              upload_ref,
            },
          ],
        },
        {},
      )

      res.status(200).json(completedChecks)
    } catch (err: any) {
      res.status(400).send({
        type: 'error',
        message: 'Something went wrong while fetching your case',
      })
    }
  }

  public sendLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, caseId, checkId } = req.body

      // const check = await this.dotfileApi.request(
      //   'get',
      //   `checks/${type}/${checkId}`,
      //   {},
      //   {},
      //   {},
      // )

      // res.status(200).json({
      //   url: check.data.vendor.verification_url,
      // })

      this.emailService.sendEmail(email, {
        subject: 'Validate your identity',
        message: `Follow this <a href="${process.env.APP_URL}/?caseId=${caseId}">link</a>`,
      })

      res.status(200).json({})
    } catch (err: any) {
      res.status(400).send({
        type: 'error',
        message: 'Something went wrong while fetching your case',
      })
    }
  }
}

export default DotfileController

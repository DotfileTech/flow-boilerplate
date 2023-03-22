import { Request, Response, NextFunction } from 'express'
import FormData from 'form-data'
import Dotfile from '../api/dotfile.api'

class DotfileController {
  public dotfileApi = new Dotfile({
    host: process.env.DOTFILE_BASE_URL,
    secretKey: process.env.DOTFILE_KEY,
  })

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
        message: 'Something went wrong while fetching countries list.',
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
        message: 'Something went wrong while searching company.',
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
        message: 'Something went wrong while fetch company details.',
      })
    }
  }

  public createCase = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { company, individuals, metadata } = req.body

      const createdCase = await this.dotfileApi.request(
        'post',
        'cases',
        {},
        {
          name: company.name,
          // external_id: email,
          template_id: process.env.TEMPLATE_ID,
          metadata: Object.keys(metadata)
            .filter((k) => metadata[k] != null)
            .reduce((a, k) => ({ ...a, [k]: metadata[k] }), {}),
        },
        {},
      )

      individuals.forEach(async (individual) => {
        await this.dotfileApi.request(
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
      })

      await this.dotfileApi.request(
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

      res.status(200).json({
        caseId: createdCase.id,
      })
    } catch (err: any) {
      res.status(400).send({
        type: 'error',
        message: 'Something went wrong while creating case.',
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

      let enrichedCompanies = []

      for (const company of caseData.companies) {
        let enrichedChecks = []
        for (const check of company.checks) {
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
        company.checks = enrichedChecks
        enrichedCompanies.push(company)
      }

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

      caseData.companies = enrichedCompanies
      caseData.individuals = enrichedIndividuals

      res.status(200).json(caseData)
    } catch (err: any) {
      console.log(err)
      res.status(400).send({
        type: 'error',
        message: 'Something went wrong while fetching case.',
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
        message: 'Something went wrong while fetching check.',
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
        message: 'Something went wrong while uploading documents',
      })
    }
  }

  public uploadIdentityDocument = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.files[0]) throw new Error('missing file')

      const bodyFormDataFront = new FormData()
      bodyFormDataFront.append('file', req.files[0].buffer, {
        filename: req.files[0].originalname,
      })

      const { checkId, type } = req.body

      const { upload_ref: front_upload_ref } = await this.dotfileApi.request(
        'post',
        `files/upload`,
        {},
        bodyFormDataFront,
        {
          ...bodyFormDataFront.getHeaders(),
        },
      )

      let back_upload_ref

      if (req.files[1]) {
        const bodyFormDataBack2 = new FormData()
        bodyFormDataFront.append('file', req.files[1].buffer, {
          filename: req.files[1].originalname,
        })

        const { upload_ref } = await this.dotfileApi.request(
          'post',
          `files/upload`,
          {},
          bodyFormDataBack2,
          {
            ...bodyFormDataBack2.getHeaders(),
          },
        )

        back_upload_ref = upload_ref
      }

      const completedChecks = await this.dotfileApi.request(
        'post',
        `checks/${type}/${checkId}/add_files`,
        {},
        {
          front_upload_ref,
          back_upload_ref,
        },
        {},
      )

      res.status(200).json(completedChecks)
    } catch (err: any) {
      console.log(err)
      res.status(400).send({
        type: 'error',
        message: 'Something went wrong while uploading identity documents',
      })
    }
  }
}

export default DotfileController

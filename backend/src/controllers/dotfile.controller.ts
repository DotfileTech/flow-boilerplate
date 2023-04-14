import { Request, Response, NextFunction } from 'express'
import FormData from 'form-data'
import Dotfile from '../api/dotfile.api'

class DotfileController {
  public dotfileApi = new Dotfile({
    host: process.env.DOTFILE_BASE_URL,
    secretKey: process.env.DOTFILE_KEY,
    isDev: process.env.NODE_ENV === 'development'
  })

  private upload = async (file): Promise<string> => {
    const bodyFormData = new FormData()
    bodyFormData.append('file', file.buffer, {
      filename: file.originalname,
    })
    const { upload_ref } = await this.dotfileApi.request(
      'post',
      `files/upload`,
      {},
      bodyFormData,
      {
        ...bodyFormData.getHeaders(),
      },
    )

    return upload_ref
  }

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
      const { country, name, registration_number } = req.query

      const companies = await this.dotfileApi.request(
        'get',
        'company-data/search',
        {
          country,
          name,
          registration_number,
        },
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

      for (const individual of company.merged_individuals) {
        individual.street_address = individual.address.street_address
        individual.street_address2 = individual.address.street_address_2
        individual.postal_code = individual.address.postal_code
        individual.city = individual.address.city
      }

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
      const { company, individuals, metadata, externalId } = req.body

      let template_id: string = process.env.TEMPLATE_ID

      // Custom config
      // For several templates, create a mapping between a metadata and the corresponding template
      /*switch (metadata['company_structure']) {
        case 'private_company':
          template_id = process.env.TEMPLATE_PRIVATE_COMPANY
          break
        case 'public_company':
          template_id = process.env.TEMPLATE_PUBLIC_COMPANY
          break
        case 'association':
          template_id = process.env.TEMPLATE_ASSOCIATION
          break
        case 'self_employed':
          template_id = process.env.TEMPLATE_SELF_EMPLOYED
          break
        default:
          template_id = process.env.TEMPLATE_ID
      }*/

      const createdCase = await this.dotfileApi.request(
        'post',
        'cases',
        {},
        {
          name: company.name,
          ...(externalId && { external_id: externalId }),
          template_id: template_id || null,
          metadata: Object.keys(metadata)
            .filter((k) => metadata[k] != null)
            .reduce((a, k) => ({ ...a, [k]: metadata[k] }), {}),
        },
        {},
      )

      for (const individual of individuals) {
        await this.dotfileApi.request(
          'post',
          'individuals',
          {},
          {
            // Required
            case_id: createdCase.id,
            roles: individual.roles,
            first_name: individual.first_name,
            last_name: individual.last_name,
            // Optional
            email: individual.email,
            birth_date: individual.birth_date,
            birth_country: individual.birth_country,
            birth_place: individual.birth_place,
            address: {
              street_address: individual.street_address,
              street_address2: individual.street_address2,
              postal_code: individual.postal_code,
              city: individual.city,
              state: individual.state,
              region: individual.region,
              country: individual.country,
            },
            banking_information: {
              iban: individual.iban,
              bic: individual.bic,
            },
            tax_identification_number: individual.tax_identification_number,
            social_security_number: individual.social_security_number,
            phone_number: individual.phone_number,
            position: individual.position,
            ownership_percentage: individual.ownership_percentage
          },
          {},
        )
      }

      await this.dotfileApi.request(
        'post',
        'companies',
        {},
        {
          // Required
          case_id: createdCase.id,
          name: company.name,
          registration_number: company.registration_number,
          country: company.country,
          // Optional
          registration_date: company.registration_date,
          status: company.status,
          legal_form: company.legal_form,
          address: {
            street_address: company.street_address,
            street_address2: company.street_address2,
            postal_code: company.postal_code,
            city: company.city,
            state: company.state,
            region: company.region,
            country: company.country,
          },
          banking_information: {
            iban: company.iban,
            bic: company.bic,
          },
          tax_identification_number: company.tax_identification_number,
          website_url: company.website_url,
          employer_identification_number: company.employer_identification_number
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
      let files = []

      for (let i = 0; i < (req.files.length as number); i++) {
        const uploadRef = await this.upload(req.files[i])
        files.push({
          upload_ref: uploadRef,
        })
      }

      const { checkId, type } = req.body

      const completedChecks = await this.dotfileApi.request(
        'post',
        `checks/${type}/${checkId}/add_files`,
        {},
        {
          files,
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

      const { checkId, type } = req.body

      const front_upload_ref = await this.upload(req.files[0])

      let back_upload_ref

      if (req.files[1]) {
        back_upload_ref = await this.upload(req.files[0])
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
      res.status(400).send({
        type: 'error',
        message: 'Something went wrong while uploading identity documents',
      })
    }
  }
}

export default DotfileController

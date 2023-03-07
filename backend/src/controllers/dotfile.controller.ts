import { Request, Response, NextFunction } from 'express'
import axios from 'axios'

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
  ) {
    const url = `${this.serverUrl}/${endpoint}`

    let headers = {
      'Content-Type': 'application/json',
      'Accept-Encoding': 'application/json',
      'X-DOTFILE-API-KEY': this.secretKey,
    }

    const { data } = await axios(url, {
      method,
      params,
      headers,
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
      )
      res.status(200).json(companies)
      // res.status(200).json({
      //   data: [
      //     {
      //       country: 'FR',
      //       name: 'DOTFILE',
      //       search_ref: 'cGFwcGVycztGUjs5MTA4OTI3Nzc=',
      //       registration_number: '910892777',
      //       address: {
      //         postal_code: '75009',
      //       },
      //     },
      //   ],
      // })
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
      )
      res.status(200).json(company)
      // res.status(200).json({
      //   name: 'DOTFILE',
      //   registration_number: '910892777',
      //   country: 'FR',
      //   status: 'live',
      //   registration_date: '2022-02-25',
      //   legal_form: 'SAS, société par actions simplifiée',
      //   address: {
      //     street_address: '9 RUE AMBROISE THOMAS',
      //     street_address_2: null,
      //     postal_code: '75009',
      //     city: 'PARIS 9',
      //     country: 'FR',
      //   },
      //   classifications: [
      //     {
      //       type: 'naf',
      //       code: '62.01Z',
      //       description: 'Programmation informatique',
      //     },
      //   ],
      //   beneficial_owners: [
      //     {
      //       entity_type: 'individual',
      //       name: 'Vasco Alexandre',
      //       first_name: 'Vasco',
      //       last_name: 'Alexandre',
      //       birth_date: '1992-07-03',
      //       birth_country: 'FR',
      //       ownership_percentage: null,
      //     },
      //   ],
      //   shareholders: null,
      //   legal_representatives: [
      //     {
      //       entity_type: 'individual',
      //       name: 'Vasco Alexandre',
      //       first_name: 'Vasco',
      //       last_name: 'Alexandre',
      //       birth_date: '1992-07-03',
      //       birth_country: 'FR',
      //       position: 'Président',
      //     },
      //   ],
      // })
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
      const { company, individuals } = req.body

      console.log(company)

      const createdCase = await this.dotfileApi.request(
        'post',
        'cases',
        {},
        {
          name: company.name,
        },
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
        )

        if (individual.roles.includes('applicant')) {
          await this.dotfileApi.request(
            'post',
            'checks/id_verification',
            {},
            {
              individual_id: createdIndividual.id,
            },
          )
        } else {
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
          )
        }
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
      )

      res.status(200).json({
        caseUrl: `https://beta.portal.dotfile.com/cases/${createdCase.id}`,
      })
    } catch (err: any) {
      console.log(err)
      res.status(400).send({
        type: 'error',
        message: 'Something went wrong while processing your export',
      })
    }
  }
}

export default DotfileController

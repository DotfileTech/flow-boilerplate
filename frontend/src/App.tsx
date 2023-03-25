import * as React from 'react'
import { Stack, Flex } from '@chakra-ui/react'
import Sidebar from './components/Sidebar'
import LoadingSpinner from './components/LoadingSpinner'
import Header from './components/Header'
import MobileHeader from './components/MobileHeader'
import CompanySearch from './steps/CompanySearch'
import CompaniesList from './steps/CompaniesList'
import CompanyEdit from './steps/CompanyEdit'
import IndividualEdit from './steps/IndividualEdit'
import IndividualsList from './steps/IndividualsList'
import ChecksList from './steps/ChecksList'
import CustomForm from './steps/CustomForm'
import useApi from './hooks/useApi'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { form } from './config/Forms'
// import axios from 'axios'

export interface Company {
  name?: string
  street_address?: string
  registration_number?: string
  registration_date?: string
  legal_form?: string
}

function AppContent() {
  const { t } = useTranslation()

  const api = useApi()

  const [searchParams] = useSearchParams()

  const [caseId, setCaseId] = React.useState(
    searchParams.get('new') === 'true'
      ? undefined
      : searchParams.get('caseId') || localStorage.getItem('caseId'),
  )

  const email = searchParams.get('email')
  const sid = searchParams.get('sid')

  async function fetchMyAPI() {
    // if (process.env.REACT_APP_CONFIG) {
    //   const formsResponse = await axios.get(
    //     'https://api.npoint.io/d9088d5321d77e6e4756',
    //   )

    //   if (formsResponse.data) setForm(formsResponse.data as [])
    // }

    // form.forEach((item) => {
    //   if (!item.after) {
    //     steps.unshift({
    //       key: item.key,
    //       content: (
    //         <CustomForm
    //           metadata={metadata}
    //           questions={item.questions}
    //           changeHandlerMetadata={changeHandlerMetadata}
    //           next={next}
    //         />
    //       ),
    //     })
    //   } else {
    //     const index =
    //       steps.findIndex((element) => element.key === item.after) + 1
    //     steps.splice(index, 0, {
    //       key: item.key,
    //       content: (
    //         <CustomForm
    //           metadata={metadata}
    //           questions={item.questions}
    //           changeHandlerMetadata={changeHandlerMetadata}
    //           next={next}
    //         />
    //       ),
    //     })
    //   }
    // })

    if (caseId)
      setStep(steps.findIndex((element) => element.key === 'checks_list'))

    if (searchParams.get('company')) getCompanies()
    const response = await api.get('/dotfile/countries')
    setCountries(response.data)
    setIsLoading(false)
  }

  React.useEffect(() => {
    fetchMyAPI()
  }, [])

  // const [form, setForm] = React.useState<any[]>([])

  const [countries, setCountries] = React.useState([])

  const [step, setStep] = React.useState(0)

  const [companies, setCompanies] = React.useState<any>([])

  const [individuals, setIndividuals] = React.useState<any>([])

  const [individual, setIndividual] = React.useState<any>({})

  const [metadata, setMetadata] = React.useState<any>({
    email,
    sid,
  })

  const [company, setCompany] = React.useState<any>({
    name: searchParams.get('company'),
    country: searchParams.get('country'),
  })

  const [individualIndex, setIndividualIndex] = React.useState(null)

  const [isLoading, setIsLoading] = React.useState(true)

  const next = async (e: any) => {
    if (step === 0) {
      getCompanies()
    }
    setStep(step + 1)
  }

  const submit = async (e: any) => {
    setIsLoading(true)
    const response = await api.post(`dotfile/cases`, {
      company,
      individuals,
      email,
      metadata,
    })
    setCaseId(response.data.caseId)
    localStorage.setItem('caseId', response.data.caseId)
    setStep(steps.findIndex((element) => element.key === 'checks_list'))
    setIsLoading(false)
  }

  const back = async (e: any) => {
    setStep(step - 1)
  }

  const getCompanies = async () => {
    try {
      setIsLoading(true)
      const response = await api.get(
        `dotfile/companies?country=${company.country}&name=${company.name}`,
      )
      if (response.data.data.length === 0) {
        setIsLoading(false)
        setStep(step + 2)
      } else {
        setIsLoading(false)
        setCompanies(response.data.data)
        setStep(step + 1)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const selectCompany = async (id: any) => {
    if (id === null) {
      // setCompanyData({});
      setIndividuals([])
      setStep(step + 1)
    } else {
      setIsLoading(true)
      const response = await api.get(`/dotfile/companies/${id}`)
      setCompany(response.data)
      setIndividuals(response.data.individuals)
      setIsLoading(false)
      setStep(step + 1)
    }
  }

  const selectIndividual = (i: any) => {
    if (i === null) {
      setIndividual({})
      setIndividualIndex(null)
    } else {
      setIndividualIndex(i)
      setIndividual(individuals[i])
    }
    setStep(steps.length - 2)
  }

  const changeHandler = (e: any) => {
    setCompany({ ...company, [e.target.name]: e.target.value })
  }

  const changeHandlerMetadata = (e: any) => {
    setMetadata({ ...metadata, [e.target.name]: e.target.value })
  }

  const saveIndividual = (e: any) => {
    if (individualIndex !== null) {
      individuals[individualIndex] = individual
    } else {
      individuals.push(individual)
    }
    setStep(step - 1)
  }

  // Steps Configuration

  const steps = [
    {
      key: 'company_search',
      content: (
        <CompanySearch
          getCompanies={getCompanies}
          countries={countries}
          company={company}
          changeHandler={changeHandler}
          isLoading={isLoading}
        />
      ),
    },
    {
      key: 'company_list',
      content: (
        <CompaniesList
          selectCompany={selectCompany}
          companies={companies}
          isLoading={isLoading}
          back={back}
        />
      ),
    },
    {
      key: 'company_edit',
      content: (
        <CompanyEdit
          company={company}
          changeHandler={changeHandler}
          next={next}
          back={back}
          countries={countries}
        />
      ),
    },
    {
      key: form[0].key,
      content: (
        <CustomForm
          metadata={metadata}
          questions={form[0].questions}
          changeHandlerMetadata={changeHandlerMetadata}
          next={next}
        />
      ),
    },
    {
      key: 'individuals_list',
      content: (
        <IndividualsList
          selectIndividual={selectIndividual}
          individuals={individuals}
          setIndividuals={setIndividuals}
          submit={submit}
        />
      ),
    },
    {
      key: 'individual_edit',
      content: (
        <IndividualEdit
          individual={individual}
          setIndividual={setIndividual}
          saveIndividual={saveIndividual}
          next={next}
          back={back}
          countries={countries}
        />
      ),
    },
    {
      key: 'checks_list',
      content: (
        <ChecksList
          individual={individual}
          setIndividual={setIndividual}
          saveIndividual={saveIndividual}
          next={next}
          back={back}
          countries={countries}
          caseId={caseId}
          setIsLoading={setIsLoading}
        />
      ),
    },
  ]

  return (
    <Flex direction={{ base: 'column', md: 'row' }}>
      <MobileHeader />
      <Sidebar />
      <Flex ml={['0', '0', '25vw']}>
        <Stack
          // spacing={5}
          maxW={'900px'}
          width="100%"
          py={[5, 10, 10]}
          px={[5, 10, 20]}
        >
          <Stack spacing={4}>
            <Header
              back={back}
              progress={(step / steps.length) * 100}
              hasBackButton={step !== 0 && step !== steps.length - 1}
            >
              {t(`steps.${steps[step].key}.title`)}
            </Header>
            {isLoading && <LoadingSpinner />}
            {!isLoading && steps[step].content}
          </Stack>
        </Stack>
      </Flex>
    </Flex>
  )
}

export default function App() {
  return <AppContent />
}

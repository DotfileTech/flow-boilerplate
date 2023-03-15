import * as React from 'react'
import { Stack, Flex } from '@chakra-ui/react'
import Sidebar from './components/Sidebar'
import LoadingSpinner from './components/LoadingSpinner'
import CompanySearch from './steps/CompanySearch'
import CompaniesList from './steps/CompaniesList'
import CompanyEdit from './steps/CompanyEdit'
import IndividualEdit from './steps/IndividualEdit'
import IndividualsList from './steps/IndividualsList'
import ChecksList from './steps/ChecksList'
import CustomForm from './steps/CustomForm'
import useApi from './hooks/useApi'
import { useSearchParams } from 'react-router-dom'

export interface Company {
  name?: string
  street_address?: string
  registration_number?: string
  registration_date?: string
  legal_form?: string
}

function AppContent() {
  const api = useApi()

  const [searchParams] = useSearchParams()

  const [caseId, setCaseId] = React.useState(
    searchParams.get('new') === 'true'
      ? undefined
      : searchParams.get('caseId') || localStorage.getItem('caseId'),
  )

  const email = searchParams.get('email')

  React.useEffect(() => {
    async function fetchMyAPI() {
      console.log(caseId)
      if (caseId) setStep(7)
      if (searchParams.get('company')) getCompanies()
      const response = await api.get('/dotfile/countries')
      setCountries(response.data)
      setInitialLoading(false)
    }
    fetchMyAPI()
  }, [])

  const [countries, setCountries] = React.useState([])

  const [step, setStep] = React.useState(1)

  const [companies, setCompanies] = React.useState<any>([])

  const [individuals, setIndividuals] = React.useState<any>([])

  const [individual, setIndividual] = React.useState<any>({})

  const [metadata, setMetadata] = React.useState<any>({})

  const [company, setCompany] = React.useState<any>({
    name: searchParams.get('company'),
    country: 'FR',
  })

  const [individualIndex, setIndividualIndex] = React.useState(null)

  const [isLoading, setIsLoading] = React.useState(false)
  const [initialLoading, setInitialLoading] = React.useState(true)

  const next = async (e: any) => {
    if (step === 1) {
      getCompanies()
    }
    if (step === 5) {
      const response = await api.post(`dotfile/cases`, {
        company,
        individuals,
      })
      return window.location.replace(response.data.caseUrl)
    }
    setStep(step + 1)
  }

  const submit = async (e: any) => {
    const response = await api.post(`dotfile/cases`, {
      company,
      individuals,
      email,
    })
    setCaseId(response.data.caseId)
    localStorage.setItem('caseId', response.data.caseId)
    setStep(7)
    // return window.location.replace(response.data.caseUrl)
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
    setStep(6)
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
    setStep(5)
  }

  const [title, setTitle] = React.useState('Hello')

  return (
    <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
      <Sidebar />
      <Flex
        minH={'100vh'}
        flex={1}
        // direction={{ base: 'row', md: 'row' }}
        // align={'center'}
        justify={'left'}
      >
        {initialLoading && <LoadingSpinner />}
        {!initialLoading && (
          <Stack
            w="100%"
            spacing={5}
            maxW={'900px'}
            // mx={'auto'}
            //  maxW={'lg'}
            py={12}
            px={12}
          >
            <Stack spacing={4}>
              {step === 1 && (
                <CompanySearch
                  getCompanies={getCompanies}
                  countries={countries}
                  company={company}
                  changeHandler={changeHandler}
                  isLoading={isLoading}
                />
              )}
              {step === 2 && (
                <CompaniesList
                  selectCompany={selectCompany}
                  companies={companies}
                  isLoading={isLoading}
                  back={back}
                />
              )}
              {step === 3 && (
                <CompanyEdit
                  company={company}
                  changeHandler={changeHandler}
                  next={next}
                  back={back}
                  countries={countries}
                />
              )}
              {step === 4 && (
                <CustomForm
                  metadata={metadata}
                  changeHandlerMetadata={changeHandlerMetadata}
                  next={next}
                />
              )}
              {step === 5 && (
                <IndividualsList
                  selectIndividual={selectIndividual}
                  individuals={individuals}
                  setIndividuals={setIndividuals}
                  submit={submit}
                />
              )}
              {step === 6 && (
                <IndividualEdit
                  individual={individual}
                  setIndividual={setIndividual}
                  saveIndividual={saveIndividual}
                  next={next}
                  back={back}
                  countries={countries}
                />
              )}
              {step === 7 && (
                <ChecksList
                  individual={individual}
                  setIndividual={setIndividual}
                  saveIndividual={saveIndividual}
                  next={next}
                  back={back}
                  countries={countries}
                  caseId={caseId}
                />
              )}
            </Stack>
          </Stack>
        )}
      </Flex>
    </Stack>
  )
}

export default function App() {
  return <AppContent />
}

import * as React from 'react'

import {
  ChakraProvider,
  Box,
  Stack,
  Flex,
  Button,
  extendTheme,
  Heading,
  Text,
} from '@chakra-ui/react'

import { ColorModeSwitcher } from './components/ColorModeSwitcher'
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
import { PhoneIcon, AddIcon, WarningIcon } from '@chakra-ui/icons'

const items = [
  {
    href: '/',
    icon: <PhoneIcon fontSize="small" />,
    title: 'Introduction',
    subTitle: 'XXX',
  },
  {
    href: '/templates',
    icon: <AddIcon fontSize="small" />,
    title: 'Company',
    subTitle: 'XXX',
  },
  {
    href: '/exports',
    icon: <WarningIcon fontSize="small" />,
    title: 'Individuals',
    subTitle: 'XXX',
  },
]

const activeLabelStyles = {
  transform: 'scale(0.85) translateY(-24px)',
}

export const theme = extendTheme({
  colors: {
    brand: {
      100: '#E9E3FF',
      200: '#422AFB',
      300: '#422AFB',
      400: '#7551FF',
      500: '#422AFB',
      600: '#3311DB',
      700: '#02044A',
      800: '#190793',
      900: '#11047A',
    },
    brandScheme: {
      100: '#E9E3FF',
      200: '#7551FF',
      300: '#7551FF',
      400: '#7551FF',
      500: '#422AFB',
      600: '#3311DB',
      700: '#02044A',
      800: '#190793',
      900: '#02044A',
    },
    brandTabs: {
      100: '#E9E3FF',
      200: '#422AFB',
      300: '#422AFB',
      400: '#422AFB',
      500: '#422AFB',
      600: '#3311DB',
      700: '#02044A',
      800: '#190793',
      900: '#02044A',
    },
    secondaryGray: {
      100: '#E0E5F2',
      200: '#E1E9F8',
      300: '#F4F7FE',
      400: '#E9EDF7',
      500: '#8F9BBA',
      600: '#A3AED0',
      700: '#707EAE',
      800: '#707EAE',
      900: '#1B2559',
    },
    red: {
      100: '#FEEFEE',
      500: '#EE5D50',
      600: '#E31A1A',
    },
    blue: {
      50: '#EFF4FB',
      500: '#3965FF',
    },
    orange: {
      100: '#FFF6DA',
      500: '#FFB547',
    },
    green: {
      100: '#E6FAF5',
      500: '#01B574',
    },
    navy: {
      50: '#d0dcfb',
      100: '#aac0fe',
      200: '#a3b9f8',
      300: '#728fea',
      400: '#3652ba',
      500: '#1b3bbb',
      600: '#24388a',
      700: '#1B254B',
      800: '#111c44',
      900: '#0b1437',
    },
    gray: {
      100: '#FAFCFE',
    },
  },
  styles: {
    global: {
      // styles for the `body`
      body: {
        // bg: 'gray.100',
      },
      // styles for the `a`
      a: {
        color: 'teal.500',
        _hover: {
          textDecoration: 'underline',
        },
      },
      html: {},
    },
  },
  components: {
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: {
                ...activeLabelStyles,
              },
            },
            'input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label':
              {
                ...activeLabelStyles,
              },
            label: {
              top: 0,
              left: 0,
              zIndex: 2,
              position: 'absolute',
              // backgroundColor: mode("black", "black"),
              pointerEvents: 'none',
              mx: 3,
              px: 1,
              my: 2,
              transformOrigin: 'left top',
            },
          },
        },
      },
    },
  },
})

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
    <ChakraProvider theme={theme}>
      {/* <ColorModeSwitcher /> */}
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
              maxW={'50vw'}
              // mx={'auto'}
              //  maxW={'lg'}
              py={12}
              px={6}
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
    </ChakraProvider>
  )
}

export default function App() {
  return <AppContent />
}

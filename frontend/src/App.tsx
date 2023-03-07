import * as React from 'react'

import {
  ChakraProvider,
  Box,
  Stack,
  Flex,
  extendTheme,
  Progress,
  Text,
  Avatar,
} from '@chakra-ui/react'

import { ColorModeSwitcher } from './components/ColorModeSwitcher'
import LoadingSpinner from './components/LoadingSpinner'
import { logo } from './components/Logo'
import CompanySearch from './steps/CompanySearch'
import CompaniesList from './steps/CompaniesList'
import CompanyEdit from './steps/CompanyEdit'
import IndividualEdit from './steps/IndividualEdit'
import IndividualsList from './steps/IndividualsList'
import CustomForm from './steps/CustomForm'
import useApi from './hooks/useApi'

const activeLabelStyles = {
  transform: 'scale(0.85) translateY(-24px)',
}

export const theme = extendTheme({
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

  React.useEffect(() => {
    async function fetchMyAPI() {
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
    name: '',
    country: 'FR',
  })

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
    })
    return window.location.replace(response.data.caseUrl)
  }

  const back = async (e: any) => {
    setStep(step - 1)
  }

  async function getCompanies() {
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

  const [individualIndex, setIndividualIndex] = React.useState(null)

  const selectCompany = async (id: any) => {
    if (id === null) {
      // setCompanyData({});
      setIndividuals([])
      setStep(step + 1)
    } else {
      setIsLoading(true)
      const response = await api.get(`/dotfile/companies/${id}`)
      setCompany(response.data)
      setIndividuals(response.data.beneficial_owners)
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

  const [isLoading, setIsLoading] = React.useState(false)
  const [initialLoading, setInitialLoading] = React.useState(true)

  return (
    <ChakraProvider theme={theme}>
      {/* <ColorModeSwitcher /> */}
      <Flex minH={'100vh'} align={'center'} justify={'center'}>
        {initialLoading && <LoadingSpinner />}
        {!initialLoading && (
          <Stack w="100%" spacing={5} mx={'auto'} maxW={'lg'} py={12} px={6}>
            <Box rounded={'lg'} boxShadow={'lg'} p={8}>
              <Stack align={'center'} spacing={6} pb={6}>
                <Avatar src={`${logo}`} />
                <Progress w="100%" value={(step / 5) * 100} />
                <Text color={'gray.600'}>
                  {' '}
                  {step < 5
                    ? 'Tell us more about your company'
                    : 'Information on beneficial owners'}{' '}
                </Text>
              </Stack>
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
              </Stack>
            </Box>
          </Stack>
        )}
      </Flex>
    </ChakraProvider>
  )
}

export default function App() {
  return <AppContent />
}

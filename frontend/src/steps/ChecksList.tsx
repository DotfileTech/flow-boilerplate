import * as React from 'react'
import {
  Stack,
  Button,
  Flex,
  Spacer,
  Heading,
  Box,
  Text,
  Divider,
} from '@chakra-ui/react'
import useApi from '../hooks/useApi'
import UploadDocuments from '../components/UploadDocuments'
import SendLinkModal from '../components/SendLinkModal'
import Title from '../components/Title'
import Subtitle from '../components/Subtitle'

function ChecksList(props: any) {
  const api = useApi()

  async function fetchMyAPI() {
    const response = await api.get(`/dotfile/cases/${props.caseId}`)
    setData(response.data)
    countRemainingChecks(response.data)
  }

  React.useEffect(() => {
    fetchMyAPI()
  }, [])

  const processCheck = async (check: any) => {
    const response = await api.post(`dotfile/checks`, {
      checkId: check.id,
      type: check.type,
    })
    return window.location.replace(response.data.url)
  }

  const [data, setData] = React.useState({
    individuals: [],
    companies: [],
  })

  const [remainingChecks, setRemainingChecks] = React.useState(0)

  const [isUpload, setIsUpload] = React.useState(false)
  const [isSendEmail, setIsSendEmail] = React.useState(false)

  const [currentCheck, setCurrentCheck] = React.useState({})
  const [currentIndividual, setCurrentIndividual] = React.useState({})

  const selectCheck = (check: any) => {
    if (check.type === 'id_verification') {
      // processCheck(check)
      setIsSendEmail(true)
    } else {
      setCurrentCheck(check)
      setIsUpload(true)
    }
  }

  const countRemainingChecks = (data: any) => {
    let remainingChecks = []

    data.companies.map((item: any, i: any) =>
      item.checks
        .filter((x: any) => x.type !== 'aml')
        .filter((x: any) => x.status === 'in_progress')
        .forEach((element: any) => remainingChecks.push(element)),
    )

    data.individuals.map((item: any, i: any) =>
      item.checks
        .filter((x: any) => x.type !== 'aml')
        .filter((x: any) => x.status === 'in_progress')
        .forEach((element: any) => remainingChecks.push(element)),
    )

    setRemainingChecks(remainingChecks.length)
  }

  return (
    <Stack spacing={5} pt={2}>
      <Title>Help us run necessary verifications</Title>
      {/* <Title>You have {remainingChecks} remaining tasks</Title> */}
      <Text>
        Please proceed with the necessary verifications listed below. Our teams
        will analyze your data and keep you informed about the outcome of your
        case.
      </Text>
      <Subtitle>Company</Subtitle>
      <Box borderWidth="1px" borderRadius="lg" background="white">
        {data.companies.map((item: any, i: any) =>
          item.checks
            .filter((x: any) => x.type !== 'aml')
            .map((check: any, i: any) => (
              <Box>
                <Flex alignItems="center" verticalAlign="center" m={2}>
                  <Heading size="sm">
                    {`${item.name} - `}
                    {check.type === 'document'
                      ? check.subtype.split(':')[1]
                      : check.type}
                  </Heading>
                  <Spacer />
                  <Button
                    // size="lg"
                    id={check.id}
                    name={check.type}
                    // variant="secondary"
                    onClick={() => {
                      selectCheck(check)
                      setCurrentIndividual(item)
                    }}
                    isDisabled={check.status !== 'in_progress'}
                  >
                    {check.status === 'in_progress'
                      ? 'Upload document'
                      : 'Completed'}
                  </Button>
                </Flex>
                <Divider />
              </Box>
            )),
        )}
      </Box>
      <Subtitle>Individuals</Subtitle>
      <Box borderWidth="1px" borderRadius="lg" background="white">
        {data.individuals.map((item: any, i: any) =>
          item.checks
            .filter((x: any) => x.type !== 'aml')
            .map((check: any, i: any) => (
              <Box>
                <Flex alignItems="center" verticalAlign="center" m={2}>
                  <Heading size="sm">
                    {`${item.first_name} ${item.last_name} - `}
                    {check.type === 'document'
                      ? check.subtype.split(':')[1]
                      : check.type}
                  </Heading>
                  <Spacer />
                  {check.data.result} {check.data.review.comment}
                  <Spacer />
                  <Button
                    // size="lg"
                    id={check.id}
                    name={check.type}
                    variant="solid"
                    onClick={() => {
                      selectCheck(check)
                      setCurrentIndividual(item)
                    }}
                    isDisabled={
                      check.status !== 'in_progress' &&
                      check.data.result !== 'rejected'
                    }
                  >
                    {check.data.result === 'rejected'
                      ? 'Upload new document'
                      : check.status === 'in_progress'
                      ? check.type === 'id_verification'
                        ? 'Verify identity'
                        : 'Upload document'
                      : 'Completed'}
                  </Button>
                </Flex>
                <Divider />
              </Box>
            )),
        )}
      </Box>

      <UploadDocuments
        currentCheck={currentCheck}
        currentIndividual={currentIndividual}
        setIsUpload={setIsUpload}
        fetchMyAPI={fetchMyAPI}
        isUpload={isUpload}
      />

      <SendLinkModal
        currentCheck={currentCheck}
        currentIndividual={currentIndividual}
        setIsSendEmail={setIsSendEmail}
        isSendEmail={isSendEmail}
        caseId={props.caseId}
      />
    </Stack>
  )
}

export default ChecksList

import * as React from 'react'
import {
  Stack,
  Button,
  Tag,
  Flex,
  Spacer,
  Heading,
  VStack,
  Box,
  Divider,
  Center,
} from '@chakra-ui/react'
import useApi from '../hooks/useApi'
import UploadDocuments from './UploadDocuments'

function ChecksList(props: any) {
  const api = useApi()

  async function fetchMyAPI() {
    const response = await api.get(`/dotfile/cases/${props.caseId}`)
    setData(response.data)
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

  const [isUpload, setIsUpload] = React.useState(false)
  const [currentCheck, setCurrentCheck] = React.useState({})
  const [currentIndividual, setCurrentIndividual] = React.useState({})

  const selectCheck = (check: any) => {
    console.log(check)
    if (check.type === 'id_verification') {
      processCheck(check)
    } else {
      setCurrentCheck(check)
      setIsUpload(true)
    }
  }

  return (
    <Stack spacing={5} pt={2}>
      {/* {!isUpload &&
        data.companies.map((item: any, i: any) => (
          <VStack key={i}>
            <Heading>{item.name}</Heading>
            <Spacer />

            {item.checks
              .filter((x: any) => x.type !== 'aml')
              .map((check: any, i: any) => (
                <Flex>
                  <Button
                    size="lg"
                    id={check.id}
                    name={check.type}
                    // variant="solid"
                    onClick={() => selectCheck(check)}
                    // isDisabled={check.status === 'completed'}
                  >
                    {check.type === 'document'
                      ? check.subtype.split(':')[1]
                      : check.type}
                    <Tag>{check.status}</Tag>
                  </Button>
                </Flex>
              ))}
          </VStack>
        ))} */}
      {!isUpload &&
        data.individuals.map((item: any, i: any) =>
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
                  <Button
                    // size="lg"
                    id={check.id}
                    name={check.type}
                    // variant="secondary"
                    onClick={() => {
                      selectCheck(check)
                      setCurrentIndividual(item)
                    }}
                    // isDisabled={check.status === 'completed'}
                  >
                    {check.status}
                  </Button>
                </Flex>
                <Divider />
              </Box>
            )),
        )}
      {isUpload && (
        <UploadDocuments
          currentCheck={currentCheck}
          currentIndividual={currentIndividual}
          setIsUpload={setIsUpload}
          fetchMyAPI={fetchMyAPI}
        />
      )}
    </Stack>
  )
}

export default ChecksList

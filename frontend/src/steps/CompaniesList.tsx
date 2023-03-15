import { EditIcon } from '@chakra-ui/icons'
import { SimpleGrid, Button, Text, Radio, Stack, Box } from '@chakra-ui/react'
import Header from '../components/Header'

function CompanySearch(props: any) {
  return (
    <Stack spacing={10} pt={2}>
      <Header progress={20}>Select your company</Header>
      <SimpleGrid columns={1} spacing={5}>
        {props.companies.map((company: any, i: any) => (
          <Button
            isLoading={props.isLoading}
            key={i}
            variant="select"
            onClick={() => props.selectCompany(company.search_ref)}
            justifyContent="flex"
            isTruncated
          >
            <Radio value="1">
              <Text isTruncated>
                {company.name} - {company.registration_number}
              </Text>
            </Radio>
          </Button>
        ))}
      </SimpleGrid>
      <Box>
        <Text pb={5}>You cannot you find your company?</Text>
        <Button
          leftIcon={<EditIcon />}
          variant="fill"
          onClick={() => props.selectCompany(null)}
        >
          Fill details manually
        </Button>
      </Box>
    </Stack>
  )
}

export default CompanySearch

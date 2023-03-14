import { SimpleGrid, Button, Text, Radio, Stack } from '@chakra-ui/react'
import Title from '../components/Title'

function CompanySearch(props: any) {
  return (
    <Stack spacing={5} pt={2}>
      <Title>Company</Title>
      <SimpleGrid columns={1} spacing={5}>
        {props.companies.map((company: any, i: any) => (
          <Button
            isLoading={props.isLoading}
            key={i}
            variant="outline"
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
        <Button variant="outline" onClick={() => props.selectCompany(null)}>
          Fill details manually
        </Button>
      </SimpleGrid>
    </Stack>
  )
}

export default CompanySearch

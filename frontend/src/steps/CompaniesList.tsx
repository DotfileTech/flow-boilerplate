import { SimpleGrid, Button, Text, Radio } from '@chakra-ui/react'

function CompanySearch(props: any) {
  return (
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
  )
}

export default CompanySearch

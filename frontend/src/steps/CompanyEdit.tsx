import * as React from 'react'
import { SimpleGrid, Button, Stack } from '@chakra-ui/react'
import InputFloatingLabel from '../components/InputFloatingLabel'
import SelectFloatingLabel from '../components/SelectFloatingLabel'
import Joi from 'joi'
import { companyData } from '../config/Company'
import Header from '../components/Header'

function CompanyEdit(props: any) {
  const [formValid, setFormValid] = React.useState(false)

  const rules = companyData
    .filter((company) => company.required && company.enabled)
    .reduce((acc, cur) => ({ ...acc, [cur.id]: Joi.string().required() }), {})

  const schema = Joi.object().keys(rules).unknown(true)

  React.useEffect(() => {
    const check = schema.validate(props.company)
    if (check.error) {
      setFormValid(false)
    } else {
      setFormValid(true)
    }
  }, [props.company, schema])

  return (
    <Stack spacing={5} pt={2}>
      <Header progress={30}>Verify your company’s information</Header>
      <SimpleGrid columns={1} spacing={5}>
        <SelectFloatingLabel
          value={props.company ? props.company.country : ''}
          onChange={props.changeHandler}
          name="country"
          isRequired
          placeholder="Country"
          countries={props.countries}
        />

        {companyData
          .filter((company) => company.enabled)
          .map((company: any, i: any) => (
            <InputFloatingLabel
              key={company.id}
              value={props.company[company.id]}
              onChange={props.changeHandler}
              name={company.id}
              placeholder={company.label}
              isRequired={company.required}
              type={company.type}
            />
          ))}

        <Button variant="next" onClick={props.next} isDisabled={!formValid}>
          Next
        </Button>
      </SimpleGrid>
    </Stack>
  )
}

export default CompanyEdit

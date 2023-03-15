import * as React from 'react'

import {
  InputGroup,
  Button,
  SimpleGrid,
  Stack,
  useColorMode,
} from '@chakra-ui/react'
import Joi from 'joi'

import InputFloatingLabel from '../components/InputFloatingLabel'
import SelectFloatingLabel from '../components/SelectFloatingLabel'
import Header from '../components/Header'
import { ChevronRightIcon } from '@chakra-ui/icons'

function CompanySearch(props: any) {
  const [formValid, setFormValid] = React.useState(false)

  const schema = Joi.object()
    .keys({
      country: Joi.string().required(),
      name: Joi.string().required(),
    })
    .unknown(true)

  React.useEffect(() => {
    const check = schema.validate(props.company)

    if (check.error) {
      setFormValid(false)
    } else {
      setFormValid(true)
    }
  }, [props.company, schema])

  const { colorMode } = useColorMode()

  return (
    <Stack spacing={10} pt={2}>
      <Header progress={10}>Select your company</Header>
      <SimpleGrid columns={1} spacing={5}>
        <SelectFloatingLabel
          value={props.company ? props.company.country : ''}
          isRequired
          onChange={props.changeHandler}
          name="country"
          countries={props.countries}
        />

        <InputGroup size="md">
          <InputFloatingLabel
            pr="4.5rem"
            type="text"
            isRequired
            placeholder="Company name"
            value={props.company ? props.company.name : ''}
            onChange={props.changeHandler}
            name="name"
          />
        </InputGroup>
      </SimpleGrid>
      <Button
        variant="next"
        rightIcon={<ChevronRightIcon />}
        isLoading={props.isLoading}
        onClick={props.getCompanies}
        isDisabled={!formValid}
      >
        Search
      </Button>
    </Stack>
  )
}

export default CompanySearch

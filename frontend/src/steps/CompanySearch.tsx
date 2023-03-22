import * as React from 'react'
import { InputGroup, Button, Stack } from '@chakra-ui/react'
import Joi from 'joi'
import InputFloatingLabel from '../components/InputFloatingLabel'
import SelectFloatingLabel from '../components/SelectFloatingLabel'

import { ChevronRightIcon } from '@chakra-ui/icons'
import { useTranslation } from 'react-i18next'

function CompanySearch(props: any) {
  const { t } = useTranslation()
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

  return (
    <Stack spacing={5} pt={2}>
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
          placeholder={t('company_name')}
          value={props.company ? props.company.name : ''}
          onChange={props.changeHandler}
          name="name"
        />
      </InputGroup>

      <Button
        variant="next"
        rightIcon={<ChevronRightIcon />}
        isLoading={props.isLoading}
        onClick={props.getCompanies}
        isDisabled={!formValid}
      >
        {t('search')}
      </Button>
    </Stack>
  )
}

export default CompanySearch

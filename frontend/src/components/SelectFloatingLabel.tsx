import { FormControl, FormLabel, Select, useColorMode } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

function SelectFloatingLabel(props: any) {
  const { t } = useTranslation()
  const { colorMode } = useColorMode()

  return (
    <FormControl isRequired={props.isRequired}>
      <FormLabel bg={colorMode === 'light' ? 'white' : 'gray.800'}>
        {t('countries')}
      </FormLabel>
      <Select value={props.value} onChange={props.onChange} name={props.name}>
        <option hidden disabled value="">
          {t('select')}
        </option>
        {props.countries.map((country: any, i: any) => (
          <option key={i} value={country.code}>
            {country.name}
          </option>
        ))}
      </Select>
    </FormControl>
  )
}

export default SelectFloatingLabel

import { FormControl, FormLabel, Select, useColorMode } from '@chakra-ui/react'

function SelectFloatingLabel(props: any) {
  const { colorMode } = useColorMode()

  return (
    <FormControl variant="floating" isRequired={props.isRequired}>
      <Select value={props.value} onChange={props.onChange} name={props.name}>
        {props.countries.map((country: any, i: any) => (
          <option key={i} value={country.code}>
            {country.name}
          </option>
        ))}
      </Select>
      <FormLabel bg={colorMode === 'light' ? 'white' : 'gray.800'}>
        Country
      </FormLabel>
    </FormControl>
  )
}

export default SelectFloatingLabel

import { FormControl, FormLabel, Select, useColorMode } from '@chakra-ui/react'

function SelectFloatingLabel(props: any) {
  const { colorMode } = useColorMode()

  return (
    <FormControl isRequired={props.isRequired}>
      <FormLabel bg={colorMode === 'light' ? 'white' : 'gray.800'}>
        Country
      </FormLabel>
      <Select value={props.value} onChange={props.onChange} name={props.name}>
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

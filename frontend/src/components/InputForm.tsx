import { FormControl, FormLabel, Input, useColorMode } from '@chakra-ui/react'

function InputForm(props: any) {
  const { colorMode } = useColorMode()

  return (
    <FormControl
      id={props.name}
      isRequired={props.isRequired}
    >
      <FormLabel
        noOfLines={1}
        bg={colorMode === 'light' ? 'white' : 'gray.800'}
      >
        {props.placeholder}
      </FormLabel>
      <Input {...props} />
    </FormControl>
  )
}

export default InputForm

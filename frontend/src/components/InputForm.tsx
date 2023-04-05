import { FormControl, FormLabel, Input, useColorMode } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

function InputForm(props: any) {
  const { t } = useTranslation()
  const { colorMode } = useColorMode()

  return (
    <FormControl id={props.name} isRequired={props.isRequired}>
      <FormLabel
        noOfLines={1}
        bg={colorMode === 'light' ? 'white' : 'gray.800'}
      >
        {t(props.name)}
      </FormLabel>
      <Input {...props} />
    </FormControl>
  )
}

export default InputForm

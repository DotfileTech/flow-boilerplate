import { FormControl, FormLabel, Input, useColorMode } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const InputForm = (props: any) => {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();

  return (
    <FormControl id={props.name} isRequired={props.isRequired}>
      <FormLabel
        noOfLines={1}
        bg={colorMode === 'light' ? 'white' : 'gray.800'}
      >
        {t(props.name)}
      </FormLabel>
      <Input maxW="400px" {...props} />
    </FormControl>
  );
};

export default InputForm;

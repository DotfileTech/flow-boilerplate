import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

type InputFormProps = {
  stepId: string;
  name: string;
  defaultValue: string;
  isRequired: boolean;
  hasHelper?: boolean;
  type?: 'text' | 'date' | 'number' | 'url';
  onChange: any;
};

const InputForm = (props: InputFormProps) => {
  const {
    stepId,
    name,
    defaultValue,
    isRequired,
    hasHelper = false,
    type = 'text',
    onChange,
  } = props;

  const { t } = useTranslation();

  return (
    <FormControl isRequired={isRequired}>
      <FormLabel noOfLines={1}>{t(`steps.${stepId}.${name}.label`)}</FormLabel>
      {hasHelper && (
        <FormHelperText mt="0" mb="2">
          {t(`steps.${stepId}.${name}.helper`)}
        </FormHelperText>
      )}
      <Input
        name={name}
        type={type}
        defaultValue={defaultValue}
        onChange={onChange}
        maxW="400px"
      />
    </FormControl>
  );
};

export default InputForm;

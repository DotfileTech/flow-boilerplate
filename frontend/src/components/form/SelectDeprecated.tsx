import {
  FormLabel,
  FormControl,
  Select as ChakraSelect,
  FormHelperText,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

type SelectProps = {
  stepId: string;
  name: string;
  defaultValue: string;
  isRequired: boolean;
  hasHelper?: boolean;
  options: string[];
  onChange: any;
};

const SelectDeprecated = (props: SelectProps) => {
  const {
    stepId,
    name,
    defaultValue,
    isRequired,
    hasHelper = false,
    options,
    onChange,
  } = props;

  const { t } = useTranslation();

  return (
    <FormControl isRequired={isRequired}>
      <FormLabel>{t(`steps.${stepId}.${name}.label`)}</FormLabel>
      {hasHelper && (
        <FormHelperText mt="0" mb="2">
          {t(`steps.${stepId}.${name}.helper`)}
        </FormHelperText>
      )}
      <ChakraSelect
        name={name}
        onChange={onChange}
        defaultValue={defaultValue}
        maxW="400px"
      >
        <option hidden disabled value=""></option>
        {options.map((option: string) => (
          <option key={option} value={option}>
            {t(`steps.${stepId}.${name}.options.${option}`)}
          </option>
        ))}
      </ChakraSelect>
    </FormControl>
  );
};

export default SelectDeprecated;

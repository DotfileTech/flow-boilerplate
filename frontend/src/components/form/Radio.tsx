import {
  RadioGroup,
  Radio as ChakraRadio,
  Stack,
  FormLabel,
  FormControl,
  FormHelperText,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

type RadioProps = {
  stepId: string;
  name: string;
  defaultValue: string;
  isRequired: boolean;
  hasHelper?: boolean;
  options: string[];
  onChange: any;
};

const Radio = (props: RadioProps) => {
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
      <RadioGroup
        onChange={(value) => onChange(name, value)}
        name={name}
        defaultValue={defaultValue}
      >
        <Stack direction={{ base: 'column', sm: 'row' }} spacing="5">
          {options.map((option: string) => (
            <ChakraRadio key={option} value={option}>
              {t(`steps.${stepId}.${name}.options.${option}`)}
            </ChakraRadio>
          ))}
        </Stack>
      </RadioGroup>
    </FormControl>
  );
};

export default Radio;
